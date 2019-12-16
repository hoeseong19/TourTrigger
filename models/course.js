var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  tour: { type: Schema.Types.ObjectId, ref: 'Tour' },
  title: {type: String, required: true, trim: true},
  description:{type: String, trim: true},
  required_time:{type: Number}, 
  latitude: {type: Number},
  longitude: {type: Number}, 
  sequence: {type: Number}
}, { 
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
var Course = mongoose.model('Course', schema);

module.exports = Course;
