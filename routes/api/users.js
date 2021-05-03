// Use express router
const express = require('express');
const User = require('../../models/User');
// Set router var to express.Router
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

// Bring in Item model from the models folder
const Item = require ('../../models/User');

// @route   POST api/users
// @desc    Register a new user
// @access  Public
// Use slash to represent api/items endpoint
router.post('/', (req, res) => {
    const { name, email, password } = req.body;

    // Simple validation
    if (!name || !email || !password ) {
        // 400 -- bad request
        return res.status(400).json({ msg: 'Please enter all fields'});
    }
    
    // Check for existing user
    User.findOne({ email: email })
        // Sync away??
        .then(user => {
            if(user) {
                res.status(400).json({ msg: 'User already exists'});
            }
            const newUser = new User({
                name,
                email,
                password
            });

            // Create salt & hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
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
                    });
                })
            })
        })
});

module.exports = router;