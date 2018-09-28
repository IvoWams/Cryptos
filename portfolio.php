<?php

include('bittrex.php');

function currency_pair($str){
	$pair = explode('-', $str);
	if(count($pair) != 2)
		throw new Exception('Cannot parse');
	return $pair;
}

function add_balance(&$currencies, $currency, $value){
	$currencies[$currency]['Balance'] += $value;
	// $currencies[$currency]['Available'] += $value;
	/*
	foreach($balances as &$c)
		if(strtoupper($c['Currency'] == strtoupper($currency)))
			$c['Balance'] += $value;
	*/
}

try {

	foreach(get_balances() as $currency)
		$currencies[$currency['Currency']] = $currency;

	foreach(get_open_orders() as $order){
		$pair = currency_pair($order['Exchange']);
		// Assume everything is BTC <-> Target
		if($order['OrderType'] == 'LIMIT_BUY')	// Buy NLG for our BTC
			$currencies[$pair[1]]['Buy'][] = $order;
		else if($order['OrderType'] == 'LIMIT_SELL')
			$currencies[$pair[1]]['Sell'][] = $order;
	}

	// Get this from somewhere else ?
	// add_balance($currencies, "NLG", 10203.7931);		// Nocks
	add_balance($currencies, "XMR", 0.021737208182);	// Wallet
	// add_balance($currencies, "NLG", 32827.282);	// Just bought
	// add_balance($currencies, "NLG", 452);	// Wallet

	echo json_encode($currencies, JSON_PRETTY_PRINT);

} catch(Exception $e){
	echo 'Error: '.$e->getMessage();
}
