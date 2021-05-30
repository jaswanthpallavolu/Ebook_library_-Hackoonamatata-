const express=require('express');
const bodyParser = require('body-parser');
 
const bookRouter = express.Router();
const books = require('../../models/book');
bookRouter.use(bodyParser.json());
bookRouter.use(bodyParser.urlencoded({ extended: true }));
const {verifyAdmin} = require('../../verifyToken');
const usermodel = require('../../models/user')

bookRouter.route('/')
.get(verifyAdmin,(req,res)=>{
    const email = req.admin.email;
    books.find({})
    .then((book_s)=>{
        //res.send(book_s);
        res.render('adm_books',{ books : book_s ,data : {admin:email}});
    })
    .catch((err)=>{console.log(err);})
})

.post(verifyAdmin,async(req,res)=>{
    const exists = await books.findOne({url:req.body.url, name:req.body.name});
    if (exists) return res.send('book already exists')
    const book= new books({
        name :  req.body.name,
        url  :  req.body.url
    });
     book.save(book)
     .then((book)=>{
        console.log("added");
        res.redirect('/admin/books');
     })
     .catch((err)=>{
         console.log(err);
     });
 });

 bookRouter.route('/:id')
 .get(verifyAdmin,(req,res)=>{
     
    usermodel.find( { books: { $elemMatch: { _id: req.params.id} } }
    )
       .then(function(user_s) {
           books.findById(req.params.id)
             .then((book)=>{
                res.render('adm_book',{users :  user_s , book:book });
             })
             .catch((err)=>{
                 console.log(err);
             })         
  })
  .catch(function(err) {
    console.log(err);
  });
})


 .delete(verifyAdmin,(req,res)=>{
    const id = req.params.id;

    books.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "User was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
})

module.exports=bookRouter;