var Ticker = function(options){
	this.name = options.name;
	this.path = options.path;
	this.evaluate = options.evaluate;
	this.update_interval = options.update_interval;
	this.value = options.value;

	this.error_handler = function(err){
		console.error(err);
	}

	this.start = function(){

		var self = this;

		data.get({
			path: self.path,
			success: self.evaluate,
			error: self.error_handler
		});
		
		setTimeout(function(){
			self.start();
		}, self.update_interval);
	}

	this.start();
}

var ticker_coindesk = new Ticker({
	"path": "https://blockchain.info/ticker",
	"evaluate": function(result){
		set_bitcoin_price("coindesk", 0.5 * (result.EUR.buy + result.EUR.sell));	// halfway between asks and sells
	},
	"update_interval": 2351
});

var ticker_blockchain = new Ticker({
	"path": "https://api.coindesk.com/v1/bpi/currentprice/eur.json",
	"evaluate": function(result){
		set_bitcoin_price("blockchain", result.bpi.EUR.rate_float);					// only has rate
	},
	"update_interval": 2170
});

var ticker_bitstamp = new Ticker({
	"path": "https://www.bitstamp.net/api/v2/ticker/btceur/",
	"evaluate": function(result){
		set_bitcoin_price("bitstamp", 0.5 * (parseFloat(result.bid) + parseFloat(result.ask)));	// halfway between ask en bid
	},
	"update_interval": 1910
});


var ticker_bitfinex = new Ticker({
	"path": "https://api.bitfinex.com/v2/tickers?symbols=tBTCEUR",
	"evaluate": function(result){
		set_bitcoin_price("bitfinex", 0.5 * (result[0][1] + result[0][3]));	// halfway again
	},
	"update_interval": 9970,
});


// Websocket ticker
var pusher = new Pusher('de504dc5763aeef9ff52');
var tradesChannel = pusher.subscribe('live_trades_btceur');

tradesChannel.bind('trade', function (data) {
	set_bitcoin_price('bitstamp', data.price);
});



var ticker_prices = {};

var satoshis = new AnimateNumber(localStorage.getItem('satoshis'));
// satoshis.transform_speed = 0.01;
satoshis.precision = 0;
satoshis.format = function(){ return this.value.toFixed(0); }

var bitcoin_price = new AnimateNumber(localStorage.getItem('bitcoin'));
var bitcoin_1 = new AnimateNumber(localStorage.getItem('1 bitcoin'));

$(function(){

	satoshis.$bound = $('[name=satoshis]');
	bitcoin_price.$bound = $('[name=bitcoin_price]');
	bitcoin_1.$bound = $('[name=bitcoin_1]');

});

// Put this in the main animation loop
function bitcoin_paint(){

	satoshis.animate();
	bitcoin_price.animate();
	bitcoin_1.animate();
	// window.requestAnimationFrame(frame);

}

// window.requestAnimationFrame(frame);

/* Wallet from bittrex */

/*
var currencies = Array();

var update_wallet = function(){

	data.get({
		path: 'markets.php',
		success: function(result){

			var total = 0;
			Object.keys(result).forEach(function(currency){
				currencies[currency] = result[currency].value;

				if(currency == 'BTC')
					total += result[currency].amount;
				else
					total += result[currency].amount * result[currency].value;
			});

			satoshis.setValue(total * 100000000);
		},
		error: error_handler
	});

	setTimeout(update_wallet, 1000);
}

update_wallet();	
*/

var error_handler = function(error){
	console.error(error);
}

var set_bitcoin_price = function(ticker, price){

	ticker_prices[ticker] = price;
	var target_value = 0;
	var count = 0;

	Object.keys(ticker_prices).forEach(function(k){
		target_value += ticker_prices[k];
		count ++;
	});

	target_value /= count;

	bitcoin_1.setValue(target_value);
	localStorage.setItem('1 bitcoin', target_value);

	target_value *= 0.00000001 * satoshis.target_value;

	$('document > title').html(target_value.format(2, ',', '.'));

	bitcoin_price.setValue(target_value);

	localStorage.setItem('bitcoin', target_value);

}
