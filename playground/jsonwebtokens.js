const jwt = require('jsonwebtoken');


const data = {
    id: 10
};

// Takes the object and signs it. It creates that hash, and returns the token
// value.
// 1st arg: the object
// 2nd arg: the secret
// Returns our token.
// We also store the token in the 'tokens' array.
const token = jwt.sign(data, '123abc');
console.log(token);

// Takes that token and the secret and it makes sure the data was not manipulated.
// 1st arg: the token we want to verify
// 2nd arg: the secret to validate it
// Returns the object that was signed.
// If anything changes before we call it, the secret or the token, then the call
// is not going to pass - we're going to get an error.
const decoded = jwt.verify(token, '123abc');
console.log('decoded', decoded);
