<?php

include('bittrex.php');

$post = json_decode(file_get_contents('php://input', 'r'), true);

try {

    $result = cancel_order($post['order_uuid']);
    echo json_encode(['success' => 'ok']);

} catch (Exception $e){
    echo json_encode(['error' => $e->getMessage()]);
}
