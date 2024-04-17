import NoteContext from './noteContext'
import { useState } from 'react'

const NoteState = (props) => {
  const host = 'http://localhost:5000'
  const noteInitial = []

  const [notes, setNotes] = useState(noteInitial)
  // Get all notes
  const getNote = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: 'GET',

      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
    })

    const json = await response.json()
    console.log(json)
    setNotes(json)
  }

  // Add a note
  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },

      body: JSON.stringify({ title, description, tag }),
    })
    const json = await response.json()
    const note = json

    setNotes(notes.concat(note))
  }

  // Delete a note
  const deleteNote = async (id) => {
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',

      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
    })
    // const json = await response.json()
    // // console.log(json)
    // setNotes(json)
    // console.log('deleting note with id' + id)
    const newNotes = notes.filter((note) => {
      return note._id !== id
    })
    setNotes(newNotes)
  }

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    // ADD api call

    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },

      body: JSON.stringify({ title, description, tag }),
    })
    // const json = await response.json()
    // console.log(json)
    let newNotes = JSON.parse(JSON.stringify(notes))

    for (let index = 0; index < notes.length; index++) {
      const element = newNotes[index]
      if (element._id === id) {
        newNotes[index].title = title
        newNotes[index].description = description
        newNotes[index].tag = tag
        break
      }
    }
    setNotes(newNotes)
  }

  return (
    <NoteContext.Provider
      value={{ notes, getNote, addNote, deleteNote, editNote }}
    >
      {props.children}
    </NoteContext.Provider>
  )
}
export default NoteState
