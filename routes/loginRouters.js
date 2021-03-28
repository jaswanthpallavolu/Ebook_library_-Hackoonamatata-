const express=require('express');
const bodyParser = require('body-parser');
 
const loginRouter = express.Router();
const admins = require('../models/admin');
const users = require('../models/user');
loginRouter.use(bodyParser.json());
loginRouter.use(bodyParser.urlencoded({ extended: true }));

const jwt = require('jsonwebtoken');
const cp = require('cookie-parser');
const bcrypt = require('bcrypt');


loginRouter.get('/',(req,res)=>{
    res.render('login',{created:false,loggedout:false,email:false,pswd:false});
})

loginRouter.route('/createAdmin')
.post(async(req,res)=>{

     //check email exists or not
     const emailExists = await admins.findOne({email:req.body.email});
     if (emailExists) return res.send('email exists already ');

     //hash password
     const salt = await bcrypt.genSalt(10);
     const hashPswd = await bcrypt.hash(req.body.pswd,salt);
    const admin = new admins({
        name: req.body.name,
        email: req.body.email,
        pswd: hashPswd
    })
    admin.save()
    .then(
        ()=>{console.log('admin created')},
        (err)=>{console.log(err)}
    ) 
})

loginRouter.route('/admlog') 
.post(async(req,res)=>{
    // checking emailid
    try{
    // console.log(req.body.email)
    const admin = await admins.findOne({email:req.body.email});
    if (!admin) return res.render('login',{created:false,loggedout:false,email:true,pswd:false});
  
    //checking password
    const validPswd = await bcrypt.compare(req.body.pswd,admin.pswd);
    if (!validPswd) return res.render('login',{created:false,loggedout:false,email:false,pswd:true});
    
    //create and assign admin token
    const token = await jwt.sign({id: admin._id,email: admin.email}, process.env.adm_secret);
    res.cookie("adm-token", token, {secure: false, sameSite:false,maxAge:9000000, httpOnly: true})
    
    res.status(201).redirect('/admin/home');
    
    }
    catch(err)
    {
        console.log(err);
    }
        
})

//for users
loginRouter.route('/usrlog') 
.post(async(req,res)=>{
   
    try{
    // console.log(req.body.email)
    // checking emailid
    const user = await users.findOne({email:req.body.email});
    if (!user) return  res.render('login',{created:false,loggedout:false,email:true,pswd:false});
    //checking password
    const validPswd = await bcrypt.compare(req.body.pswd,user.password);
    if (!validPswd) return  res.render('login',{created:false,loggedout:false,email:false,pswd:true});


    //create and assign admin token
    const token = await jwt.sign({id: user._id, name : user.name }, process.env.usr_secret);
    res.cookie("usr-token", token, {secure: false, sameSite:false,maxAge:9000000, httpOnly: true}) 
    res.status(201).redirect('/user');
     
    }
    catch(err)
    {
        console.log(err);
    }
        
})

module.exports = loginRouter