# Single page crypto trading

## Goal
Having a single web page to quickly create and cancelling trade orders on multiple (currently only Bittrex) exchanges, and to provide a fast real time overview of balances and values.

## Requirements
This currently requires PHP for keeping api keys secure and sending commands to apis. So you need to run this currently on a webserver. In the future api keys could maybe be stored in localStorage, and api calls be moved to front side.

## config.php
Be sure to create a config.php in the root with the folling:

```php
<?php

$apikey = 'Your api key here';
