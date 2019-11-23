var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema;

var schema = new Schema({
  tour: { type: Schema.Types.ObjectId, ref: 'Tour' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  title: {type: String, required: true, trim: true},
  description:{type: String, trim: true},
  ratings: {type: Number, enum: [0, 1, 2, 3, 4, 5]},
  reg_date: {type: Date, default: Date.now}, 
}, { 
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
schema.plugin(mongoosePaginate);
var Review = mongoose.model('Review', schema);

module.exports = Review;
