const express = require('express')
const router = express.Router()
const path = require('path')

const studentsController = require('../controllers/studentsInfoController.js')
const registerController = require('../controllers/registerController.js')

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../studentsInfo.html'))
})

router.get('/getCourses', studentsController.getCourses)
router.get('/getMyCourses/:name', studentsController.getMyCourses)
router.post('/addCourses/:name', studentsController.addCourses)
router.delete('/removeCourses/:name', studentsController.deleteCourses)
router.delete('/deleteStudents/:name', registerController.deleteUsers)

module.exports = router