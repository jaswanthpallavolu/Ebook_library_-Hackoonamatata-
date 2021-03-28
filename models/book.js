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
    },
    rating:{
        type:String,
        required:true,
        default:"3"
    }    
    },{
    timestamps: true
});

var books  = mongoose.model('books', bookSchema);

module.exports =books; 