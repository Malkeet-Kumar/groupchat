const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    profilePic:String,
    groups:[
        {
            group_id:{
                type:mongoose.Types.ObjectId,
                ref:"Group"
            }
        }
    ]
})

const User = mongoose.model("chat_users", userSchema)
module.exports = User