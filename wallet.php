<?php

// Use markets

include('bittrex.php');

function add_balance(&$balances, $currency, $value){
	foreach($balances as &$c)
		if(strtoupper($c['Currency'] == strtoupper($currency)))
			$c['Balance'] += $value;
}

try {
	
	$bittrex_balances = get_balances();
	add_balance($bittrex_balances, 'NLG', 10060);
	
	// Also other accounts ?
	
	// print_r($bittrex_balances);
	// die();
	
	echo json_encode(get_balances(), JSON_PRETTY_PRINT);

} catch(Exception $e){
	echo 'Error: '.$e->getMessage();
}
