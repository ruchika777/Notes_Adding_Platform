const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const mongo = require('mongodb');
const mongoose = require('mongoose');
var router = express.Router();

mongoose.connect('mongodb://localhost/AddNote', { useNewUrlParser: true });
console.log("Connected to database AddNote");
var db = mongoose.connection;

var routes = require('./routes/index');

//Init app
var app = express();

//Error handling middleware
app.use(function(err, req, res, next){

		console.log("Error:", err.stack);
});

// initialize body-parser to parse incoming parameters requests to req.body
app.use(bodyParser.urlencoded({ extended: true }));

// initialize cookie-parser to allow us access the cookies stored in the browser. 
app.use(cookieParser());

//Express Session
app.use(session({
	key: 'user_sid',
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));


app.use('/', routes);

//Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started @ port'+app.get('port'));
});

