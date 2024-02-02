const mysql = require("mysql2")
const db = mysql.createConnection({ uri: "mysql://root:@localhost:3306/chat" });

const createUserTable = () => {
    return new Promise((resolve, reject) => {
        const qry = `CREATE TABLE IF NOT EXISTS users (
            u_id VARCHAR(255),
            name VARCHAR(255),
            email VARCHAR(255) unique not null,
            password VARCHAR(255),
            image VARCHAR(255),
            r_id VARCHAR(255),
            createdAt DATETIME,
            updatedAt DATETIME,
            PRIMARY KEY(u_id),
            CONSTRAINT fk_region FOREIGN KEY (r_id) REFERENCES region(r_id)
        )`
        db.query(qry, (err, res) => {
            if (err) {
                reject(err)
            }
            resolve(res)
        })
    })
}

const createGroupTable = () => {
    return new Promise((resolve, reject) => {
        const qry = `CREATE TABLE IF NOT EXISTS groups (
            g_id varchar(255),
            name varchar(255),
            description varchar(255),
            image varchar(255),
            admin varchar(255),
            createdAt DATETIME,
            updatedAt DATETIME,
            PRIMARY KEY(g_id)
        )`
        db.query(qry, (err, res) => {
            if (err) {
                reject(err)
            }
            resolve(res)
        })
    })
}

const createMapTable = () => {
    return new Promise((resolve, reject) => {
        const qry = `CREATE TABLE IF NOT EXISTS usergroup (
            g_id varchar(255),
            u_id varchar(255),
            CONSTRAINT fk_user FOREIGN KEY (u_id) REFERENCES users(u_id),
            CONSTRAINT fk_group FOREIGN KEY (g_id) REFERENCES groups(g_id)
        )`
        db.query(qry, (err, res) => {
            if (err) {
                reject(err)
            }
            resolve(res)
        })
    })
}

const createMessageTable = () => {
    return new Promise((resolve, reject) => {
        const qry = `CREATE TABLE IF NOT EXISTS usermessages (
            m_id varchar(255),
            g_id varchar(255),
            u_id varchar(255),
            msg varchar(255),
            timestamp DATETIME,
            PRIMARY KEY(m_id),
            CONSTRAINT fk_groups FOREIGN KEY (g_id) REFERENCES groups(g_id),
            CONSTRAINT fk_users FOREIGN KEY (u_id) REFERENCES users(u_id)
        )`
        db.query(qry, (err, res) => {
            if (err) {
                reject(err)
            }
            resolve(res)
        })
    })
}

const createRegionTable = () => {
    return new Promise((resolve, reject) => {
        const qry = `CREATE TABLE IF NOT EXISTS region (
            r_id varchar(255),
            region varchar(255),
            PRIMARY KEY(r_id)
        )`
        db.query(qry, (err, res) => {
            if (err) {
                reject(err)
            }
            resolve(res)
        })
    })
}

const init = () => {
    return new Promise((resolve, reject) => {
        db.connect()
        createRegionTable()
            .then(res => {
                return createGroupTable()
            })
            .then(res => {
                return createUserTable()
            })
            .then(res => {
                return createMapTable()
            })
            .then(res => {
                return createMessageTable()
            })
            .then(res => {
                console.log("Database created");
                resolve()
            })
            .catch((err) => {
                console.log(err);
                reject(err)
            });
    })
}

module.exports = {db,init}