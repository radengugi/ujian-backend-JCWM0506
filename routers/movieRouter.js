const express = require('express')
const { readToken } = require('../config')
const movieController = require('../controllers/movieController')
const router = express.Router()

router.get('/get/all', movieController.getMovie)
router.post('/add',readToken, movieController.addMovie)
router.patch('/edit/:id', movieController.updateMovie)

module.exports = router