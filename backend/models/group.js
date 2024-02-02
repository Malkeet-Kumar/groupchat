// const mongoose = require('mongoose')

// const groupSchema = mongoose.Schema({
//     groupName: String,
//     groupDesc: String,
//     groupImage:String,
//     region:String,
//     createdBy: {
//         type: mongoose.Types.ObjectId,
//         unique: true
//     },
//     members: [
//         {
//             userId: {
//                 type: mongoose.Types.ObjectId,
//                 ref:"User"
//             }
//         }
//     ],
//     messages:[
//         {
            
//         }
//     ]
// }, { timestamps: true })

// const Group = mongoose.model("groups", groupSchema)
// module.exports = Group

// const {db} = require("./db")
// const {v4:uuid} = require("uuid")
// const arr = ["ASIA","ANTARTICA","AUSTRALIA","EUROPE","AFRICA","SOUTH AMERICA","NORTH AMREICA"]

// arr.forEach(continent=>{
//     const qry = `insert into region values("${uuid()}","${continent}")`
//     db.query(qry,(err,res)=>{
//         if(err){
//             console.log(err);
//             return 
//         }
//         console.log(res);
//     })
// })