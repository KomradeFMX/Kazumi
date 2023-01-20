const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {
    init: () => {
        const ajustesDb = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            poolSize: 5,
            connectTimeoutMS: 10000,
            family: 4
        };

    mongoose.connect(process.env.MONDONGO);
    //mongoose.set('strictQuery', false);
    mongoose.Promise = global.Promise;

    mongoose.connection.on('connected', () => {
        console.log('Me he conectado con MONDONGO (db) B>');
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Me he desconectado de MONDONGO (db) :?');
    });

    mongoose.connection.on('err', (err) => {
        console.log('He tenido un error conectandome con MONDONGO (db) >:c' + err);
    });
        
    }
}
