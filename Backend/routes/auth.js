const express = require('express')
const router = express.Router()
const User = require('../models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchuser = require('../middlware/fetchuser')
const JWT_SECRET = 'PalakistheGr8'

// use to check right name right email before hand
const { body, validationResult } = require('express-validator')
// app.use(express.json())
// post request to get req res with running of middleware

// rout1
router.post(
  '/createUser',
  // adding validation to name email and password
  [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
  ],

  async (req, res) => {
    // validating error
    let success = false
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() })
    }
    try {
      // checking if user already exists or not
      let user = await User.findOne({ email: req.body.email })
      if (user) {
        return res.status(400).json({ success, error: 'Email already exists' })
      }
      // add salt in order to ensure security
      const salt = await bcrypt.genSalt(10)
      const secPass = await bcrypt.hash(req.body.password, salt)
      // adding data to database
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      })
      const data = {
        user: {
          id: user.id,
        },
      }
      const authtoken = jwt.sign(data, JWT_SECRET)
      success = true
      // sendig output to the client
      res.json({ success, authtoken })
    } catch (error) {
      // detecting error if any exists
      console.error(error.message)
      // give status 500 if any error occurred
      res.status(500).send('Internal Server Error')
    }
  }
)

// route 2
router.post(
  '/login',
  [
    body('email', 'Enter a vaild email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
  ],
  async (req, res) => {
    let success = false
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body
    try {
      let user = await User.findOne({ email })
      if (!user) {
        success = false
        return res.status(400).json({
          success,
          error: 'Please try to login with correct credentials',
        })
      }

      const passwordComp = await bcrypt.compare(password, user.password)
      if (!passwordComp) {
        success = false
        return res.status(400).json({
          success,
          error: 'Please try to login with correct credentials',
        })
      }
      const data = {
        user: {
          id: user.id,
        },
      }
      const authtoken = jwt.sign(data, JWT_SECRET)
      success = true
      res.json({ success, authtoken })
    } catch (error) {
      console.error(error.message)
      // give status 500 if any error occurred
      res.status(500).send('Internal Server Error')
    }
  }
)

// Route 3:Get logged in user details using:post "/api/auth/getuser" login required
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    const userID = req.user.id
    const user = await User.findById(userID).select('-password')
    res.send(user)
  } catch (error) {
    console.error(error.message)
    // give status 500 if any error occurred
    res.status(500).send('Internal Server Error')
  }
})
module.exports = router
