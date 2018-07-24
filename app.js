const express = require('express');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
//mongoose.connect('mongodb://thanhtung:%40bietdoi2@cluster0-shard-00-00-soeib.mongodb.net:27017,cluster0-shard-00-01-soeib.mongodb.net:27017,cluster0-shard-00-02-soeib.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true' , { useNewUrlParser: true });

const morgan = require('morgan');
const bodyParser = require('body-parser');

const routes = require('./app_server/routes/index');
const users = require('./app_server/routes/users');
const routesApi = require('./app_api/routes/index');
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
var dbURI = 'mongodb+srv://thanhtung:thanhtung1@mean-basic-o1bfw.mongodb.net/test?retryWrites=true';
mongoose.connect(dbURI, {useNewUrlParser: true}).then(res => console.log('connected')).catch(err => console.log(err));


// view settup

app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/api', routesApi);
app.use('/users', users);


// catch 404
app.use((req, res, next) => {
  var err = new Error('Not found');
  err.status = 404;
  next(err);
});

if(process.env.NODE_ENV !== 'production') {
  process.once('uncaughtException', function(err) {
    console.error('FATAL: Uncaught exception.');
    console.error(err.stack||err);
    setTimeout(function(){
      process.exit(1);
    }, 100);
  });
}

// if(app.get('env') === 'development'){
//   app.use((err, req, res, next) => {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//     return;
//   });
// }
server.listen(port, () => {
  console.log('server is up on ', port);
});
