var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema;

var schema = new Schema({
  guide: { type: Schema.Types.ObjectId, ref: 'Guide' },
  title: {type: String, trim: true},
  price: {type: Number, trim: true}, 
  description: {type: String, trim: true},
  image: {type: String}, 
  reg_date: {type: Date, default: Date.now}, 
  category: {type: String, enum: ["guide", "ticket", "activity", "snapshot", "restaurant", "entertainment", "convenience"], required: true}, 
  city: {type: String}, 
  numReviews: {type: Number, default: 0}, 
  numReserves: {type: Number, default: 0}, 
  numCourses: {type: Number, default: 0}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
schema.plugin(mongoosePaginate);
var Tour = mongoose.model('Tour', schema);

module.exports = Tour;
