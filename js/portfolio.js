var portfolio = {

	currencies: [],
	listeners: [],

	update_interval: 5000,

	update: function(){

		data.get({
			path: 'portfolio.php',
			success: function(result){

				portfolio.currencies = result;
				portfolio.listeners.forEach(function(l){ l(result); });

				setTimeout(portfolio.update, portfolio.update_interval);
			},
			error: portfolio.error_handler
		});

	},

	cancel_order: function(order_uuid){

		data.post({
			path: 'cancel_order.php',
			data: {
				order_uuid: order_uuid
			},
			success: function(result){
				// ...
			},
			error: portfolio.error_handler
		});

	},

	error_handler: function(e){
		console.error(e);

		setTimeout(portfolio.update, 10000);
	}
};

$(function(){
	portfolio.update();
});
