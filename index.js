const express = require('express')
const app = express()
const port = 5000

const cors = require('cors')
app.use(cors())

const path  = require('path')

const authRoute = require('./routes/auth.route')
const coffeeRoute = require('./routes/coffee.route')
const orderRoute = require('./routes/order.route')

app.use(cors())

app.use('/login', authRoute)
app.use('/coffee', coffeeRoute)
app.use('/order', orderRoute)
app.use(express.static(path.join(__dirname, 'image')));


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})