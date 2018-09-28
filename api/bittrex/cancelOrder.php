<?php

include('bittrex.php');

try {

    echo api_call(
        'market/cancel',
        [
            "uuid" => $_POST['uuid']
        ]
    );

} catch (Exception $e){
    echo json_encode(['error' => $e->getMessage()]);
}
