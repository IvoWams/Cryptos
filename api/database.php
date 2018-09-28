<?php

error_reporting(E_ALL ^ (E_NOTICE | E_WARNING | E_DEPRECATED));

$mysqli = new mysqli("127.0.0.1", "root", "psi0nisch", "cryptos");

if($mysqli->connect_error)
    die($mysqli->connect_error);
