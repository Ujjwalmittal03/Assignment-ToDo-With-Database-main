const mongoose = require("mongoose");

module.exports.init = async function () {
  await mongoose.connect(
    "mongodb+srv://aayush22:JaiShreeRam@cluster0.xsr364r.mongodb.net/Assignment-ToDo-With-Database-main?retryWrites=true&w=majority"
  );
  console.log("Connected to database");
};
