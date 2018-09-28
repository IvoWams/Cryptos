var AnimateNumber = function(n){
	this.value = parseFloat(n) || 0;
	this.target_value = this.value;
	this.previous_value = this.value;
	this.reversed = false;
	this.$bound = null;

	// Default format is money
	this.format = function(){
		return this.value.format(2, ',', '.');
	}

	this.transform_speed = 0.1;
	this.precision = 2;

	this.transform = function(){
		var size = this.transform_speed * Math.abs(this.target_value - this.value);
		if(this.value.toFixed(this.precision) == this.target_value.toFixed(this.precision)){
			this.value = this.target_value; //.toFixed(this.precision);
			size = 0;
		}
			
		else {
			if(size < 0.1 * this.transform_speed) size = 0; // 0.1 * this.transform_speed;
		
			if(this.target_value != 0)
				this.value += (this.value < this.target_value) ? size : -size;
			
		}
	}
	
	this.setValue = function(nr){
		this.previous_value = this.value;
		this.target_value = nr;
	}
	
	this.animate = function(){

		this.transform();
			
		if(this.$bound)
			$(this.$bound)
				.toggleClass(this.reversed ? 'down' : 'up', this.target_value.toFixed(this.precision) > this.value.toFixed(this.precision))
				.toggleClass(this.reversed ? 'up' : 'down', this.target_value.toFixed(this.precision) < this.value.toFixed(this.precision))
				.html(this.format());
	
	}
}