const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// Stores the schema for our user
// We can place custom methods on to Schemas, but not on mongoose.model
const UserSchema = new mongoose.Schema({
    email: {
        required: true,
        trim: true,
        type: String,
        minlength: 1,
        // verifies that the property email doesn't have the same value as the
        // other documents in the collection.
        unique: true,
        validate: {
            // validator property can take a function to use to validate the email
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{ // empty array by default
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        }
    }]
});

// This method determines what exactly gets sent back when a mongoose model
// is converted to a JSON value.
UserSchema.methods.toJSON = function () {
    // grab the value
    const user = this;
    // user.toObject() converts the mongoose variable, user, and converting it
    // to an object where only the properties on the document exist.
    const userObject = user.toObject();
    // pick the properties we want to send back
    return _.pick(userObject, ['_id', 'email']);
};

// We can add any methods we like on the 'methods' object:
// DO NOT use the arrow function.
// We use the regular function b/c we need the 'this' keyword to store
// the individual document.
UserSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
    user.tokens.push({access, token});

    // Note: in order to allow server.js to chain on to the promise,
    // we return it here:
    return user.save().then(() => {
        return token;
    });
};

// Statics is an object contains the methods for the model,
// instead of the instance.
UserSchema.statics.findByToken = function(token) {
    const User = this; // refers to the model
    let decoded; // will store the decoded jwt values from jwt.verify

    try {
        // try decoding the token!
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }

    // ... the token has successfully been decoded

    // we return the promise to be able to add some chaining in server.js
    return User.findOne({
        // quotes are not required here for _id,
        // but we keep them here for consistency
        '_id': decoded._id,
        // to query a nested document, we wrap the key in quotes:
        // Quotes are required when we have a 'dot' in the key we want to query
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};
// Note: we pass the schema we created as the 2nd arg.
const User = mongoose.model('User', UserSchema);

module.exports = {User};