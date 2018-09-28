<?php

include('bittrex.php');

try {

    echo api_call('market/getopenorders');

} catch (Exception $e){
    echo json_encode(['error' => $e->getMessage()]);
}
