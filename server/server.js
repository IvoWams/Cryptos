/**
 *  Node.js example 
 *  https://github.com/Bittrex/beta
 *
 *  Adrian Soluch
 *
 *  prerequisites:
 *  npm i signalr-client jsonic
 *
 *  tested on node v9.10.1
 */
const signalR = require ('signalr-client');
const jsonic = require('../../../../Users/amaka/AppData/Local/Microsoft/TypeScript/2.9/node_modules/@types/jsonic');
const zlib = require('zlib');
var mysql = require('../../../../Users/amaka/AppData/Local/Microsoft/TypeScript/2.9/node_modules/@types/mysql');

var connection = mysql.createConnection({
  host     : '10.0.0.28',
  user     : 'ivo',
  password : 'psi0nisch',
  database : 'cryptos'
});

connection.connect()

// connection.end()

const client  = new signalR.client (
  'wss://beta.bittrex.com/signalr',
  ['c2']
);

let market = 'BTC-NLG',
    data,
    b64,
    raw,
    json;

client.serviceHandlers.connected = function (connection) {
  console.log ('connected'); 
  client.call ('c2', 'SubscribeToExchangeDeltas', market).done (function (err, result) {
    if (err) { return console.error (err); }
    if (result === true) {
      console.log ('Subscribed to ' + market);
    }
  });
}

let book = {buy: {}, sell: {}};
let fills = {};

function merge_book(data){
    // Buy
    for(i in data['Z']){
        let buy = data['Z'][i];
        if(buy['Q'] == '0' || buy['TY'] == '1')
            delete(book.buy['R']);

        else
            book.buy[buy['R']] = buy['Q'];
    }

    // Sell
    for(i in data['S']){
        let sell = data['S'][i];
        if(sell['Q'] == '0' || sell['TY'] == '1')
            delete(book.sell['R']);

        else
            book.sell[sell['R']] = sell['Q'];
    } 
}


function add_fills(f){
    for(i in f){
        let fill = f[i];
        console.log(fill);
        // FI - FillId
        // OT - OrderType (buy or sell)
        // R - Rate
        // Q - Quantity
        // T - Timestamp
        if(!fills[fill['R']])
            fills[fill['R']] = 0;

        fills[fill['R']] += (fill['OT'] == 'Buy' ? fill['Q'] : -fill['Q']);

        var data = [
            market,
            fill['R'],
            (fill['OT'] == 'Buy' ? fill['Q'] : -fill['Q'])
        ];

        var sql = `

            INSERT INTO
                fill
            (
                market, rate, quantity
            )

            VALUES

            (?)

            ON DUPLICATE KEY UPDATE

            quantity = quantity + VALUES(quantity)

        `;
        
        var q = connection.query(sql, [data], function(err, results, fields){
            console.log(q.sql);

            if(err)
                throw err;
        });

        console.log(q.sql);
    }

    
}

// Type: 0 = add, 1 = remove, 2 = update

client.serviceHandlers.messageReceived = function (message) {
  data = jsonic (message.utf8Data);
  if (data.hasOwnProperty ('M')) {
    if (data.M[0]) {
      if (data.M[0].hasOwnProperty ('A')) {
        if (data.M[0].A[0]) {
          /**
           *  handling the GZip and base64 compression
           *  https://github.com/Bittrex/beta#response-handling
           */
          b64 = data.M[0].A[0];
          raw = new Buffer.from(b64, 'base64');

          zlib.inflateRaw (raw, function (err, inflated) {
            if (! err) {
              json = JSON.parse (inflated.toString ('utf8'));
              // console.log (json);

              merge_book(json);
              add_fills(json['f']);
              console.log(fills);

            }
          });
        }
      }
    }
  }
};