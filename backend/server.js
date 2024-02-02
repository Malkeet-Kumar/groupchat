const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const multer = require("multer")
const cors = require("cors")
const server = express()
const httpServer = http.createServer(server)
const db = require("./models/db")

const upload = multer({dest:"uploads/"})
server.use(upload.any())
server.use(express.json())
server.use(express.urlencoded({extended:true}))
server.use(express.static("uploads/"))

server.use((req,res,next)=>{
  console.log("url->",req.url);
  console.log("method->",req.method);
  console.log("body->",req.body);
  console.log("files->",req.files);
  next()
})

server.use(cors({ origin: "http://localhost:5173" }))
const port = 8000

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173"
  }
});

const socket = require('./socket')(io)

const chatRoutes = require("./routes/chatRoutes")
const exp = require("constants")
server.use("/",chatRoutes)


db.init()
.then((res) => {
  httpServer.listen(port, (err) => {
    if (err) {
      console.log(err);
      return
    }
    console.log("server started");
  })
})
.catch((err) => {
  console.log(err);
});