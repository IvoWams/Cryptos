<?php

include('bittrex.php');

// Output only markets with balances

// $balances = get_balances();
$markets = get_markets();

echo json_encode($markets, JSON_PRETTY_PRINT);

/*
$result = [];

foreach(get_balances() as $balance){
	// if($balance['Balance'] > 0)
		$result[$balance['Currency']] = array('amount' => $balance['Balance'], 'value' => 0);
}

foreach($result as $currency => $wallet){
	if($markets['BTC-'.$currency])
		$result[$currency]['value'] = $markets['BTC-'.$currency]['Last'];
}

echo json_encode($result, JSON_PRETTY_PRINT);
*/