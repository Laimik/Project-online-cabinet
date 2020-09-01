const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const authRouter = require('./routes/auth');
const addressesRouter = require('./routes/addresses');
const counterTypeRouter = require('./routes/counter_types');
const counterRouter = require('./routes/counters');
const counterValuesRouter = require('./routes/counter_values');
const profileRouter = require('./routes/profile');

const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('../swagger.json');
const cors = require("cors");
swaggerDocument.host=""
swaggerDocument.port=process.env.HTTP_PORT || '3000'

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const whitelist = ['localhost'];
const corsOptions = {
    origin: function (origin, callback) {
        if (origin) {
            const {hostname} = new URL(origin);
            if (whitelist.indexOf(hostname) !== -1) {
                callback(null, true);
            } else {
                callback(new Error(`${hostname} (${origin}) Not allowed by CORS`));
            }
        } else {
            callback(null, true);
        }
    }
};
app.use(cors(corsOptions));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/auth', authRouter);
app.use('/api/v1/counter_types', counterTypeRouter);
app.use('/api/v1/addresses', addressesRouter);
app.use('/api/v1/counters', counterRouter);
app.use('/api/v1/counters/:counter_id/values', counterValuesRouter);
app.use('/api/v1/profile', profileRouter);

module.exports = app;
