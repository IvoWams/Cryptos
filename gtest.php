<html>
<body>

<div style="width: 500px; height: 500px;" id="container"></div>

<script type="text/javascript" src="js/graph.js"></script>
<script>

    var g = new Graph({ container: '#container', points: 500, lineColor: [1, 1, 0, 1] });
    var c = 0;

    function paint(){

        g.traverse();
        g.addPoint(Math.sin(0.01 * c++));

        g.updateBuffer();

        g.paint();


        requestAnimationFrame(paint);
    }

    requestAnimationFrame(paint);

</script>
</body>
</html>