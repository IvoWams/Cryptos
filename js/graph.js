
/*
    let btc_nlg_graph = new Graph({ container: '#btc_nlg_container' });
    requestAnimationFrame({ btc_nlg_graph.paint(); });
*/

class Graph {

    constructor(options){

        this.attachContainer(options.container);

        if(options.lineColor)
            this.setColor(options.lineColor[0], options.lineColor[1], options.lineColor[2], options.lineColor[3]);
        else
            this.setColor(1, 1, 1, 0);

        this.createPoints(options.points ? options.points : 500);
        this.createShaders();

    }

    attachContainer(selector){

        if(this.container && this.canvas)
            this.container.removeChild(this.canvas);

        // Find container to attach to
        this.container = document.querySelector(selector);

        if(!this.container)
            throw new Error("Unable to find container");

        if(!this.container.appendChild)
            throw new Error('Unable to bind to provided container');

        this.canvas = document.createElement('canvas');
        this.canvas.id = "graphcanvas";

        this.container.appendChild(this.canvas);
        this.adjustCanvasSize();

        // Create gl
        this.gl = this.canvas.getContext('webgl');
        console.log(this.gl);
    }

    createPoints(nrPoints){
        this.nrPoints = nrPoints;

        // Delete previous points
        if(this.points)
            delete(this.points);

        // Create new points
        this.points = new Float32Array(2 * nrPoints);

        // Plot points from -1 to 1 on the X axis
        for(var i in this.points){
            this.points[2 * i] = -1 + (2 / nrPoints) * i;
            this.points[2 * i + 1] = 0;
        }

        this.updateBuffer();
    }

    // Create the shaders on init
    createShaders(){

        // Create vertex shader
        this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(this.vertexShader, `
            precision mediump float;
            attribute vec2 position;
            
            void main(void) {
                gl_Position = vec4(position.x, position.y, 0.0, 1.0);
            }
        `);

        this.gl.compileShader(this.vertexShader);
        
        // Create fragment shader
        this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(this.fragmentShader, `
            precision highp float;
        
            void main(void) {
                gl_FragColor = vec4(`+ this.fColor +`);
            }
        `);

        this.gl.compileShader(this.fragmentShader);
                
        this.glProgram = this.gl.createProgram();
        this.gl.attachShader(this.glProgram, this.vertexShader);
        this.gl.attachShader(this.glProgram, this.fragmentShader);
        this.gl.linkProgram(this.glProgram);
        
        this.glBuffer = this.gl.createBuffer();

        this.updateBuffer();

        const attribPosition = this.gl.getAttribLocation(this.glProgram, "position");
        this.gl.vertexAttribPointer(attribPosition, 2, this.gl.FLOAT, false, 0, 0);
        this.gl.enableVertexAttribArray(attribPosition);
        
        // this.gl.viewport(0, 0, 480, 480);
        
        this.gl.useProgram(this.glProgram);        
    }    

    // Update this.points to gl memory
    updateBuffer(){
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.glBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.points, this.gl.STATIC_DRAW);
    }

    adjustCanvasSize(){
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
    }

    paint(){
        this.gl.clearColor(0.0, 0.0, 0.0, 0.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);    
        this.gl.lineWidth(0.5);
        
        this.gl.drawArrays(this.gl.LINE_STRIP, 0, this.nrPoints);   
    }

    // Ranges from 0 - 1
    setColor(r, g, b, a){
        this.fColor = r +", "+ g +", "+ b +", "+ a;
    }

    // Set value @ x to y, Ranges from -1 to 1
    setPoint(x, y){
        this.points[2 * x + 1] = y;
    }

    // Sets a point at the end of the line, ranges from -1 to 1
    addPoint(y){
        this.points[2 * this.nrPoints - 1] = y;
    }

    // Scrolls the line one point to the left
    traverse(){
        for(var i = 0; i < this.nrPoints - 1; i++)
            this.points[2 * i + 1] = this.points[2 * i + 3];
    }

}