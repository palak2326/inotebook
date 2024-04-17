const express = require('express')
const router = express.Router()
const fetchuser = require('../middlware/fetchuser')
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator')
// fetch notes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id })
    res.json(notes)
  } catch (error) {
    console.error(error.message)
    // give status 500 if any error occurred
    res.status(500).send('Internal Server Error')
  }
})

// add note
router.post(
  '/addnote',
  fetchuser,
  [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      })
      const savedNote = await note.save()
      res.json(savedNote)
    } catch (error) {
      console.error(error.message)
      // give status 500 if any error occurred
      res.status(500).send('Internal Server Error')
    }
  }
)

// route 3: update existing route validation to check wahi user jiska notes hai wahi update kr sakta hai
router.put('/updatenote/:id', fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body
    const newNote = {}
    if (title) {
      newNote.title = title
    }
    if (description) {
      newNote.description = description
    }
    if (tag) newNote.tag = tag

    // find the note to be updated
    let note = await Notes.findById(req.params.id)
    if (!note) {
      return res.status(404).send('Not Found')
    }
    if (note.user.toString() != req.user.id) {
      return res.status(401).send('Not Allowed')
    }
    // first parameter :id ,updating note with new note,new=true means if any new contact it will be created
    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    )
    res.json({ note })
  } catch (error) {
    console.error(error.message)
    // give status 500 if any error occurred
    res.status(500).send('Internal Server Error')
  }
})

// deleting note login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
  try {
    // find the note to be deleted
    let note = await Notes.findById(req.params.id)
    if (!note) {
      return res.status(404).send('Not Found')
    }

    // allow deletion only if user owns this note
    if (note.user.toString() != req.user.id) {
      return res.status(401).send('Not Allowed')
    }
    // first parameter :id ,updating note with new note,new=true means if any new contact it will be created
    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({ success: 'Note has been deleted', note: note })
  } catch (error) {
    console.error(error.message)
    // give status 500 if any error occurred
    res.status(500).send('Internal Server Error')
  }
})

module.exports = router
