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
