<?php

include('bittrex.php');

$post = json_decode(file_get_contents('php://input', 'r'));

try {
    
    echo api_call(  
        'market/buylimit',
        [
            "market" => $post->market,
            "quantity" => $post->quantity,
            "rate" => $post->rate
        ]
    );

} catch (Exception $e){
    echo json_encode(['error' => $e->getMessage()]);
}
