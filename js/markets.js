// This fetches the current value of coins

var markets = {

	currencies: [],
	listeners: [],

	update_interval: 2000,

	update: function(){

		data.get({
			path: 'markets.php',
			success: function(result){
				markets.currencies = result;
				markets.listeners.forEach(function(l){ l(result); });
				setTimeout(markets.update, markets.update_interval);
			},
			error: markets.error_handler
		});
	},

	error_handler: function(e){
		console.error(e);

		setTimeout(markets.update, 10000);
	}
}

$(function(){ markets.update(); });