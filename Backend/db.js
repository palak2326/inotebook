const mongoose = require('mongoose')

const mongoURI = 'mongodb://127.0.0.1:27017/iNotebook'
//   connecting to database
const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  }
}

module.exports = connectToMongo
