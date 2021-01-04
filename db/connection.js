const mongoose = require('mongoose');

const url = "mongodb://localhost:27017/commentApp";
mongoose.connect(url,{
    useCreateIndex : true,
    useUnifiedTopology : true,
    useFindAndModify : true,
    useNewUrlParser : true
}).then(()=>{
    console.log("db connection is successsfull ");
}).catch((error)=>{console.log('connection error' + error)});