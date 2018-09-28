<html>
<script type="text/javascript" src="lib/jquery/jquery-3.1.0.min.js"></script>
<script type="text/javascript" src="lib/anyflex/js/data.js"></script>
<script type="text/javascript" src="lib/pusher/pusher.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"></script>

<script type="text/javascript" src="js/AnimateNumber.js"></script>
<script type="text/javascript" src="js/Ticker.js"></script>
<script type="text/javascript" src="js/index.js"></script>

<link href="https://fonts.googleapis.com/css?family=Russo+One" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Share+Tech+Mono" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Nova+Mono" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Barlow+Semi+Condensed:400,900i" rel="stylesheet">
<link rel="stylesheet" href="css/css.css">
<title></title>

<body>

	<div id="sell"  style="position: fixed; left: 0px; right: 0px; top: 0px; display: flex; align-items: flex-start; justify-content: baseline; flex-direction: row;">

	</div>


	<div style="position: fixed; left: 0px; top: 0px; right: 0px; bottom: 0px; display: flex; align-items: center; justify-content: center; flex-direction: column;">

		<div class="pair">
			<div class="number" name="bitcoin_price">-</div>
		</div>

	</div>

	<div style="position: fixed; left: 0px; right: 0px; bottom: 0px; display: flex; align-items: center; justify-content: space-evenly; flex-direction: row;">		

		<div class="pair">
			<div class="header">LOWEST</div>
			<div class="number smaller" name="bitcoin_lowest">-</div>
		</div>		

		<div class="pair">
			<div class="header">HIGHEST</div>
			<div class="number smaller" name="bitcoin_highest">-</div>
		</div>	

		<div class="pair">
			<div class="header">SATOSHIS</div>
			<div class="number smaller" name="satoshis">-</div>
		</div>			

		<div class="pair">
			<div class="header">BITCOIN</div>
			<div class="number smaller" name="bitcoin_1">-</div>
		</div>

	</div>

</body>

</html>
	