const { db, dbQuery, createToken } = require('../config')
const Crypto = require('crypto')

module.exports = {
    login: async (req, res, next) => {
        try {
            if (req.user.role == 2) {
                // Hashing Password
                let hashpassword = Crypto.createHmac("sha256", "movie$$").update(req.body.password).digest("hex")
                let getSQL = `Select * from users where email=${db.escape(req.body.email)} || username=${db.escape(req.body.username)} and password=${db.escape(hashpassword)};`
                let get = await dbQuery(getSQL)

                let { id, uid, username, email, password, role, status } = get[0]

                // Membuat Token
                let token = createToken({ id, username, email, password, role, status })
                console.log("data token :", token)

                res.status(200).send({ id, uid, username, email, status, role, token })
            } else {
                res.status(500).send('Your cannot Login !!!')
            }
        } catch (error) {
            next(error)
        }
    },
    register: async (req, res, next) => {
        try {
            if (req.user.role == 2) {

                // Generate OTP
                let karakter = "0123456789abcdefghijklmnopqrstuvwxyz"
                let UID = ""

                for (let i = 0; i < 6; i++) {
                    UID += karakter.charAt(Math.floor(Math.random() * karakter.length))
                }

                // Hashing Password
                let hashpassword = Crypto.createHmac("sha256", "movie$$").update(req.body.password).digest("hex")

                let getSQL = `Insert into users(uid, username, email, password, role, status)
                values(${db.escape(UID)},${db.escape(req.body.username)},${db.escape(req.body.email)},${db.escape(hashpassword)},${db.escape(req.body.role)},${db.escape(req.body.status)});`

                let get = await dbQuery(getSQL)
                let getUser = await dbQuery(`Select * from users where id=${get.insertId}`)
                let { id, uid, username, email, password, role, status } = getUser[0]

                // Membuat Token
                let token = createToken({ id, username, email, password, role, status })
                console.log("data token :", token)
                res.status(200).send({ success: true, message: "Register Success" })
            } else {
                res.status(500).send('Your cannot Register !!!')
            }

        } catch (error) {
            next(error)
        }
    },
    updateDeactive: async (req, res, next) => {
        try {
            let queryUpdate = await dbQuery(`Update users set status=2 where id=${db.escape(req.user.id)};`)
            res.status(200).send("Update Success")
        } catch (error) {
            next(error)
        }
    },
    updateActive: async (req, res, next) => {
        try {
            if (req.user.status == 2) {
                let queryUpdate = await dbQuery(`Update users set status=1 where id=${db.escape(req.user.id)};`)
                res.status(200).send("Update Success")
            } else {
                res.status(500).send('Your cannot Update !!!')
            }
        } catch (error) {
            next(error)
        }
    },
    closeAkun: async (req, res, next) => {
        try {
            // if(req.user.idstatus == 2){
            let queryUpdate = await dbQuery(`Update users set status=3 where id=${db.escape(req.user.id)};`)
            res.status(200).send({ id: req.user.id, messages: "closed" })
            // }else{
            //     res.status(500).send('Your cannot Update !!!')
            // }
        } catch (error) {
            next(error)
        }
    },
}