import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = (props) => {
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
  })
  let navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, email, password, cpassword } = credentials
    const response = await fetch('http://localhost:5000/api/auth/createUser', {
      // {name,email,password,cpassword}=credentials
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })
    const json = await response.json()
    console.log(json)
    if (json.success) {
      // save the auth token and redirect
      localStorage.setItem('token', json.authtoken)
      navigate('/')
      props.showAlert('Successsfully Created your account', 'success')
    } else {
      props.showAlert('Invalid credentials', 'danger')
    }
  }

  const onChange = (e) => {
    console.log(e.target.value)
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }
  return (
    <div className='container mt-2'>
      <h2>Create an account to use iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input
            type='text'
            className='form-control'
            id='name'
            name='name'
            aria-describedby='emailHelp'
            onChange={onChange}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='email'>Email address</label>
          <input
            type='email'
            className='form-control'
            id='email'
            name='email'
            aria-describedby='emailHelp'
            onChange={onChange}
            placeholder='Enter email'
          />
          <small id='emailHelp' className='form-text text-muted'>
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            className='form-control'
            id='password'
            name='password'
            onChange={onChange}
            placeholder='Password'
            minLength={5}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='cpassword'>Confrim Password</label>
          <input
            type='password'
            className='form-control'
            id='cpassword'
            name='cpassword'
            onChange={onChange}
            placeholder='Password'
            minLength={5}
            required
          />
        </div>

        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </form>
    </div>
  )
}

export default Signup
