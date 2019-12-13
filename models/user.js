var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    bcrypt = require("bcryptjs");
    Schema = mongoose.Schema;

var reservationsschema = new Schema({
  tour: { type: Schema.Types.ObjectId, ref: 'Tour' },
  reserved_date: {type: Date},
  people: {type: Number}, 
  reg_date: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var schema = new Schema({
  name: {type: String, required: true, trim: true},
  email: {type: String, required: true, index: true, unique: true, trim: true},
  password: {type: String, required: true, trim: true},
  reg_date: {type: Date, default: Date.now}, 
  guide: {type: Boolean, default: false}, 
  facebook: {id: String, token: String, photo: String}, 
  image: {type: String, default: "/public/images/noun_User_3011958.png"}, 
  reservations: [reservationsschema], 
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
