const express = require('express')
const app = express()

app.use(express.static("dist/"))

app.listen(3000,(err)=>{
    if(err){
        console.log(err);
    }
    console.log("started");
})