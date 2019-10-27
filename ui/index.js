const client = new speech.SpeechClient();

'use strict';
const Hapi = require('@hapi/hapi');
const fs = require('fs')
const axios = require('axios')
const speech = require('@google-cloud/speech');
const ffmpeg = require('fluent-ffmpeg');

'use strict';
const Hapi = require('@hapi/hapi');
const init = async () => {
    const server = Hapi.server({
        port: 3005,
        host: 'localhost'
    });
    server.route({
        method: 'POST',
        path: '/speech',
        config: {
            handler: async (request, h) => {
                // we will code the logic here
            },
            payload: {
                output: 'stream',
                parse: true,
            }
        }
    })
    await server.start();
    console.log('Server running on %s', server.info.uri);
};
process.on('unhandledRejection', (err) => {
    console.log(err);
});
init();