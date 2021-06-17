const express = require('express')
const { readToken } = require('../config')
const { userController } = require('../controllers')
const router = express.Router()

router.post('/register', readToken, userController.register)
router.post('/login', readToken, userController.login)
router.patch('/deactive', readToken, userController.updateDeactive)
router.patch('/activate', readToken, userController.updateActive)
router.patch('/close', readToken, userController.closeAkun)

module.exports = router