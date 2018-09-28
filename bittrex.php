<?php

error_reporting(E_ALL ^ (E_NOTICE | E_WARNING));

function api_call($call, $options = []){
	include 'config.php';

	$nonce = time();
	
	$uri='https://bittrex.com/api/v1.1/'.$call.'?apikey='.$apikey.'&nonce='.$nonce.'&_='.rand(0, 99999999);

	foreach($options as $key => $value)
		$uri.= '&'.urlencode($key)."=".urlencode($value);

	$sign = hash_hmac('sha512', $uri, $apisecret);

	$ch = curl_init($uri);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('apisign:'.$sign));
	$execResult = curl_exec($ch);

	if(curl_error($ch))
		throw new Exception($ch);

	$obj = json_decode($execResult, true);
	
	if($obj['success'] != '1')
		throw new Exception($obj['message']."\nURL: $uri");

	return $obj['result'];
}

function get_balances(){
	return api_call('account/getbalances');
}

function get_ticker($ticker){
	return api_call('public/getticker');
}


function get_open_orders(){
	return api_call('market/getopenorders');	
}

function get_order_history(){
	return api_call('account/getorderhistory');
}

function get_market_summaries(){
	return api_call('public/getmarketsummaries');
}

function get_markets(){
	foreach(get_market_summaries() as $market)
		$markets[$market['MarketName']] = $market;

	return $markets;
}

// Some other stuff

function cancel_order($order_uuid){
	return api_call('market/cancel', ["uuid" => $order_uuid]);
}