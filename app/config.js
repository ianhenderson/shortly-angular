var mongoose = require('mongoose');

var dbURI = process.env.MONGODB_URI || 'mongodb://localhost/users';

mongoose.connect(dbURI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback(){
  console.log('Connected to MongoDB');

});

module.exports = db;
