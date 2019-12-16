var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    bcrypt = require("bcryptjs");
    Schema = mongoose.Schema;

var schema = new Schema({
  name: {type: String, required: true, trim: true},
  email: {type: String, required: true, index: true, unique: true, trim: true},
  password: {type: String, required: true, trim: true},
  reg_date: {type: Date, default: Date.now}, 
  guide: {type: Boolean, default: false}, 
  facebook: {id: String, token: String, photo: String}, 
  image: {type: String, default: "https://webprojectimages.s3.amazonaws.com/80df0a6d-5e50-4f2a-b65a-954869d6acf9/noun_User_3011958.png"} 
}, { 
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

schema.methods.generateHash = function(password) {
  return bcrypt.hash(password, 10); // return Promise
};

schema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password); // return Promise
};

schema.plugin(mongoosePaginate);
var User = mongoose.model('User', schema);

module.exports = User;
