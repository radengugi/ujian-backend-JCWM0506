const express = require('express')
const cors = require('cors')
const bearerToken = require('express-bearer-token')

// main app
const app = express()

const { db } = require('./config/database')

db.getConnection((err, connection) => {
    if (err) {
        return console.error("Error MySQL :", err.message)
    }
    console.log(`Connected to MySQL Server : ${connection.threadId}`)
})

// apply middleware
app.use(cors())
app.use(express.json())
app.use(bearerToken())

// main route
const response = (req, res) => res.status(200).send('<h1>REST API JCWM0506</h1>')
app.get('/', response)

const { usersRouter, movieRouter } = require('./routers')
app.use('/users', usersRouter)
app.use('/movies', movieRouter)

app.use((error, req, res, next) => {
    console.log("Handling Error :", error)
    res.status(500).send({ status: "Error MySQL", messages: error })
})

// bind to local machine
const PORT = process.env.PORT || 2000
app.listen(PORT, () => console.log(`CONNECTED : port ${PORT}`))