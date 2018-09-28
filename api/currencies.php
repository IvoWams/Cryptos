<?php

include('bittrex.php');

try {

    echo api_call('public/getcurrencies');

} catch (Exception $e){
    echo json_encode(['error' => $e->getMessage()]);
}
