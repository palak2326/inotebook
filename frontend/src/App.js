import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About'
import NoteState from './context/notes/NoteState'
import Alert from './components/Alert'
import Demo from './components/Demo'
import Signup from './components/Signup'
import Login from './components/Login'
import { useState } from 'react'
function App() {
  const [alert, setAlert] = useState(null)
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type,
    })
    setTimeout(() => {
      setAlert(null)
    }, 1500)
  }
  return (
    <>
      <NoteState>
        <Router>
          <Navbar />
          <Alert alert={alert} />
          <div className='container'>
            <Routes>
              <Route
                exact
                path='/'
                index
                element={<Home showAlert={showAlert} />}
              />
              <Route exact path='/about' index element={<About />} />
              <Route exact path='/demo' index element={<Demo />} />
              <Route
                exact
                path='/login'
                index
                element={<Login showAlert={showAlert} />}
              />
              <Route
                exact
                path='/signup'
                index
                element={<Signup showAlert={showAlert} />}
              />
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  )
}

export default App
