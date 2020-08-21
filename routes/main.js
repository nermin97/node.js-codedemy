var Course = require("../models/course");
var User = require("../models/user");

var async = require("async");
const secret = require("../config/secret");

module.exports = (app) => {
  app.get("/", (req, res, next) => {
    res.render("main/home");
  });

  app.get("/courses", (req, res, next) => {
    Course.find({}, (err, courses) => {
      res.render("courses/courses", { courses: courses });
    });
  });

  app.get("/courses/:id", (req, res, next) => {
    async.parallel(
      [
        (callback) => {
          Course.findOne({ _id: req.params.id })
            .populate("ownByStudent.user")
            .exec((err, foundCourse) => {
              callback(err, foundCourse);
            });
        },
        (callback) => {
          User.findOne({
            _id: req.user._id,
            "coursesTaken.course": req.params.id,
          })
            .populate("coursesTaken.course")
            .exec((err, foundUserCourse) => {
              callback(err, foundUserCourse);
            });
        },
        (callback) => {
          User.findOne({
            _id: req.user._id,
            "coursesTeach.course": req.params.id,
          })
            .populate("coursesTeach.course")
            .exec((err, foundUserCourse) => {
              callback(err, foundUserCourse);
            });
        },
      ],
      (err, results) => {
        var course = results[0];
        var userCourse = results[1];
        var teacherCourse = results[2];
        if (userCourse === null && teacherCourse === null) {
          res.render("courses/courseDesc", {
            course: course,
            stripe: secret.stripe,
          });
        } else if (userCourse === null && teacherCourse !== null) {
          res.render("courses/course", { course: course });
        } else {
          res.render("courses/course", { course: course });
        }
      }
    );
  });
};
