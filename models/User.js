const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: String,
    email:String,
    password:String,
    isActive:{
        type:Boolean,
        default:true
    },
})

const User = mongoose.model("User", userSchema)

module.exports = User;