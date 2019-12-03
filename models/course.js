var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema;

var schema = new Schema({
  tour: { type: Schema.Types.ObjectId, ref: 'Tour' },
  title: {type: String, required: true, trim: true},
  description:{type: String, trim: true},
  required_time:{type: Date}, 
  latitude: {type: Number},
  longitude: {type: Number}
}, { 
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
schema.plugin(mongoosePaginate);
var Review = mongoose.model('Review', schema);

module.exports = Review;
