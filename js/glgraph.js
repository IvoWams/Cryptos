        var vertices = [
            -0.7,-0.1,0,
            -0.3,0.6,0,
            -0.3,-0.3,0,
            0.2,0.6,0,
            0.3,-0.3,0,
            0.7,0.6,0 
         ]
var b_prices = new Float32Array(vertices);

var b_prices_i = 0;
var highest = 0;
var lowest = 9999;

var s = 0;

var frames_per_count = 100;
var frames = 0;

var canvas, gl;

$(function(){
	
	canvas = document.querySelector("#graph");
	gl = canvas.getContext("webgl");
	
	 var vertex_buffer = gl.createBuffer();

	 // Bind appropriate array buffer to it
	 gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

	 // Pass the vertex data to the buffer
	 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	 // Unbind the buffer
	 gl.bindBuffer(gl.ARRAY_BUFFER, null);
	 
	 // Apparantly shaders
 
	/*=================== Shaders ====================*/

	 // Vertex shader source code
	 var vertCode =
		'attribute vec3 coordinates;' +
		'void main(void) {' +
		   ' gl_Position = vec4(coordinates, 1.0);' +
		'}';

	 // Create a vertex shader object
	 var vertShader = gl.createShader(gl.VERTEX_SHADER);

	 // Attach vertex shader source code
	 gl.shaderSource(vertShader, vertCode);

	 // Compile the vertex shader
	 gl.compileShader(vertShader);

	 // Fragment shader source code
	 var fragCode =
		'void main(void) {' +
		   'gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
		'}';

	 // Create fragment shader object
	 var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

	 // Attach fragment shader source code
	 gl.shaderSource(fragShader, fragCode);

	 // Compile the fragmentt shader
	 gl.compileShader(fragShader);

	 // Create a shader program object to store
	 // the combined shader program
	 var shaderProgram = gl.createProgram();

	 // Attach a vertex shader
	 gl.attachShader(shaderProgram, vertShader);

	 // Attach a fragment shader
	 gl.attachShader(shaderProgram, fragShader);

	 // Link both the programs
	 gl.linkProgram(shaderProgram);

	 // Use the combined shader program object
	 gl.useProgram(shaderProgram);

	 /*======= Associating shaders to buffer objects ======*/

	 // Bind vertex buffer object
	 gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

	 // Get the attribute location
	 var coord = gl.getAttribLocation(shaderProgram, "coordinates");

	 // Point an attribute to the currently bound VBO
	 gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

	 // Enable the attribute
	 gl.enableVertexAttribArray(coord);	 
	
	gl.clearColor(0, 0, 0, 0);
	gl.enable(gl.DEPTH_TEST);

	 gl.viewport(0,0,canvas.width,canvas.height);
	 
	 // Clear the color and depth buffer
	 gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	 // Set the view port

	 // Draw the triangle
	 gl.drawArrays(gl.LINES, 0, 6);	 
	
	requestAnimationFrame(glgraph);
	
});

var glgraph = function(){
	
	
	/*============ Drawing the triangle =============*/

	 // Clear the canvas
	 // gl.clearColor(0.5, 0.5, 0.5, 0.9);

	 // Enable the depth test


	
	
	requestAnimationFrame(glgraph);
}



var graphpaint = function(){

	frames ++;

	if(frames > frames_per_count){
		frames = 0;

		var canvas = document.getElementById("graph");
		canvas.width = $(document).width();
		canvas.height = $(document).height();

		var ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.scale(1, 1);
		ctx.lineWidth = 0.9;
		ctx.strokeStyle = "#A0B0C0";

		var new_value = parseInt(bitcoin_1.value);

		if(new_value < 0)
			new_value = 0;

		if(new_value > 32767)
			new_value = 32767;

		if(new_value > highest)
			highest = new_value;

		if(new_value < lowest)
			lowest = new_value;

		b_prices_i = b_prices_i > b_prices.length ? 0 : b_prices_i + 1;
		b_prices[b_prices_i] = new_value;	

		ctx.beginPath();

		for(var i = 0; i < b_prices.length; i++){

			var index = b_prices_i - i;
			if(index < 0) index += b_prices.length;

			var y = canvas.height - b_prices[index];
			var x = canvas.width - parseInt(i * (canvas.width / b_prices.length));
			ctx.moveTo(x, canvas.height);
			ctx.lineTo(x, y + lowest);
			ctx.stroke();

		}

	}

	requestAnimationFrame(graphpaint);
}

















$(function(){
	// graphpaint();
	
});