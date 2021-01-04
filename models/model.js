const mongoose = require('mongoose');


const Schema = new mongoose.Schema({
    username : {
        type : String,
        required : true
    },
    comment : {
        type : String,
        required : true
    }
},{timestamps : true});

const Model = new mongoose.model("commentcol",Schema);
module.exports = Model; 