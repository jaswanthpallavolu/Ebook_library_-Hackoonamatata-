const express=require('express');
const app1 = express();
const bodyParser = require('body-parser');
const homeRouter = express.Router();
 
 
//middleware
const {verifyAdmin} = require('../../verifyToken');

homeRouter.route('/')
.get( verifyAdmin,(req,res)=>{
    
    const email = req.admin.email
    res.render('adm_home.ejs',{data:{
        admin: email
        } 
        }
    );
})

homeRouter.route('/logout')
.get(async(req,res,next)=>{
    res.admin = null;
    res.clearCookie('adm-token');
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    // req.admin.destroy();
    // console.log("logged out") 
    res.render('login',{ created:false,loggedout:true,email:false,pswd:false});
    next()
})

module.exports = homeRouter