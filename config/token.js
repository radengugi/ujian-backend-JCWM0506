const jwt = require('jsonwebtoken')

module.exports = {
    createToken: (payload) => {
        return jwt.sign(payload, "movie$$")
    },
    readToken: (req, res, next) => {
        jwt.verify(req.token, "movie$$", (err, decoded) => {
            if (err) {
                return res.status(401).send("User not Authorization")
            }
            req.user = decoded
            next()
        })
    }
}