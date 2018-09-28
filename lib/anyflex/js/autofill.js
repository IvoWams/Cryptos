/*

// Observer
var AutoFill = function(init){

	// var format_list = init.format_list || AutoFill.default_format_list;

	// External datasource
	var datasource = init.datasource || console.error("No datasource provided");

	var format = init.format || 'default';

	// Oberserving
	var subject = init.subject || [];

	// Change triggers
	var change_trigger = init.on_change || function(){};
}

// List of known conversion rules
AutoFill.format_list = [
	{
		"boolean": function(value){
			return value ? "Yes" : "No";
		}
	}
];

AutoFill.prototype.add_format = function(type, formatter){
	AutoFill.format_list.push({
		type: function(value){
			return formatter(value);
		}
	});
}



// From change -> variable
AutoFill.prototype.change = function(target){
	this.subject = target;
	this.change_trigger(target);
}

// From datasource -> change
AutoFill.prototype.read = function(){
	var that = this;
	data.get({
		path: that.datasource,
		success: that.change
	});
}

// From variable -> datasource
AutoFill.prototype.write = function(){
	data.post({
		path: that.datasource,
		data: that.subject
	});
}
*/

/*
 * Autofiller
 * (c)2017 Anyflex, Ivo Wams
 * 
 * Provide an entity, add formatting types to your DOM, then call fill().
 * formatting to a null value hides the parameter pair box entirely.
 * 
 * Example -
 * DOM: <div/input/select/... bind="[variable name]" format="[format]"></div>
 * Jscript: obj.date_start = '2017-2-1 ...'; autofill.fill();
 * 
 */

var autofill =
	{

		format:
		{

			// When no formatting or unknown formatting defined
			"default": function (str) {
				if (str === null)
					return null;

				if (typeof str == 'number')
					return autofill.format.number(str);

				if (typeof str == 'string')
					return autofill.format.string(str);

				if (typeof str == 'object') {

					if (str.constructor.name == 'Date')
						return moment(str).format('LL');	// Special case

					if (str.toString)
						return autofill.format.string(str.toString());

				}

				return null;
			},

			// Primitives
			"boolean": function (val) {
				return get_string(val ? "YES" : "NO");
			},

			"integer": function (val) {

				var parse = parseInt(val);
				if (isNaN(parse)) {
					console.warn('Not a number: ', val);
					return null;
				}

				return parse;
			},

			"number": function (nr) {
				return nr;
			},

			"string": function (str) {
				return str;
			},

			"duration": function (time) {
				return nice.duration(parseInt(time));
			},

			"file_size": function (bytes) {
				return nice.file_size(bytes);
			},

			"bytes": function (bytes) {
				return nice.file_size(bytes);
			},

			"percentage": function (value, total) {
				return Math.round(100 * value / total) + '%';
			},

			"checkbox": function(value){
				return value == null ? false : value == true;
			},

			// Conversions

			"content_type": function (str) {

				if (str === null) return 'Geen';
				return {
					"image": get_string('IMAGE'),
					"slide": get_string("SLIDE"),
					"movie": get_string("VIDEO")
				}[str];

			},

			// Objects
			"date": function (obj) {
				return (obj && obj.date) ? moment(obj.date).format('L') : null;
			},

			// Entities
			"brand": function (brand) {
				return brand ? autofill.format.string(brand.name) : null;
			},

			"account": function (account) {
				return account ? autofill.format.string(account.name) : null;
			},

			"content": function (content) {
				return content ? autofill.format.string(content.title) : null;
			},

			"device": function (device) {
				return device ? autofill.format.string(device.info + ' @ ' + device.mac) : null;
			},

			"download": function (download) {
				return download ? autofill.format.content(download.content) + ' (' + autofill.format.string(download.status) + ')' : null;
			},

			"playlist": function (playlist) {
				return playlist ? autofill.format.string(playlist.name) : null;
			},

			"playlist_node": function (node) {
				return node ? autofill.format.content(node.content) : null;
			},

			"repository": function (repository) {
				return repository ? autofill.format.string(repostory.name) : null;
			},

			"slide": function (slide) {
				return slide ? autofill.format.string(slide.name) : null;
			},

			"upload": function (upload) {
				return upload ? autofill.format.string(upload.name) : null;
			},

			// CSS
			"backgroundImage": function(str) {
				return 'url('+ str +')';
			}
		},

		// Reverse, flood interface elements and fields back into source
/*
		flood: function () {

			$('[bind]')
				.each(function(i, e){

					try {

						if(['INPUT', 'SELECT'].indexOf(e.tagName) != -1)
							;

					}

					catch(e){
						console.error(e);
					}

				})

		},
*/
		fill: function (init) {

			var hide_parent = (init && init.hide_parent) || false;

			$('[bind]')
				.each(function (i, e) {
					try {
						var source = e.getAttribute('bind');
						var bind = eval(source);

						if (bind === undefined)
							return console.warn('Unable to bind ' + e.getAttribute('bind'));

						var format = autofill.format[e.getAttribute('format')] || autofill.format.default;
						var value = format(bind);

						if(hide_parent)
							e.parentElement.style.display = value === null | bind === null ? 'none' : 'block';

						// Bind to alternate attributes (ie. style)
						var bind_to_attr = e.attributes['bindToAttr'];
						// Bind to properties (ie. "checked")
						var bind_to_prop = e.attributes['bindToProp'];

						if(bind_to_attr){
							if(e[bind_to_attr.value] == undefined)
								return console.warn('Unable to bindToAttr ' + bind_to_attr.value);

							e[bind_to_attr.value][e.attributes['format'].value] = value;
						}

						else if(bind_to_prop){

							if(e[bind_to_prop.value] == undefined){
								console.warn('Unable to bindToProp ' + bind_to_prop.value);
								return;
							}

							e[bind_to_prop.value] = value;
						}

						// Bind to interface elements
						else {

							if(['INPUT', 'SELECT'].indexOf(e.tagName) != -1){
								e.value = value;
							
							} else 
								// Change innerHTML prototype to fire change events ?
								e.innerHTML = value;
							
						}


						// Feed interface element back into
						/*
						e.addEventListener("change", function(){
							eval(source + " = '" + escape.string(e.value) +"'");
						});
						*/

					} catch(err){
						console.warn(err);
						if(e.parentElement && hide_parent)
							e.parentElement.style.display = 'none';
					}

				});

		}

	}

