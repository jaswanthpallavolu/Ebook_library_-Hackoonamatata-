const express = require('express');
const jwt = require('jsonwebtoken');
const usermodel = require('../../models/user');
const bodyParser = require('body-parser');
const books =require('../../models/book');
const user_Router = express.Router();
user_Router.use(bodyParser.json());
user_Router.use(bodyParser.urlencoded({ extended: true }));
const {verifyUser} = require('../../verifyToken');
const { countDocuments } = require('../../models/user');

//const verify = require('../../verifyToken');
user_Router.route("/")
.get(verifyUser,(req,res)=>{

    const authcookie = req.cookies['usr-token']
    jwt.verify(authcookie, process.env.usr_secret, (err, data) => {
        if (err) {
             
            res.data = data;
        }
        else{
            usermodel.findById(data.id)
            .then((user)=>{
                           books.find({})
                          .then((book_s)=>{
                            res.render('user_home' , { books : book_s, user : user.email})
                                 })
                           .catch((err)=>{console.log(err);})
  
                            });
                        }

});

});

//about page
user_Router.get('/about',verifyUser,(req,res)=>{

    const authcookie = req.cookies['usr-token']
    jwt.verify(authcookie, process.env.usr_secret, (err, data) => {
        if (err) {
             
            res.data = data;
        }
        else{
            usermodel.findById(data.id)
            .then((user)=>{
                res.render('about',{user : user.email});
            })
            
        }} )
    
    
})
//for user Logout
user_Router.get('/logout',(req,res)=>{
    res.clearCookie('usr-token');
    res.render('login',{ created:false,loggedout:true,email:false,pswd:false});
})

 
user_Router.route("/book/:bId")
.get(verifyUser, (req,res)=>{
    const authcookie = req.cookies['usr-token']
    jwt.verify(authcookie, process.env.usr_secret, (err, data) => {
        if (err) {
             
            res.data = data;
        }
        else{
            usermodel.findById (data.id)
            .then((user) => {
                if (user != null) {
                      
                     
                      var user_book=user.books.id(req.params.bId);
                       
                      books.findById(req.params.bId)
                      .then((book)=>{
                        res.render('user_book' ,{user_book : user_book,book : book});
                      })
                      .catch((err)=>{
                          console.log(err);
                      }); 
                }
                else {
                     console.log("user not found");
                 }
                })
                .catch((err)=>{
                      console.log(err);       });
        
           
             
        }
        
    })
})
 
.post((req,res)=>{
     
    const authcookie = req.cookies['usr-token']
    jwt.verify(authcookie, process.env.usr_secret, (err, data) => {
        if (err) {
             
            res.data = data;
        }
        else{
            usermodel.findById (data.id)
            .then((user)=>{
                if (user != null) {

                    books.findById(req.params.bId)
                    .then((book)=>{
                      user.books.push(book);
                      user.save()
                      .then((user)=>{
                          res.send(user);
                      })
                      .catch((err)=>{
                          console.log(err);
                      });
                    })
                    .catch((err)=>{console.log(err);});
           
           
              }
              else {
                   console.log("user not found");
               }





            })
         
        }
        });
    })

    

user_Router.route("/owned")
.get(verifyUser,(req,res)=>{

      
    const authcookie = req.cookies['usr-token']
    jwt.verify(authcookie, process.env.usr_secret, (err, data) => {
        if (err) {
             
            res.data = data;
        }
        else{
         usermodel.findById(data.id)
         .then((user)=>{
             var book_s=user.books
             res.render('user_books',{books : book_s , user:user.email})

         })  

        }

    });

})



module.exports = user_Router;




