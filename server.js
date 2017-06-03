//basic express setup
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

//stylus setting
var stylus = require('stylus');
var nib = require('nib');

// webpack middleware setting
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config.js');
var isDeveloping = process.env.NODE_ENV === 'development';

var app = express();

//origin setup parser
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


var routes = require('./routes/all');

// view engine setup
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'pug');

app.use(stylus.middleware({
  src: path.join(__dirname, "public/stylesheets"),
  compile: function(str, p) {
    return stylus(str).set("filename", p).use(nib());
  }
}));

//route
app.use('/', routes);


//webpack developing middleware

if (isDeveloping) {
  const compiler = webpack(config('development'));
  const middleware = webpackMiddleware(compiler, {
    publicPath: config('development').output.publicPath,
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  // app.get('*', function response(req, res) {
  //   res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '/build/index.html')));
  //   res.end();
  // });
} else {
  console.log('this is production mode');
  app.use('/', express.static(path.join(__dirname + '/build')));
  // app.get('/', function response(req, res) {
  //   res.sendFile(path.join(__dirname, '/build/index.html'));
  // });
}

app.listen(3000, '0.0.0.0', function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:3000/ in your browser.');
});
