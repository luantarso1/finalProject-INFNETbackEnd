const express = require('express')
const router = express.Router()
const path = require('path')

const registerController = require('../controllers/registerController.js')

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../../register.html'))
})

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../main.html'))
})

router.get('/getStudents/:name', registerController.getStudents)
router.post('/register/add', registerController.addStudent);
router.post('/signin', registerController.login);
router.put('/updateStudents', registerController.updateStudents)


module.exports = router