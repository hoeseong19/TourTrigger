var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema;

var schema = new Schema({
  name: {type: String, required: true, trim: true},
  email: {type: String, required: true, index: true, unique: true, trim: true},
  password: {type: String, required: true, trim: true},
  reg_date: {type: Date, default: Date.now}, 
  guide: {type: Boolean, default: false}, 
  image: {type: String, default: "/public/images/noun_User_3011958.png"}
}, { 
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
schema.plugin(mongoosePaginate);
var User = mongoose.model('User', schema);

module.exports = User;
