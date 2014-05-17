var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');

var Promise = require('bluebird');

var userSchema = mongoose.Schema({
  id: Number,
  username: String,
  password: String
});

userSchema.methods.comparePassword = function(attemptedPassword, callback){
  bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
    callback(isMatch);
  });
};

userSchema.methods.hashPassword = function(){
  var self = this;
  bcrypt.hash(this.password, null, null, function(err, hash){
    err ?
      console.log("error hashing: ", err) :
      self.update({password: hash}, function(err) {
        if (err) {console.log(err)};
      });
  });
};

var User = mongoose.model('User', userSchema);

module.exports = User;
