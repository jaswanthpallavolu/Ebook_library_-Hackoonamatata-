const express = require('express');
const regRouter = express();
const bcrypt = require('bcrypt');

//importing user model
const user = require('../../models/user');

regRouter.route('/')
.post(async(req,res)=>{
    try{
        //check email exists or not
        const emailExists = await user.findOne({email:req.body.email});
        if (emailExists) return res.send('email exists already ');
        if (req.body.password != req.body.confirm) return res.send('passwords not matched')

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashPswd = await bcrypt.hash(req.body.password,salt);

        const newusr = new user({
            name:req.body.name,
            email:req.body.email,
            password: hashPswd
        });
        newusr.save()
        .then(
            ()=> console.log('user created'),
            (err) =>console.log(err)   
        )
        res.render('login',{created:true,loggedout:false,email:false,pswd:false}); 
    }
    catch(err)
    {
        console.log(err);
    }
})

module.exports = regRouter