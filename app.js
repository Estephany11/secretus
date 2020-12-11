//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption")


///// 2.1 mongo db 
const mongoose = require("mongoose")


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
	extended: true
}))


///// 2.2 Connect to database 
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true})

///// 2.3 Schema 
//// 3.1 actualizar schema
const userSchema = new mongoose.Schema ({
	email: String,
	password: String
});

///// 3.2 crear secreto 

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]})

///// 2.3 Modal
// la regla para el modal es capital letter y singular 
const User = new mongoose.model("User", userSchema)



///// 1 RENDERING PAGES 

app.get("/", function(req,res){
	res.render("home")
})

app.get("/login", function(req,res){
	res.render("login")
})

app.get("/register", function(req,res){
	res.render("register")
})


///// 2.4 Captura el post request realizado al register route 
app.post("/register", function(req, res){
	// crea nuevo usuario
	const newUser = new User({
		email: req.body.username,
		password: req.body.password 
	})

	newUser.save(function(err){
		if(err){
			console.log(err)
		}else{
			res.render("secrets")
		}
	})
})

///// 2.5 Capturar el post request realizado al login route 
app.post("/login", function(req,res){
	const username = req.body.username
	const password = req.body.password

///// 2.6 Comparar datos con la database 
User.findOne({email:username}, function(err, foundUser){
	if (err){
		console.log(err)
	}else{
		if (foundUser){
			if (foundUser.password === password){
				res.render("secrets")
			}
		}
	}
})

})









app.listen(3000, function(){
	console.log("Server started on port 3000")
})
