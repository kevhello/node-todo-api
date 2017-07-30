const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
    const token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
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
        decoded = jwt.verify(token, process.env.JWT_SECRET);
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

UserSchema.statics.findByCredentials = function (email, password) {
    const User = this;

    return User.findOne({email}).then(user => {
        if(!user){
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                // bcrypt.compare: the res is true if the compare is true
                if(res){
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

UserSchema.methods.removeToken = function (token){
    // $pull lets you remove items from an array that match certain criteria
    const user = this;

    return user.update({
        $pull: {
            tokens: {
                // Will remove the entire object in the array.
                // The array will have one less item in it.
                token: token
            }
        }
    })
};
// The 'pre' lets you run some code before a given event.
// Here we run code before we save the document to the database.
// Note: you MUST provide the 'next' argument and you MUST call it
//       somewhere inside the function.
UserSchema.pre('save', function (next) {
    const user = this;

    // To prevent hashing our hashed value!
    if(user.isModified('password')){
        // isModified takes an individual property
        // If modified, returns true, else false.
        bcrypt.genSalt(10,(err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash; // override plaintext password
                next(); // Complete the middleware, move on to save the doc
            });
        });
    } else {
        next();
    }
});

// Note: we pass the schema we created as the 2nd arg.
const User = mongoose.model('User', UserSchema);

module.exports = {User};