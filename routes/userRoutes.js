const { getAllUsers, registerController, loginController } = require('../controllers/userController')

const express = require('express')

//router object 
const router = express.Router()

//get all user 
router.get('/all-users', getAllUsers)

//create user
router.post('/register', registerController)

//login
router.post('/login', loginController)


module.exports = router