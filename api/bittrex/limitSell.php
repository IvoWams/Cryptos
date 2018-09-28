<?php

include('bittrex.php');

try {
    
    echo api_call(  
        'market/selllimit',
        [
            "market" => $_POST['market'],
            "quantity" => $_POST['quantity'],
            "rate" => $_POST['rate']
        ]
    );

} catch (Exception $e){
    echo json_encode(['error' => $e->getMessage()]);
}
