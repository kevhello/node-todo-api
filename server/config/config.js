let env = process.env.NODE_ENV || 'development';
// Development is default. If we're on production, NODE_ENV will be set.
// If we're on test, NODE_ENV will be set.

if(env === 'development' || env === 'test'){
    // When you require a json file, it is automatically parsed to an object
    const config = require('./config.json');

    const envConfig = config[env];

    Object.keys(envConfig).forEach(key => {
        process.env[key] = envConfig[key];
    })
}

// if(env === 'development') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
//
// } else if (env === 'test') {
//     process.env.PORT = 3000;
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }