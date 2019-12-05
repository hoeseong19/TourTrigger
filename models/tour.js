var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema;

var schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  title: {type: String, trim: true, required: true},
  price: {type: String, trim: true, required: true}, 
  description: {type: String, trim: true, required: true},
  courses: { type: [Schema.Types.ObjectId], ref: 'Course' }, 
  image: {type: String}, 
  reg_date: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
schema.plugin(mongoosePaginate);
var Tour = mongoose.model('Tour', schema);

module.exports = Tour;
