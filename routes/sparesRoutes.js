const express = require('express')
const router = express.Router()
const { getAllSpares } = require('../controllers/sparesController')

router.get('/', getAllSpares)

module.exports = router 