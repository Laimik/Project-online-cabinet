const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session =require('express-session');
const cors = require('cors');
const db = require('mongoose');
const errorHandler = require('errorhandler');

db.promise = global.Promise;

isProduct = process.env.NODE_ENV === 'production';

const server  = express();

server.use(cors());
server.use(require('morgan')('dev'));
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
server.use(express.static(path.join(__dirname, 'public')));
server.use(session({ secret: 'POC', cookie: { maxAge: 60000}, resave: false, saveUninitialized: false}));

if(!isProduct) {
    server.use(errorHandler());
}

db.connect('mongodb://localhost/POC', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
db.set('debug', true);

require('./db/models/users');
require('./config/passport');
server.use(require('./routes'));

if(!isProduct) {
    server.use((err, req, res) => {
        res.status(err.status || 500);

        res.json({
            errors: {
                message: err.message,
                error: err,
            },
        });
    });
}

server.use((err, req, res) => {
    res.status(err.status || 500);

    res.json({
        errors: {
            message: err.message,
            error: {},
        },
    });
});

const port = 8000;

server.listen(port, () => {
    console.log('Server is running at port ' + port);
});