/*
 * Promises wrapper
 * (c)2017 Anyflex, Ivo Wams
 * 
 * This queues a bunch of ajax calls
 * 
 */



// A queue would look like this
/*

var promise_queue = [
    {
        inject: 'brands',
        path: '/data/brands/'
    },
    {
        inject: 'settings',
        path: '/data/settings/'
    }
];

*/

var promises =
    {

        queue: [],

        add: function (inject, path) {
            promises.queue.push({
                inject: inject,
                path: path
            });

            return promises;
        },

        iterate: function (result, head, tail, finish) {

            new Promise(

                function (resolve, reject) {
                    data.get({
                        path: head.path,
                        success: function (value) {
                            resolve(value);
                        },
                        error: function (error) {
                            reject(error);
                        }
                    });
                }

            ).then(function (value) {

                result[head.inject] = value;

            }).then(function () {

                if (tail.length == 0)
                    finish(result);
                else
                    promises.iterate(result, tail[0], tail.splice(1), finish);

            }).catch(function (error) {

                console.error(error);

            });

        },

        then: function (callback) {


            promises.iterate([], promises.queue[0], promises.queue.splice(1), function (result) {
                callback(result);
            });

        }

    }