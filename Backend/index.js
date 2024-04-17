const connectToMongo = require('./db')
connectToMongo()
const express = require('express')
var cors = require('cors')
const app = express()
const port = 5000
// adding middleware which always runs in req res cycle
app.use(cors())
app.use(express.json())
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))
// server listen at this port
app.listen(port, () => {
  console.log(`iNotebook backend listening on port ${port}`)
})
