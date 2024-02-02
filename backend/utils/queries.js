const { v4: uuid } = require("uuid")
const { db } = require("../models/db")

function createGroup(group) {
    return new Promise((resolve, reject) => {
        const g_id = uuid()
        const qry = `insert into groups values("${g_id}","${group.name}","${group.desc}","${group.image}","${group.admin}","${group.createdAt}","${group.updatedAt}")`
        db.query(qry, (err, res) => {
            if (err) {
                reject(err)
            }
            if (res.affectedRows > 0) {
                resolve(g_id)
            }
            resolve(null)
        })
    })
}

function createUser(user) {
    return new Promise((resolve, reject) => {
        const qry = `insert into users values("${uuid()}","${user.name}","${user.email}","${user.password}","${user.image}","${user.region}","${new Date().toISOString()}","${new Date().toISOString()}")`
        db.query(qry, (err, res) => {
            (err) ? reject(err) : resolve(res)
        })
    })
}

function findUser(email) {
    return new Promise((resolve, reject) => {
        const qry = `select * from users where email = "${email}"`
        db.query(qry, (err, res) => {
            (err) ? reject(err) : resolve(res)
        })
    })
}

function fetchGroups(userId) {
    return new Promise((resolve, reject) => {
        const qry = `select distinct g.* from groups g left join usergroup ug on ug.g_id = g.g_id where ug.u_id="${userId}" or admin="${userId}"`
        const q = `select distinct g.* from groups g LEFT join usergroup ug on ug.g_id = g.g_id LEFT join usermessages um on um.u_id=ug.u_id or um.u_id = g.admin where ug.u_id="${userId}" or admin="${userId}" GROUP BY g.g_id ORDER BY count(um.m_id) desc`
        console.log(q);
        db.query(q, (err, res) => {
            (err) ? reject(err) : resolve(res)
        })
    })
}

function fetchRegions() {
    return new Promise((resolve, reject) => {
        const qry = `select * from region`
        db.query(qry, (err, res) => {
            (err) ? reject(err) : resolve(res)
        })
    })
}

function fetchChats(g_id) {
    return new Promise((resolve, reject) => {
        const qry = `select m.*, u.name from usermessages m join users u on u.u_id=m.u_id where g_id="${g_id}" order by m.timestamp`
        db.query(qry, (err, data) => {
            (err) ? reject(err) : resolve(data)
        })
    })
}

function saveMessage(msg) {
    console.log("object",msg);
    return new Promise((resolve, reject) => {
        const m_id = uuid()
        const qry = `insert into usermessages values("${m_id}","${msg.g_id}","${msg.u_id}","${msg.msg}","${msg.timestamp}")`
        db.query(qry, (err, res) => {
            (err) ? reject(err) : resolve(res)
        })
    })
}

function addUserToGroup(group) {
    const g_id = group.g_id
    let qry = `insert into usergroup values `
    group.users.forEach(e => {
        qry += `("${g_id}","${e.u_id}"), `
    });
    qry = qry.substring(0, qry.length - 2)
    return new Promise((resolve, reject) => {
        db.query(qry, (err, res) => {
            (err) ? reject(err) : resolve(res)
        })
    })
}

function searchUser(text) {
    return new Promise((resolve, reject) => {
        const qry = `select u_id, name, email, image from users where name like "%${text}%" or email = "%${text}%"`
        db.query(qry, (err, res) => {
            (err) ? reject(err) : resolve(res)
        })
    })
}

function fetchTopUsers(date){
    return new Promise((resolve, reject) => {
        const qry = `SELECT u.name, COUNT(um.m_id) count from users u join usermessages um on u.u_id=um.u_id 
        GROUP BY u.u_id ORDER BY count DESC LIMIT 5`

        if(date){
            const qry2 = `SELECT u.name name, COUNT(um.m_id) count from users u join usermessages um on u.u_id=um.u_id where um.timestamp BETWEEN DATE(${date.from}) and DATE(${date.to}) GROUP BY u.u_id ORDER BY count DESC LIMIT 5`

            db.query(qry2, (err, res) => {
                (err) ? reject(err) : resolve(res)
            })
        } else {
            db.query(qry, (err, res) => {
                (err) ? reject(err) : resolve(res)
            })
        }
    })
}
function fetchTopGroups(date) {
    return new Promise((resolve, reject) => {
        const qry = `select g.name name, count(um.m_id) count from groups g join usermessages um on um.g_id = g.g_id WHERE um.timestamp GROUP BY g.g_id ORDER BY count DESC LIMIT 5`
        if (date) {
            const qry2 = `select g.name, count(um.m_id) tm from groups g join usermessages um on um.g_id = g.g_id WHERE um.timestamp BETWEEN DATE(${date.from}) and DATE(${date.to}) GROUP BY g.g_id ORDER BY tm DESC LIMIT 5`

            db.query(qry2, (err, res) => {
                (err) ? reject(err) : resolve(res)
            })
        } else {
            db.query(qry, (err, res) => {
                (err) ? reject(err) : resolve(res)
            })
        }
    })
}
function fetchTopRegions(date) {
    return new Promise((resolve, reject) => {
        const qry = `SELECT r.region name, count(u.u_id) count from region r join users u on u.r_id=r.r_id WHERE u_id in (SELECT DISTINCT u_id from usermessages) GROUP BY r.region ORDER BY COUNT Desc LIMIT 5`
 
        if(date){
            const qry2 = `SELECT r.region name, count(u.u_id) count from users u join region r on u.r_id = r.r_id join usermessages um on u.u_id=um.u_id WHERE um.timestamp BETWEEN DATE(${date.from}) and DATE(${date.to}) GROUP BY r.region ORDER BY count Desc LIMIT 5`

            db.query(qry2, (err, res) => {
                (err) ? reject(err) : resolve(res)
            })
        } else {
            db.query(qry, (err, res) => {
                (err) ? reject(err) : resolve(res)
            })
        }
    })
}

function checkUserGroup (uid, gid){
    return new Promise((resolve, reject) => {
        const qry=`select * from usergroup ug join groups g on ug.g_id=g.g_id where ug.u_id=? and ug.g_id=? or g.admin=?`
        db.query(qry,[uid, gid, uid],(err,res)=>{
            if(err){
                reject(err)
            }
            if(res.length>0){
                resolve(true)
            } else {
                resolve(false)
            }
        })
    })
}

module.exports = {
    findUser,
    createGroup,
    createUser,
    fetchGroups,
    fetchRegions,
    fetchChats,
    saveMessage,
    addUserToGroup,
    searchUser,
    fetchTopGroups,
    fetchTopRegions,
    fetchTopUsers,
    checkUserGroup
}