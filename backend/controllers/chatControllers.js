const {
    findUser,
    createUser,
    fetchRegions,
    createGroup,
    fetchGroups,
    fetchChats,
    addUserToGroup
} = require("../utils/queries")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')

async function signupUser(req, res) {
    try {
        const passwordPlain = req.body.password
        const user = {
            email: req.body.email,
            name: req.body.name,
            image: req.files[0].filename,
            region: req.body.region
        }
        const password = await bcrypt.hash(passwordPlain, 10)
        user.password = password
        const result = await createUser(user)
        if (result.affectedRows > 0) {
            res.status(200).end()
        } else {
            res.status(403).end()
        }
    } catch (err) {
        res.status(500).send(err)
    }
}

async function loginUser(req, res) {
    try {
        const email = req.body.email
        const password = req.body.password
        const user = await findUser(email)
        if (user.length <= 0) {
            res.status(404).end()
            return
        }
        const match = await bcrypt.compare(password, user[0].password)
        if (match) {
            const u = {...user,password:null}
            const groups = await fetchGroups(user.u_id)
            const token = createToken({ u_id: user[0].u_id, groups: groups })
            res.status(200).json({ user: user, token })
        } else {
            res.status(401).end()
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
}

async function loadChats(req, res) {
    try {
        const g_id = req.query.gid
        const chats = await fetchChats(g_id)
        res.status(200).json(chats)
    } catch (err) {
        console.log(err);
        res.status(500).send(err)
    }
}

async function loadGroups(req, res) {
    try {
        const uid = await getUserId(req.headers.authorization)
        const groups = await fetchGroups(uid)
        console.log(groups);
        res.status(200).json(groups)
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}

async function makeGroup(req, res) {
    try {
        const uid = await getUserId(req.headers.authorization)
        const date = new Date().toISOString()
        const group = {
            name: req.body.gpname,
            desc: req.body.gpdesc,
            image: req?.files[0]?.filename || null,
            admin: uid,
            createdAt: date,
            updatedAt: date
        }
        const gid = await createGroup(group)
        if (gid) {
            console.log(gid);
            group.g_id = gid
            res.status(200).json(group)
        } else {
            res.status(403).end()
        }
    } catch (error) {
        res.status(500).send(error)
    }
}

async function getRegions(req, res) {
    try {
        const regions = await fetchRegions()
        res.status(200).json(regions)
    } catch (error) {
        res.status(500).send(error)
    }
}

async function getUserId(token) {
    try {
        const user = await jwt.verify(token, "jkshdkjahskd")
        return user.u_id
    } catch (error) {
        return null
    }
}

function createToken(user) {
    const token = jwt.sign(user, "jkshdkjahskd", { expiresIn: "1h" })
    return token
}

async function joinGroup(req, res) {
    try {
        const g_id = req.query.gid
        console.log(g_id)
        u_id = await getUserId(req.headers.authorization)
        const result = await addUserToGroup({g_id:g_id,users:req.body})
        console.log(result)
        if(result.affectedRows>0){
            res.status(200).end()
        } else {
            res.status(403).end()
        }
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports = {
    loginUser,
    signupUser,
    loadChats,
    makeGroup,
    getRegions,
    loadGroups,
    joinGroup, 
    getUserId
}
