const express = require('express')
const router = express.Router()

const { createUser, deleteAllUser} = require('../controllers/UserController')

router.delete("/all", deleteAllUser)
router.post('/create', createUser)

module.exports = router