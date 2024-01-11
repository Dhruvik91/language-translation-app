const firestore = require('../config.js');
const jwt = require('jsonwebtoken')
const axios = require('axios')
const validator = require('email-validator')

// Driver function to get data 
async function getUserDataFrom(databaseField, searchField) {
    const usersRef = firestore.collection('users');
    const snapshot = await usersRef.where(`${databaseField}`, '==', `${searchField}`).get();
    return snapshot;
}

// Registeration
async function register(req, res) {
    try {
        const data = req.body; // this data will be received from the ui or frontend side

        // Email Validator
        const validEmail = validator.validate(data.email)
        if (!validEmail) {
            res.status(401).json({
                is_error: "false",
                message: "Invalid Email",
                data: null
            });
            return
        }

        // Check Existence
        const snapshot = await getUserDataFrom("email", data.email);

        if (snapshot.empty) {
            // Insert Data
            await firestore.collection("users").add(data);
            res.status(201).json({
                is_error: "false",
                message: "Registeration Successfull",
                data: {
                    userName: data.name,
                    email: data.email,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            })
        } else {
            res.status(401).json({ is_error: "true", message: "User already exists!", data: null })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ is_error: "true", message: "Registeration Failed!", data: null });
    }
}

// Login
async function login(req, res) {
    try {
        const data = req.body;

        // Email Validator
        const validEmail = validator.validate(data.email)
        if (!validEmail) {
            res.status(401).json({
                is_error: "false",
                message: "Invalid Email",
                data: null
            });
            return
        }

        // Check Existence
        const snapshot = await getUserDataFrom("email", data.email);
        const passwordCheck = await getUserDataFrom("password", data.password);

        if (snapshot.empty) {
            res.status(401).json({ is_error: "true", message: "Incorrect Email", data: null });
            return
        } else if (passwordCheck.empty) {
            res.status(401).send({ is_error: "true", message: "Incorrect Password", data: null });
            return
        }

        let user;
        snapshot.forEach(doc => {
            user = { id: doc.id, ...doc.data() }

        });

        // Create token and cookie
        const token = jwt.sign({ userId: user.id }, process.env.JWT_KEY, {
            expiresIn: '1h',
        });
        req.session.token = token;

        res.status(200).json({
            is_error: "false",
            message: "Login successfull",
            data: {
                userId: user.id,
                userName: user.name,
                email: user.email,
                createdAt: new Date(),
                updatedAt: new Date(),
                accessToken: token
            }
        });
    } catch (error) {
        console.log(error)
        res.status(401).json({
            is_error: 'true',
            message: 'Login failed',
            data: null
        });
    }
}

// Reset Password
async function resetPassword(req, res) {
    try {
        const data = req.body;

        // Email Validator
        const validEmail = validator.validate(data.email)
        if (!validEmail) {
            res.status(401).json({
                is_error: "false",
                message: "Invalid Email",
                data: null
            });
            return
        }

        // Check Existence
        const snapshot = await getUserDataFrom("email", data.email);
        const passwordCheck = await getUserDataFrom("password", data.oldpassword);

        if (snapshot.empty) {
            res.status(401).json({ is_error: "true", message: "Incorrect Email", data: null });
        } else if (passwordCheck.empty) {
            res.status(401).send({ is_error: "true", message: "Incorrect Password", data: null });
        }

        let user;
        snapshot.forEach(doc => {
            user = { id: doc.id, ...doc.data() };
        });

        // Update Data 
        const fieldRef = firestore.collection('users').doc(user.id);
        await fieldRef.update({ "password": String(data.newpassword) });

        res.status(200).json({
            is_error: "false",
            message: "Password Updated",
            data: {
                userId: user.id,
                userName: user.name,
                email: user.email,
                updatedAt: new Date(),
            }
        });

    } catch (error) {
        console.log(error)
        res.status(401).json({
            is_error: 'true',
            message: 'Password doesnt change',
            data: null
        });
    }
}

// Translate Language
async function translateLanguage(req, res) {
    try {
        const { from, to, text } = req.body;

        // Check Valid Data 
        if (!from) {
            res.status(400).json({
                is_error: "true",
                message: "Missing language which translate the text from",
                data: null
            })
            return
        }
        else if (!to) {
            res.status(400).json({
                is_error: "true",
                message: "Missing language which translate the text to another",
                data: null
            })
            return
        } else if (!text) {
            res.status(400).json({
                is_error: "true",
                message: "Text Missing",
                data: null
            })
            return
        }

        // Fetch and use Google Translate API through axios
        const encodedParams = new URLSearchParams();
        encodedParams.set('from', from);
        encodedParams.set('to', to);
        encodedParams.set('text', text);

        const options = {
            method: 'POST',
            url: process.env.API_URL,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'X-RapidAPI-Key': process.env.API_KEY,
                'X-RapidAPI-Host': process.env.API_HOST
            },
            data: encodedParams,
        };

        const response = await axios.request(options);
        res.status(201).json({
            is_error: "false",
            message: "Translation Successfull",
            data: {
                translated_text: response.data.trans,
                translate_from: from,
                translate_to: to,
                text: text
            }
        })
        console.log("Data Received!!!")
    } catch (error) {
        console.error(error.response);
        res.status(400).json({
            is_error: "true",
            message: error.response.data.message[0],
            data: null
        })
    }
}

// Logout
async function logout(req, res) {
    // Destory Session 
    req.session.destroy((err) => {
        if (err) {
            res.status(200).json({ is_error: "true", message: "Unable to logout", data: null });
        } else {
            res.status(200).json({ is_error: "false", message: "Logout done" });
        }
    })
}

module.exports = { register, login, resetPassword, translateLanguage, logout }