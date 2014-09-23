
var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var morgan  = require('morgan');
var parking = require('./parking.js');
var tampere = require('./tampere.js');

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

var app = express();

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(morgan('dev'));
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {

	parking.showParkingMap(req, res);
});

app.get('/charts', function (req, res) {

	parking.showParkingCharts(req, res);
});

app.get('/3d', function (req, res) {

	res.render('3dmap',
		{title: 'Tampereen korkeusmalli'});
});

app.get('/geostat', function (req, res) {

	res.render('geostat',
		{title: 'Tamperelaisen paikkatieto'});
});

app.get('/about', function (req, res) {

	res.render('about',
		{title: 'Tamperelaisen paikkatieto'});
});


app.get('/car_parking.json', function (req, res) {
	
	tampere.getCarParkingJSONData(req, res);
});

app.get('/bike_parking.json', function (req, res) {
	
	tampere.getBikeParkingJSONData(req, res);
});

app.listen(3000);
