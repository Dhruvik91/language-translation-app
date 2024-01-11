const express = require('express')
const app = express()
const authRoutes = require('./routes/auth')
const protectedRoute = require('./routes/protectedRoutes')
const bodyParser = require('body-parser')
const session = require('express-session')
require('dotenv').config()

app.use(express.json());

// Create Session
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Authentication Paths 
app.use('/auth', authRoutes);

// Access Paths 
app.use('/protected', protectedRoute);

app.use(express.static("static"))

// Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});