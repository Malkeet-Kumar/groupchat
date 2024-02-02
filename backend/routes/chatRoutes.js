const { verify } = require('jsonwebtoken')
const {
    loginUser,
    signupUser,
    getRegions,
    makeGroup,
    loadGroups,
    loadChats,
    joinGroup
} = require('../controllers/chatControllers')
const { fetchChats, searchUser, fetchTopGroups, fetchTopRegions, fetchTopUsers } = require('../utils/queries')
const chatRoutes = require('express')()

const auth = (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(401).end()
        return
    }
    try {
        const decode = verify(req.headers.authorization, "jkshdkjahskd")
        console.log(decode);
        next()
    } catch (error) {
        console.log("invalid token");
        res.status(401).end()
    }
}

chatRoutes.post("/login", loginUser)

chatRoutes.post("/signup", signupUser)

chatRoutes.get('/chat',loadChats)

chatRoutes.use("/group", auth)
chatRoutes.route("/group")
    .get(loadGroups)
    .post(makeGroup)

chatRoutes.use("/join",auth)
chatRoutes.route("/join")
.post(joinGroup)

chatRoutes.get("/metrics",auth,async(req,res)=>{
    const param = req.query.param
    const from = req.query.fromd
    const to = req.query.tod
    switch(param){
        case "groups":
            if(from && to){
                const groups = await fetchTopGroups({from,to})
                res.status(200).json(groups)
                return
            } else {
                const groups = await fetchTopGroups()
                res.status(200).json(groups)
                return
            }
            break;
        case "regions":
            if(from && to){
                const groups = await fetchTopRegions({from,to})
                res.status(200).json(groups)
                return
            } else {
                const groups = await fetchTopRegions()
                res.status(200).json(groups)
                return
            }
            break;
        case "users":
            if(from && to){
                const groups = await fetchTopUsers({from,to})
                res.status(200).json(groups)
                return
            } else {
                const groups = await fetchTopUsers()
                res.status(200).json(groups)
                return
            }
            break;
        default:
                res.status(404).end()
                break;
    }
})

chatRoutes.get("/regions", getRegions)

chatRoutes.get("/users",auth,async(req,res)=>{
    try {
        const text = req.query.text
        const users = await searchUser(text)
        res.status(200).json(users)
    } catch (error) {
        res.status(500).send(error)
    }
})


module.exports = chatRoutes