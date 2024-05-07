const express = require(`express`)
const authController = require(`../controller/auth.controller`)
const app = express()
app.use(express.json())

app.post('/', authController.authenticate)

module.exports = app