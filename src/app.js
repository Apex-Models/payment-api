const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()
const apiRoutes = require('./routes')

const app = express()
const port = process.env.PORT || 3000

// Middlewares
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}))

// Webhooks middleware (rawbody for Stripe)
app.use('/webhook', express.raw({ type: 'application/json' }))

// Routes
app.use('/', apiRoutes)

// Default route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Apex Payment API',
    version: '1.0.0',
    status: 'active',
  })
})

module.exports = app