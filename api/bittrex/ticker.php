<?php

include('bittrex.php');

try {

    echo api_call(
        'public/getticker',
        [
            "market" => $_POST['market']
        ],
        true
    );

} catch (Exception $e){
    echo json_encode(['error' => $e->getMessage()]);
}
