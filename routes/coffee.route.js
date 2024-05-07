const express = require(`express`)
const coffeeController = require(`../controller/coffee.controller`)
const auth = require('../controller/auth.controller')
const app = express()
app.use(express.json())

app.get('/getall', coffeeController.getAll)
app.get('/:key', coffeeController.findCoffee)
app.post('/', auth.authorize, coffeeController.addCoffee)
app.put('/:id', auth.authorize, coffeeController.updateCoffee)
app.delete('/:id', auth.authorize, coffeeController.deleteCoffee)

module.exports = app