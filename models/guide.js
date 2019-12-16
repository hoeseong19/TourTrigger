var mongoose = require('mongoose'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema;

var schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' , unique: true},
  name: {type: String, trim: true},
  description: {type: String, trim: true}, 
  reg_date: {type: Date, default: Date.now}, 
  image: {type: String, default: "https://webprojectimages.s3.amazonaws.com/cf4ab9d7-da11-46f1-8481-7877e7423d6f/noun_Tour Guide_2476937.png"}, 
  city: {type: String}
}, { 
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
schema.plugin(mongoosePaginate);
var Guide = mongoose.model('Guide', schema);

module.exports = Guide;
