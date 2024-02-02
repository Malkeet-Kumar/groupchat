const { saveMessage, checkUserGroup } = require("./utils/queries");
const {getUserId}  = require('./controllers/chatControllers')

exports = module.exports = (io)=>{
    io.on('connection', (socket)=>{
        
        socket.on("open-group",(group)=>{
            socket.join(group)
        })

        socket.on("messageFromUser",async(data)=>{
            const u_id = await getUserId(data.token)
            
            if(!checkUserGroup(u_id, data.g_id)){
                socket.in(data.g_id).emit("messageFromServerAuth","Invalid group choosen.")
                return
            }

            const res = await saveMessage(data)
            if(res.affectedRows>0){
                socket.in(data.g_id).emit("messageFromServer",data)
            }
        })
    });
}