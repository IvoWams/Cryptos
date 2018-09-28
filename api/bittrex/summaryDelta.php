<?php

include('../database.php');

$query = $mysqli->query("SELECT * FROM markets");
while($row = $query->fetch_assoc())
    $result[] = $row;

echo json_encode($result);