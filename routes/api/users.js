// Use express router
const express = require('express');
const User = require('../../models/User');
// Set router var to express.Router
const router = express.Router();
const bcrypt = require('bcryptjs');

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
                            res.json({
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email
                                }
                            });
                    });
                })
            })
        })
});

module.exports = router;