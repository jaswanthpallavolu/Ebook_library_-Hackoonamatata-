const express = require("express");
const http=require("http");
const bodyParser = require('body-parser');
const axios=require("axios");
const mongoose=require('mongoose');
const cp = require('cookie-parser');
// view engine setup
const expresslayouts = require('express-ejs-layouts');
require('dotenv').config();

// environment variable db_connection used 
const connect = mongoose.connect(process.env.db_connection,
    {useNewUrlParser: true,useUnifiedTopology: true});

connect.then((db) => {
    console.log('Connected correctly to server');
},(err)=>{console.log(err);}
);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cp());
app.use(expresslayouts);
app.set("view engine", "ejs");

//default layout
app.set('layout','./layout/admin_layout.ejs');
app.use(express.static(__dirname + '/public/'));
// app.use(express.static(__dirname + '/public/css'));
// app.use(express.static(__dirname + '/public/html'));

//Admin routes 
app.use('/admin/books', require('./routes/admin/bookRouter'));
app.use('/admin/users', require('./routes/admin/usersRouter'));
app.use('/admin/home', require('./routes/admin/homeRouter'));

//main login route
app.use('/login', require('./routes/loginRouters'));

//registration route
app.use('/register',require('./routes/user/RegRouter'));

//User routes 
app.use('/user',require('./routes/user/user-Router'));


app.get("/",(req,res)=>{
    res.sendFile(__dirname + '/public/html/Homepage.html')
});
 
//registration
app.get('/Uregister',(req,res)=>{
    res.render('regform');
})
 
const port= process.env.PORT || 8000;
const server=http.createServer(app);
server.listen(port,()=>{console.log('server running')})

  