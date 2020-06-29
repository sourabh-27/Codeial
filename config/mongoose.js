const mongoose = require('mongoose');
const env = require('./enviornment');
mongoose.connect(`mongodb://localhost/${env.db}`, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to the MongoDb"));

db.once('open', function(){
    console.log("Connected to the database :: MongoDb")
});

module.exports = db;