const express = require('express');
const http = require('http');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const routes = require('./app_server/routes/index');
const users = require('./app_server/routes/users');
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
// view settup

app.set('views', path.join(__dirname, 'app_server', 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);
app.use('/users', users);


// catch 404
app.use((req, res, next) => {
  var err = new Error('Not found');
  err.status = 404;
  next(err);
});

if(app.get('env') === 'development'){
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
server.listen(port, () => {
  console.log('server is up on ', port);
});
