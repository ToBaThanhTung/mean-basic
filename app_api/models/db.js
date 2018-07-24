var mongoose = require('mongoose');

var dbURI = 'mongodb+srv://thanhtung:%40bietdoi2@mean-basic-o1bfw.mongodb.net/test?retryWrites=true';
mongoose.connect(dbURI);
mongoose.connections.on('connected', () => {
  console.log('mongoose connected');
});
mongoose.connections.on('disconnected ' , () => {
  console.log('mongoose disconnected');
});

//require('./location');
