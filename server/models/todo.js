const mongoose = require('mongoose');

// Create a Model for everything we want to store
// 1st arg (string): name of the model
// 2nd arg (object): define the various properties of the model
// Returns a constructor
const Todo = mongoose.model('Todo', {
    text: {
        type: String, // Mongoose will typecast to string if different type
        required: true,
        minlength: 1,
        trim: true // trims off any whitespace at the beginning or end of value
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

module.exports = {Todo};