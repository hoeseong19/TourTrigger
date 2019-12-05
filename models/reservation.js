var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  tour: { type: Schema.Types.ObjectId, ref: 'Tour' },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  reserved_date: {type: Date},
  qty: {type: Number}, 
  reg_date: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
var Reservation = mongoose.model('Reservation', schema);

module.exports = Reservation;
