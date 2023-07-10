const dotenv = require("dotenv")
const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const mongoose = require("mongoose")
dotenv.config({path:'./config.env'});
const DB = process.env.DATABASE
const PORT = process.env.PORT

mongoose.connect(DB, {
    useNewUrlParser:true, 
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connection successfull to the database")
}).catch((err)=>console.log("Error in the connection"))

const User = require("./model/userSchema");

app.use(express.json());
app.use(cookieParser());
app.use(require('./routes/auth'));


app.listen(PORT, () => {
    console.log(`The application started successfully on port ${PORT}`);
});




