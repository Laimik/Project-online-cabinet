let express = require('express');
let server  = express();
let db = require('mongoose');

const port = 8000;

db.connect('mongodb://localhost/POC', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

server.listen(port, () => {
    console.log('Server is running at port ' + port);
});