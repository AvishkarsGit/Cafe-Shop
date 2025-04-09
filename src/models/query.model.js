const { required, number } = require('joi')
const mongoose = require('mongoose')

const querySet = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }

})

module.exports = mongoose.model("query",querySet);