const express = require('express');
const usersRouter = express.Router();
const usermodel = require('../../models/user');
const bodyParser = require('body-parser');
usersRouter.use(bodyParser.json());
usersRouter.use(bodyParser.urlencoded({ extended: true }));

const {verifyAdmin} = require('../../verifyToken');

usersRouter.route('/')
.get(verifyAdmin,(req,res)=>{
    //res.clearCookie('head');
    const email = req.admin.email
    usermodel.find({})
    .then(
        (data)=>res.render('adm_users',{ user:data,data:{admin:email} }),
        (err)=>{console.log(err);}
        );
    
})

usersRouter.route('/create')
.post((req,res)=>{
    const add = new usermodel({
        name:req.body.name,
        email:req.body.email,
        pswd:req.body.pswd,
        usrid:req.body.usrid
    })
    add.save()
    .then(
        ()=>{console.log('successfully created');
            res.send(add)},
        (err)=>{console.log(err);}
    )
})

module.exports = usersRouter
