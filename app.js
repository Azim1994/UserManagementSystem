const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mysql = require('mysql');

require('dotenv').config();
require('datejs');

const app = express();
const port = process.env.PORT || 4000;

//Parsing middleware
//Parse application/x-ww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//Parse application/json
app.use(bodyParser.json());

//Static files
app.use(express.static('public'));

//Templating Engine
app.engine('hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');

// Connecting pool
const pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB_NAME
});

// Connecting to database
pool.getConnection((err, connection) => {
    if(err) throw err; //not connected
    console.log('Connected as ID ' + connection.threadId);
});

const routes = require('./server/routes/user');
app.use('/', routes);

app.listen(port, () => console.log(`Listening on port ${port}`));