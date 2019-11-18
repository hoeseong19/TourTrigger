var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  name: {type: String, required: true, trim: true},
  email: {type: String, required: true, index: true, unique: true, trim: true},
  password: {type: String},
  reg_date: {type: Date, default: Date.now}, 
  group: {type: String, enum: ['admin', 'guide', 'tourist']}
}, { 
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var User = mongoose.model('User', schema);

module.exports = User;
