/*

	Cryptos
	Author: Ivo Wams <i.wams@anyflex.nl>
	Date: 2017-18

*/

var modal_currency = null;

function buy_or_sell(c){
	modal_currency = c;

	available();
	current();

	// Position modal just underneath the currency tile
	var $tile = $('currency#'+ c.Currency);
	var left = $tile.offset().left + 0.5 * ($tile.outerWidth() - $('#buy_or_sell').outerWidth() - 4);
	var top = $tile.offset().top + $tile.outerHeight();

	if(left < 0)
		left = 0;

	if(top < 0)
		top = 0;

	$('#buy_or_sell')
		.css({ left: left, top: top })
		.fadeIn(100);
}

$(function(){
	$('body').click(function(e){
		if(e.target.nodeName == 'BODY')
			$('#buy_or_sell').fadeOut(100);
	});
});

function getMarket(name){
	for(market in markets.currencies)
		if(market == 'BTC-'+ name)
			return markets.currencies[market];
}

function available(){
	if(modal_currency)
		$('[data=available]').val(modal_currency.Available);
}

function current(){
	if(modal_currency == null)
		return;

	var market = getMarket(modal_currency.Currency);
	if(market == undefined)
		return;

	$('[data=at]').val(market.Last);
}

$(document)
	.on('keydown', 'html', function(e){
		if(e.key == 'Escape')
			$('#buy_or_sell').fadeOut(100);
	});

$(function(){

	var $portfolio_container = $('#portfolio_container');
	var deleted_orders = [];

	var $currency = function(currency){

		if(currency.Currency == undefined)
			return;	

		var $element = $('<currency id="'+ currency.Currency +'"></currency>');

		// Do not show if no balance, no sells and no buys
		$element.toggleClass('empty', currency.Balance == 0 && currency.Sell == undefined && currency.Buy == undefined);
	
		$element.attr('id', currency.Currency);

		if(currency.Balance){

			$element.append('<title>'+ currency.Balance.formatNice() + currency.Currency +'</title>');

			if(currency.Currency == 'BTC')
				$element.append('<value>&euro;'+ (currency.Balance * 1 * bitcoin_1.value).format(2, ',', '.') +'</value>');

			else if(markets.currencies['BTC-'+ currency.Currency])
				$element.append('<value>&euro;'+ (currency.Balance * markets.currencies['BTC-'+ currency.Currency].Last * bitcoin_1.value).format(2, ',', '.') +'</value>');
				
		}

		if(currency.Sell){

			if(currency.Sell.length > 1){
				var total_sell = 0;
				currency.Sell.forEach(function(s){ total_sell += s.QuantityRemaining; });
				$element.append('<total>SELLING '+ total_sell.formatNice() +'</total>');
			}

			currency.Sell
				.filter(function(a){
					// This prevents repainting of sell if being sold
					return $.inArray(a.OrderUuid, deleted_orders) == -1;
				})
				.sort(function(a, b){
					return a.Limit < b.Limit ? 1 : -1;
				})
				.forEach(function(s){
					
					$sell_elm = $('<sell>'+ s.Exchange.split('-').shift() +' '+ s.QuantityRemaining.formatNice() +' @ '+ s.Limit.format(8, ',', '.') +'</sell>');

					$sell_elm.click(function(e){
						e.stopPropagation();
						$(this).fadeOut(100);
						portfolio.cancel_order(s.OrderUuid);
						deleted_orders.push(s.OrderUuid);
					});

					$element.append($sell_elm);
				});
		}

		if(currency.Currency == 'BTC'){

			// Nothing

		} else {

			var market = markets.currencies['BTC-'+ currency.Currency];
			if(market)
				$element.append('<current>'+ market.Last.format(8, ',', '.') +'</current>');

		}

		if(currency.Buy){
			var total_buy = 0;
			currency.Buy
				.filter(function(a){
					// This prevents repainting of sell if being sold
					return $.inArray(a.OrderUuid, deleted_orders) == -1;
				})
				.sort(function(a, b){
					return a.Limit < b.Limit ? 1 : -1;
				})
				.forEach(function(b){

					$buy_elm = $('<buy>'+ b.Exchange.split('-').shift() +' '+  b.QuantityRemaining.formatNice()  +' @ '+ b.Limit.format(8, ',', '.') +'</buy>');

					$buy_elm.click(function(e){
						e.stopPropagation();
						$(this).fadeOut(100);
						portfolio.cancel_order(b.OrderUuid);
						deleted_orders.push(b.OrderUuid);
					});

					$element.append($buy_elm);

					total_buy += b.QuantityRemaining;
				});

			if(currency.Buy.length > 1)
				$element.append('<total>BUYING '+ total_buy.formatNice() + '</total>');
		}

		// $element.append('<buttons><a href="#">Sell</a><a href="#">Buy</a></buttons>');

		$element.click(function(){
			buy_or_sell(currency);
		})
			
		return $element;
	};

	var update_function = function(){

		// $portfolio_container.empty();

		var total_satoshis = 0;
			
		Object.keys(portfolio.currencies).forEach(function(key){
			var currency = portfolio.currencies[key];
		
			if($('#'+ currency.Currency)[0])
				$('#'+ currency.Currency).replaceWith($currency(currency));

			else
				$portfolio_container.append($currency(currency));

			if(currency.Balance > 0)
			{

				if(currency.Currency == 'BTC')
				{
					total_satoshis += currency.Balance;

				} else {

					if(markets.currencies['BTC-'+ currency.Currency])
						total_satoshis += markets.currencies['BTC-'+ currency.Currency].Last * currency.Balance;

					else 
						console.warn('No market value for '+ currency.Currency);
						
				}

			}

			// Update satoshis
		});

		satoshis.setValue(total_satoshis * 100000000);

	}

	// Subscribe to any changes
	portfolio.listeners.push(update_function);
	markets.listeners.push(update_function);

});


$(document)
	.on('click', 'togglebutton', function(){
		$(this).toggleClass('toggle');
	});

$(function(){

	var g = new Graph({ container: '#fullscreengraph', points: 10000, lineColor: [1, 1, 1, 0.1] });

	for(var x in g.points)
		g.points[2 * x + 1] = -1;

	

	var b_low = parseFloat(localStorage.getItem('1 bitcoin')) - 10;
	var b_high = b_low + 500;

	// g.gl.viewport(0, 10, -100, -100);

	setInterval(function(){

		if(bitcoin_1.value > b_high)
			b_high = bitcoin_1.value;

		if(bitcoin_1.value < b_low)
			b_low = bitcoin_1.value;

		var p = - 1 + 2 * (bitcoin_1.value - b_low) / (b_high - b_low);
		// var p = 250; //bitcoin_1.value;
		
		g.addPoint(p);
		g.traverse();

	}, 100);

	function main_paint_loop(){

		g.adjustCanvasSize();
		g.updateBuffer();
		g.paint();

		bitcoin_paint();

		requestAnimationFrame(main_paint_loop);
	}

	requestAnimationFrame(main_paint_loop);

});