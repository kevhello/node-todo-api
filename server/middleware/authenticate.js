const {User} = require('../models/user');

// The middleware function we use on our routes to make them private.
// The actual route won't run until 'next' gets called.
const authenticate = (req, res, next) => {
    // Note: res.header('header_name', header_value) lets us set a header
    // req.header('header_name') lets us get the value.
    // Get token from request's header
    const token = req.header('x-auth');

    // Find the user by the token
    User.findByToken(token).then(user => {
        if(!user){
            // Reject if user is not found
            return Promise.reject();
        }

        req.user = user;
        req.token = token;
        next(); // run the next middleware
    }).catch(e => {
        res.status(401).send();
    });
};

module.exports = {authenticate};