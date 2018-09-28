<?php

include('bittrex.php');

try {

    echo api_call('public/getmarkets');

} catch (Exception $e){
    echo json_encode(['error' => $e->getMessage()]);
}
