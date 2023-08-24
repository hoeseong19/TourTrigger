var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  tour: { type: Schema.Types.ObjectId, ref: 'Tour' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  reg_date: {type: Date, default: Date.now}
}, { 
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
var Wishlist = mongoose.model('Wishlist', schema);

module.exports = Wishlist;
