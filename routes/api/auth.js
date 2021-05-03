// Use express router
const express = require('express');
const User = require('../../models/User');
// Set router var to express.Router
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

// Bring in Item model from the models folder
const Item = require ('../../models/User');

// @route   POST api/auth
// @desc    Authenticate a user
// @access  Public
// Use slash to represent api/items endpoint
router.post('/', (req, res) => {
    const { email, password } = req.body;

    // Simple validation
    if ( !email || !password ) {
        // 400 -- bad request
        return res.status(400).json({ msg: 'Please enter all fields'});
    }
    
    // Check for existing user
    User.findOne({ email: email })
        // Sync away??
        .then(user => {
            if (!user) {
                res.status(400).json({ msg: 'User does not exist'});
            }

            // Validate password: take plain text password and compare with the saved enrypted password
            bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (!isMatch) 
                {
                    return res.status(400).json({ msg: 'Invalid credentials'});
                }

                // Create jwt token, make sure the token is accessing a specific user
                jwt.sign(
                    { id: user.id }, 
                    config.get('jwtSecret'),
                    // Optional: token will last for an hour
                    { expiresIn: 3600 },
                    // Callback param, asynchronous
                    (err, token) => {
                        if (err) throw err;
                        // Response
                        res.json({
                            token: token,
                            user: {
                                id: user.id,
                                name: user.name,
                                email: user.email
                            }
                        });
                    }
                )
            })
        })
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
// Validate user with the token
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        // Disregard the password
        .select('-password')
        .then(user => res.json(user));
});

module.exports = router;