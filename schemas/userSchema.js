const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:Number,
        required:true,
        min: 1000000000,
        max: 9999999999  
    },
    password:{
        type:String,
        required:true
    },
    isOnline:{
        type:Boolean,
        default:false
    }
})

module.exports = userSchema;