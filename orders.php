<?php

include('bittrex.php');

$result = [];

$count = 0;

foreach(get_open_orders() as $order){
	$result[] = $order;	//$order['OrderUuid']
}

echo json_encode($result, JSON_PRETTY_PRINT);