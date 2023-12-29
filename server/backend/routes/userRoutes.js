const express = require('express')
const {
  registerUser,
  loginUser,
  getUser,
  activateUser,
  resetPassword
} = require('../controller/user.controller')
const {verifyUser} = require('../middleware/middleware')
const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)

router.route('/activate/:id').get([verifyUser], activateUser )

router.route('/reset-password').post([verifyUser], resetPassword )

router.route('/me').get([verifyUser], getUser)

module.exports = router
