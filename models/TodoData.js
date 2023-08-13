const mongoose = require("mongoose");
const TodoDataschema = mongoose.Schema({
    text: String,
    iscompleted:{
        type:Boolean,
        default:false
    },
    createdBy: String,
    imageName: String,
    isActive:{
        type:Boolean,
        default:true
    }
}) 

const TodoData = mongoose.model("TodoData",TodoDataschema);
module.exports = TodoData;