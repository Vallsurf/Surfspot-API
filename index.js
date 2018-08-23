const express = require('express'); 
const mongoose = require('mongoose');
const morgan = require('morgan'); 
const bodyParser = require('body-parser'); 
var cors = require('cors')
const app = express(); 
const { PORT, DATABASE_URL, CLIENT_ORIGIN } = require('./config');

require('dotenv').config();


const { router: spotsRouter } = require('./routers/spots.router');
const { router: usersRouter } = require('./routers/users.router');
const { router: authRouter } = require('./routers/auth.router');


app.use(bodyParser.json());
app.use(morgan('common'));

mongoose.Promise = global.Promise;

let server; 

// CORS
app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

//Routes
app.use('/api/spots', spotsRouter);
app.use('/api/user', usersRouter);
app.use('/api/login', authRouter);





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