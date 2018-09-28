<?php

include('bittrex.php');

try {
    echo api_call('account/getbalances');

} catch (Exception $e){
    echo json_encode(['error' => $e->getMessage()]);
}
