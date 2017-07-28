var env = process.env.NODE_ENV || 'development';
// Development is default. If we're on production, NODE_ENV will be set.
// If we're on test, NODE_ENV will be set.

if(env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';

} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}