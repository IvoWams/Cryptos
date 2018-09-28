// Formatting

Number.prototype.format = function(c, d, t){
	var n = this, 
	c = isNaN(c = Math.abs(c)) ? 2 : c, 
	d = d == undefined ? "." : d, 
	t = t == undefined ? "," : t, 
	s = n < 0 ? "-" : "", 
	i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))), 
	j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}

Number.prototype.formatNice = function(){
	if(isNaN(this)) return '?';
	var v = Math.abs(this);
	var s = ''; // this.value >= 0 ? 'b' : 'a';
	if(v == 0) return s + '0 ';
	if(v < 0.001) return s + (1000000 * v).format(0, '', '') + ' &micro;';
	if (v < 1) return s + (1000 * v).format(0, '', '') + ' m';
	if(v < 10000) return s + v.toFixed(0) + ' ';
	if(v < 10000000) return s + (0.001 * v).format(0, '', '') + ' K';
	return s + (0.000001 * v).format(0, '', '') + ' M';
}