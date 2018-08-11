const express = require('express'); 
const mongoose = require('mongoose');
const morgan = require('morgan'); 
const bodyParser = require('body-parser'); 
const app = express(); 
const { PORT, DATABASE_URL } = require('./config');

require('dotenv').config();


const { router: spotsRouter } = require('./routers/spots.router');


app.use(bodyParser.json());
app.use(morgan('common'));

mongoose.Promise = global.Promise;

let server; 


//Routes
app.use('/api/spots', spotsRouter);


// CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.send(204);
    }
    next();
});



// Starting and Ending Scripts
function runServer(databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, (err) => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve();
            })
                .on('error', (err) => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close((err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    }));
}


if (require.main === module) {
    runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };