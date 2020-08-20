var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CourseSchema = new Schema({
  title: String,
  desc: String,
  wistiaId: String,
  price: Number,
  ownByTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  ownByStudent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  totalStudents: Number,
});

module.exports = mongoose.model("Course", CourseSchema);
