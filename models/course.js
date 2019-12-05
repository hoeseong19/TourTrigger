var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  title: {type: String, required: true, trim: true},
  description:{type: String, trim: true},
  required_time:{type: Date}, 
  latitude: {type: Number},
  longitude: {type: Number}
}, { 
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
var Course = mongoose.model('Course', schema);

module.exports = Course;
