const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
    name: {
        type: String,
        required: true,
         },

    email:{
        type:String,
        required:true,
    },
    pswd:{
        type:String,
        required:true,
    },
    
},
    {
    timestamps: true
});

var admins  = mongoose.model('admins', adminSchema);

module.exports = admins; 