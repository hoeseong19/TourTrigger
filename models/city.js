var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  country: {type: String}, 
  geonameid: {type: Number}, 
  name: {type: String}, 
  subcountry: {type: String}
}, { 
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
var City = mongoose.model('City', schema);

module.exports = City;
