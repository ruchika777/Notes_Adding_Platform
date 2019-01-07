const express = require('express');
const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
var router = express.Router();
const nodemailer = require('nodemailer');

function handleSayHello(req, res){
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'ruchikapawar7@gmail.com',
			pass: 'sonali777'
		}
	});

	const mailOptions = {
		from: 'ruchikapawar7@gmail.com',
		to: 'ruchikapawar7@gmail.com',
		subject: 'Testing nodemailerDemo',
		html: '<a href: "Click here to verify your email">Verify Email</a>'
	};

	transporter.sendMail(mailOptions, function(err, info){
		if(err)
			console.log(err);
		else
			console.log(info);
	});
}

handleSayHello();