var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema;

var schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' , unique: true},
  name: {type: String, trim: true},
  description: {type: String, trim: true}, 
  reg_date: {type: Date, default: Date.now}, 
  image: {type: String, default: "/public/images/noun_Tour Guide_2476937.png"}, 
  city: {type: String}
}, { 
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
schema.plugin(mongoosePaginate);
var Guide = mongoose.model('Guide', schema);

module.exports = Guide;
