var passport = require("passport");
var FacebookStrategy = require("passport-facebook").Strategy;
var secret = require("./secret");
var async = require("async");
var request = require("request");

var User = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new FacebookStrategy(secret.facebook, function (
    req,
    token,
    refreshToken,
    profile,
    done
  ) {
    console.log(profile.id);
    User.findOne({ facebook: profile.id }, function (err, user) {
      if (err) return done(err);
      if (user) {
        req.flash("loginMessage", "Successfully login with Facebook");
        return done(null, user);
      } else {
        async.waterfall([
          (callback) => {
            var newUser = new User();
            newUser.email = profile._json.email;
            newUser.facebook = profile.id;
            newUser.role = "Student";
            newUser.tokens.push({ kind: "facebook", token: token });
            newUser.profile.name = profile.displayName;
            newUser.profile.picture =
              "https://graph.facebook.com/" +
              profile.id +
              "/picture?type=large";
            newUser.save((err) => {
              if (err) throw err;
              req.flash("loginMessage", "Successfully login with Facebook");
              return done(err, newUser);
              //callback(err, newUser);
            });
          },
          /* (newUser, callback) => {
              request(
                {
                  url:
                    "https://us17.api.mailchimp.com/lists/996bf199c6/members",
                  method: "POST",
                  headers: {
                    Authorization:
                      "randomUser 4a05f84ae5b53b0b489ea9c86955b1c6-us17",
                    "Content-Type": "application/json",
                  },
                  json: {
                    email_adress: newUser.email,
                    status: "subscribed",
                  },
                },
                (err, response, body) => {
                  if (err) {
                    return done(err, newUser);
                  } else {
                    console.log("Success");
                    return done(null, newUser);
                  }
                }
              );
            }, */
        ]);
      }
    });
  })
);
