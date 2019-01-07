const express = require('express');
const session = require('express-session');
var User = require('../models/user.js');
var Note = require('../models/note.js');
var bodyParser = require('body-parser');
var router = express.Router();
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var mongo = require('mongodb');
var mongoose = require('mongoose');
const nodemailer = require('nodemailer');
//var cache = require('express-redis-cache')();
//const apicache = require('apicache');
const redis = require('redis');
const client = redis.createClient();

// let cacheWithRedis = apicache
// 					.options({redisClient: redis.createClient()})
// 					.middleware
// router.get('/will-be-cached', cacheWithRedis('5 minutes'), (req, res)=>{
// 	res.json({ success: true});
// });
								

//Middleware for user Authentication & Authorization
router.get('/isAuthenticated', function(req, res){
	if(req.session.email && req.session.password){
		res.send("Valid user..");
	}
	else{
		res.send("Login first..");
	}
	
});


//Express Session
app.use(session({
	key: 'user_sid',
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));


//Register
router.post('/register', (req, res)=>{
	 	let name = req.body.name;
	 	let email = req.body.email;
		let password = req.body.password;
		let age = req.body.age;
		let gender = req.body.gender;

	var user1 = new User({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		age: req.body.age,
		gender: req.body.gender,
		
	});
	console.log(req.body);

	var url = "http://"+req.get('host')+"/verify?email="+email;

	user1.save(function(err, db){
		if(err)
			res.send(err);
		else
			res.send("Sucessfully registered... ");

	
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: 'ruchikapawar7@gmail.com',
			pass: 'ruchik@15'
		}
	});

	const mailOptions = {
		from: 'ruchikapawar7@gmail.com',
		to: 'ruchikapawar7@gmail.com',
		subject: 'Verify your emailID',
		html: "<p>Click here to verify your email</p><br><a href = " +url+ ">Verify Email</a>"
	};

	transporter.sendMail(mailOptions, function(err, info){
		if(err)
			console.log(err);
		else
			console.log(info);
	});


	});

});

//Verify Email
router.get('/verify', (req, res)=>{
	
	let email = req.query.email;
	User.findOneAndUpdate({email: email}, {$set: {isAuthenticated: true}}, function(err, result){
		if(err){
			res.send(err);
		}
		else{
			// res.send("User confirmed...");
			res.json(result);

		}

	})
});

//Display AllUsers
//Get
router.get('/allUsers', function(req, res){
	User.find({}).then(usrs=>{
		res.send(usrs);
	});
});



//Login
router.post('/loginhere', (req, res)=>{
	var email = req.body.email;
	var password = req.body.password;

	req.session.email = email;
	req.session.password = password;

	client.set("email", email, redis.print);
	client.get("email", (err, reply)=>{
		console.log(reply.toString());
	});

	User.findOne({email: email, isAuthenticated: true}, (err, user)=>{
		if(err){
			console.log(err);
			res.send('Error');
			res.json(user);
		}
		
		if(!user){
				 res.send('User not found..');
		}
		else{

			req.session.user = user;
			res.send('Successfully logged in..');
		}
	});

});		 

//Logout
router.get('/logout', (req, res)=>{
	req.session.destroy();
	res.send("Logout Sucessfully");
});


//Middleware for CRUD api access
function isValid(req, res,next){
	if(req.session.email && req.session.password){
		//res.send("Valid user");
		next();
	}
	else{
		res.send("You need to login first!");
	}

}

//CRUD API for Notes

//Post
router.post('/addNotes', isValid, (req, res)=>{
	var note = new Note({
		subject: req.body.subject,
		content: req.body.content,
		tag: req.body.tag
	});

	//res.json(req.body);

	note.save(function(err, db){
	if(err){
		res.send(err);
	}
	else{
		res.send("Successfully Inserted...");
	}
});
});

//Get
router.get('/allNotes', isValid, function(req, res){
	Note.find({}).then(notes=>{
		res.send(notes);
	});
});

//Put
router.put('/updateNotes/:notesID', isValid, function(req, res){
	Note.findOneAndUpdate({_id: req.params.notesID}, {$set:{
		subject: req.body.subject,
		content: req.body.content,
		tag: req.body.tag
	}}, {new: true}).then(note=>{
		if(!note){
			return res.status(404).send({
				message: "Notes not found with ID" +req.params.notesID
			});
		}

		else{
			res.send(note);
			console.log(req.body);
		}
	});
});

//Delete
router.delete('/deleteNotes/:notesID', isValid, function(req, res){
	Note.remove({_id: req.params.notesID}).then(note=>{
		if(!note){
			return res.status(404).send({
				message: "Notes not found with ID" +req.params.notesID
			});
		}

		else{
			res.send("Notes deleted..");
			
		}
	});
});




module.exports = router;