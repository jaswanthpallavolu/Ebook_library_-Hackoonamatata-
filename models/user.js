const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    name: {
        type: String,
        required: true,
         },


    url:{
        type:String,
        required:true,
    }
        
    },{
    timestamps: true
});

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
         },

    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },     
    books:[bookSchema]     
    },
    {
    timestamps: true
});

var users  = mongoose.model('users', userSchema);

module.exports =users; 