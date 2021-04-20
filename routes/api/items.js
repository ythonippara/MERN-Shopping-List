// Use express router
const express = require('express');
// Set router var to express.Router
const router = express.Router();

// Bring in Item model from the models folder
const Item = require ('../../models/Item');

// @route   GET api/items
// @desc    Get all items
// @access  Public
// Use slash to represent api/items endpoint
router.get('/', (req, res) => {
    // Take the model, find method returns a promise
    Item.find()
      // sort by date, use -1 for descending
      .sort({ date: -1 })
      .then(items => res.json(items))
});

// @route   POST api/items
// @desc    Create an item
// @access  Public
router.post('/', (req, res) => {
    // Construct an object to insert into a database
    const newItem = new Item({
        name: req.body.name
    });

    // Save a new item to the database, promise-based
    newItem.save().then(item => res.json(item));
});

// @route   DELETE api/items/:id
// @desc    Delete an item
// @access  Public
router.delete('/:id', (req, res) => {
    // Find an item by fetching id through a URI
    Item.findById(req.params.id)
      .then(item => item.remove().then(() => res.json({success: true})))
      .catch(err => res.status(404).json({success: false}));
});

module.exports = router;