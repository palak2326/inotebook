const mongoose = require('mongoose')
const { Schema } = mongoose
// in this way data is stored in database
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})
const user = mongoose.model('user', UserSchema)
// user.createIndexes()
module.exports = user
