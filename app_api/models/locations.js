const mongoose = require('mongoose');
var dbURI = 'mongodb+srv://thanhtung:thanhtung1@mean-basic-o1bfw.mongodb.net/test?retryWrites=true';
mongoose.connect(dbURI, {useNewUrlParser: true}).then(res => console.log('connected')).catch(err => console.log(err));
// mongoose.connections.on('connected', () => {
//   console.log('mongoose connected');
// });
// mongoose.connections.on('disconnected ' , () => {
//   console.log('mongoose disconnected');
// });

var reviewSchema = new mongoose.Schema({
  author: String,
  rating: {type: Number, required: true, min: 0, max: 5},
  reviewText: String,
  createOn: {type: Date, default: Date.now}
});

var openingTimeSchema = new mongoose.Schema({
  day:{
    type: String,
  },
  opening: String,
  closing: String,
  closed: {
    type: Boolean,
    required: true
  }
});

var locationSchema = new mongoose.Schema({
  name: {type: String, required: true},
  address: String,
  rating: {type: Number, 'default': 0, min: 0, max: 5},
  facilities: [String],
  coords: {type: [Number], point: '2dsphere'},
  openingTimes: [openingTimeSchema],
  reviews: [reviewSchema]
});

module.exports = mongoose.model('Location', locationSchema);
