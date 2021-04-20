// ORM to interact with MongoDB database
const mongoose = require('mongoose');
// 
const Schema = mongoose.Schema;

// Create Schema
const ItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Set up schema export
module.exports = Item = mongoose.model('item', ItemSchema);