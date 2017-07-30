const {SHA256} = require('crypto-js');

const bcrypt = require('bcryptjs');

const password = '123abc!';

// 1st arg: the # of rounds you want to use to generate the salt. (bigger is slower, but more secure)
// 2nd arg: the callback function.
bcrypt.genSalt(10, (err, salt) => {
    // 1st arg: the thing to hash
    // 2nd arg: the salt to use
    // 3rd arg: the callback function
    bcrypt.hash(password, salt).then(hash => {
        console.log(hash);
    })
});

// How to compare the hash to plaintext
const hashedPassword = '$2a$10$C9gbO9ATrKvN8DtRktGne.JWiPF.dXKaje0G1NoFGG6umj1pL4jCK';

// 1st arg: plain string (password)
// 2nd arg: hashed value
// 3rd arg: callback function
bcrypt.compare(password, hashedPassword).then(res => {
    console.log(res);
});


// const message = 'I am user number 3';
//
// const hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
//
// const data = {
//     // equals the id inside the user collection.
//     // This lets us know which user should be able to make the request.
//     id: 4,
// };
//
// // This is what we're going to send back to the user.
// const token = {
//     data,
//     // the hash value of the 'data' variable above.
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// // Man-in-the-middle changes something
// // This is a bad hash b/c the user doesn't know the salt that was used!
// token.data.id = 6;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if(resultHash === token.hash) {
//     // data was not manipulated
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed. Do not trust!');
// }