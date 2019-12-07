var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema;

var schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  name: {type: String, trim: true},
  email: {type: String, index: true, unique: true, trim: true},
  password: {type: String, trim: true},
  reg_date: {type: Date, default: Date.now}, 
  
  image: {type: String}
}, { 
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
schema.plugin(mongoosePaginate);
var Guide = mongoose.model('Guide', schema);

module.exports = Guide;
