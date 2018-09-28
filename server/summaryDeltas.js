const signalR = require ('signalr-client');
const jsonic = require('../../../../Users/amaka/AppData/Local/Microsoft/TypeScript/2.9/node_modules/@types/jsonic');
const zlib = require('zlib');
const connection = require('./database.js').connection;

// connection.connect()

const client  = new signalR.client('wss://beta.bittrex.com/signalr', ['c2']);

client.serviceHandlers.connected = function (connection) {

  console.log('connected'); 

  client.call('c2', 'SubscribeToSummaryDeltas')
  
    .done(function(err, result){
        if(err)
            return console.error(err);


        if(result === true)
            console.log ('Subscribed to Summary Delta`s');

    });
}


function update_markets(market){

    let values = Object.values(market);

    var sql = `

        INSERT INTO
            markets
        (
            Market,
            High,
            Low,
            Volume,
            Last,
            BaseVolume,
            Timestamp,
            Bid,
            Ask,
            OpenBuyOrders,
            OpenSellOrders,
            PrevDay,
            Created
        )

        VALUES

        (?)

        ON DUPLICATE KEY UPDATE

        High = VALUES(High),
        Low = VALUES(Low),
        Volume = VALUES(Volume),
        Last = VALUES(Last),
        BaseVolume = VALUES(BaseVolume),
        Timestamp = VALUES(Timestamp),
        Bid = VALUES(Bid),
        Ask = VALUES(Ask),
        OpenBuyOrders = VALUES(OpenBuyOrders),
        OpenSellOrders = VALUES(OpenSellOrders),
        PrevDay = VALUES(PrevDay),
        Created = VALUES(Created)

    `;
    
    var q = connection.query(sql, [values], function(err, results, fields){
        if(err){
            console.log(q.sql);
            throw err;
        }
    });
}

let data, b64, raw, json;

client.serviceHandlers.messageReceived = function(message){

    data = jsonic(message.utf8Data);

    // If we have a data.M[0].A[0] ...
    if(data.hasOwnProperty('M') && data.M[0] && data.M[0].hasOwnProperty('A') && data.M[0].A[0]){

        // Base64decode it and unzip it
        b64 = data.M[0].A[0];
        raw = new Buffer.from(b64, 'base64');

        zlib.inflateRaw(raw, function(err, inflated){
            if(!err){

                json = JSON.parse(inflated.toString('utf8'));

                for(i in json['D'])
                    update_markets(json['D'][i]);

                /*
                    H - High
                    L - Low
                    V - Volume
                    l - Last
                    m - BaseVolume
                    T - Timestamp
                    B - Bid
                    A - Ask
                    G - OpenBuyOrders
                    g - OpenSellOrders
                    PD - PrevDay
                    x - Created
                */
                
                // console.log(json);

            }
        });

    }

};