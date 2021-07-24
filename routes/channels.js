const express = require('express')
const router = express.Router()

const { createChannel, getAllChannels, getMyChannel } = require('../controllers/ChannelController')

router.get('/all', getAllChannels)
router.get('/myChannel', getMyChannel)
router.post('/create', createChannel)

module.exports = router