//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParesr = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));

app.use(bodyParesr.urlencoded({extended : true}));

app.set('view engine','ejs');


mongoose.connect("mongodb://0.0.0.0:27017/userDB");

const userSchema = new mongoose.Schema({
  email : String,
  password : String
});



//adding encrypt package as plugin before User monoogse model
userSchema.plugin(encrypt,{secret : process.env.SECRET, encryptedFields :  ['password']});

const User = new mongoose.model("User",userSchema);


app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){


  const newUser = new User({
    email : req.body.username,
    password : req.body.password
  });

  newUser.save().then(function(){
    res.render("secrets");
  }).catch(err => {
    console.log(err);
  })
});


app.post("/login",function(req,res){

  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email :username}).then(function(foundUser){
    if(foundUser){
      if(foundUser.password === password){
        res.render("secrets");
      }
    }
  })
    .catch(function(err){
    console.log(err);
  })
});


app.listen(3000,function(){
  console.log("Server started on port 3000");
})
