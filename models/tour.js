var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema;

var schema = new Schema({
  guide: { type: Schema.Types.ObjectId, ref: 'Guide' },
  title: {type: String, trim: true},
  price: {type: String, trim: true}, 
  description: {type: String, trim: true},
  image: {type: String}, 
  reg_date: {type: Date, default: Date.now}, 
  category: {type: String, enum: ["가이드투어", "티켓", "액티비티", "스냅촬영", "레스토랑", "즐길거리", "여행편의"], required: true}, 
  city: {type: String}, 
  numReviews: {type: Number}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
schema.plugin(mongoosePaginate);
var Tour = mongoose.model('Tour', schema);

module.exports = Tour;
