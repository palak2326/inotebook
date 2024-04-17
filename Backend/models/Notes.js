const mongoose = require('mongoose')
// schema for notes in this format we want data to be stored in the database
const NotesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: 'General',
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('notes', NotesSchema)
