const express = require('express')
const app = express()
const port = 3333

const studentsRoutes = require('./assets/routes/studentsRoutes')
const loginRoutes = require('./assets/routes/loginRoutes')

app.use(express.json())
app.use(express.static(__dirname + '/assets'))
app.use('/',loginRoutes)
app.use('/students',studentsRoutes)

app.listen(port,()=>{
  console.log(`Running at port: ${port}`)
})