var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
var mongoose = require('mongoose');


exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find().exec(function(err,links) {
    res.send(200, links);
  });
};


exports.saveLink = function(req, res) {
  var uri = req.body.url;
  console.log(uri, !util.isValidUrl(uri));

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.find({ url: uri }).exec(function(err, found) {
    if (err) {
      console.log("Error: "+err);
    }
    if (found.length !== 0) {
      res.send(200, found);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        link.save(function(err, newLink) {
          if (err) {
            console.log("Error: "+err);
          }
          res.send(200, newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;


  User.findOne({ username: username }).exec(function(err, user) {
      console.log("user: ", user);
      if (err) {
        console.log("Error: "+err);
      }
      if (!user) {
        res.redirect('/login');
      } else {
        user.comparePassword(password, function(match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        });
      }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({ username: username }).exec(function(err, user) {
      if (err) {
        console.log("Error: "+err);
      }
      if (user.length === 0) {
        var newUser = new User({
          username: username,
          password: password
        });
        newUser.save(function(err, newUser) {
            if (err) {
              console.log("Error: "+err);
            }
            newUser.hashPassword();
            console.log("New user added: ",newUser);
            util.createSession(req, res, newUser);
          });
      } else {
        console.log('Account already exists');
        res.redirect('/signup');
      }
    });
};

exports.navToLink = function(req, res) {
  Link.findOne({ code: req.params[0] }).exec(function(err,link) {
    if (err) {
      console.log("Error: "+err);
    }
    if (!link) {
      res.redirect('/');
    } else {
      link.update( { $inc: { visits: 1 } }, function(err) {
          if (err) {console.log(err);}
          return res.redirect(link.url);
        });
    }
  });

};
