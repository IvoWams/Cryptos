<?php

error_reporting(E_ALL ^ (E_NOTICE | E_WARNING));

function api_call($call, $options = [], $test = false){
	include 'config.php';

	$nonce = time();
	
	$uri = $server.$call.'?apikey='.$apikey.'&nonce='.$nonce.'&_='.rand(0, 99999999);

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
        
    return $execResult;
}