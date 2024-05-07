const express = require(`express`)
const orderController = require(`../controller/order.controller`)
const auth = require('../controller/auth.controller')
const app = express()
app.use(express.json())

app.get('/', orderController.findAll)
app.post('/', auth.authorize, orderController.addOrder)

module.exports = app