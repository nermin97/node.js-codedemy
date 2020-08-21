var User = require("../models/user");
var Course = require("../models/course");
var secret = require("../config/secret");
var stripe = require("stripe")(secret.stripe.secretTestKey);
var async = require("async");
const course = require("../models/course");

module.exports = (app) => {
  app.post("/payment", (req, res, next) => {
    var stripeToken = req.body.stripeToken;
    var courseId = req.body.courseId;
    async.waterfall([
      (callback) => {
        Course.findOne({ _id: courseId }, (err, foundCourse) => {
          if (foundCourse) callback(err, foundCourse);
        });
      },
      (foundCourse, callback) => {
        stripe.customers
          .create({
            source: stripeToken,
            email: req.user.email,
          })
          .then((customer) => {
            return stripe.charges
              .create({
                amount: foundCourse.price,
                currency: "usd",
                customer: customer.id,
              })
              .then((charge) => {
                async.parallel(
                  [
                    (callback) => {
                      Course.update(
                        {
                          _id: courseId,
                          "ownByStudent.user": { $ne: req.user._id },
                        },
                        {
                          $push: { ownByStudent: { user: req.user._id } },
                          $inc: { totalStudents: 1 },
                        },
                        (err, count) => {
                          if (err) return next(err);
                          callback(err);
                        }
                      );
                    },
                    (callback) => {
                      User.update(
                        {
                          _id: req.user._id,
                          "coursesTaken.course": { $ne: courseId },
                        },
                        {
                          $push: { coursesTaken: { course: courseId } },
                        },
                        (err, count) => {
                          if (err) return next(err);
                          callback(err);
                        }
                      );
                    },
                    (callback) => {
                      User.update(
                        {
                          _id: foundCourse.ownByTeacher,
                        },
                        {
                          $push: { revenue: { money: foundCourse.price } },
                        },
                        (err, count) => {
                          if (err) return next(err);
                          callback(err);
                        }
                      );
                    },
                  ],
                  (err, results) => {
                    if (err) return next(err);
                    res.redirect("/courses/" + courseId);
                  }
                );
              });
          });
      },
    ]);
  });
};
