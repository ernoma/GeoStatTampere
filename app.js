
var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var morgan  = require('morgan');
var parking = require('./parking.js');
var tampere = require('./tampere.js');
var digitraffic = require('./digitraffic.js');

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

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

	res.render('geostat',
		{title: 'Tamperelaisen paikkatilasto'});
});

app.get('/charts', function (req, res) {

	parking.showParkingCharts(req, res);
});

app.get('/3d', function (req, res) {

	res.render('3dmap',
		{title: 'Tampereen korkeusmalli'});
});

app.get('/parkki', function (req, res) {

	parking.showParkingMap(req, res);
	
});

app.get('/about', function (req, res) {

	res.render('about',
		{title: 'Tamperelaisen paikkatilasto'});
});


app.get('/heat', function (req, res) {
	res.render('heat',
		{title: 'Heatmap kokeilu'});
});

app.get('/digitraffic', function (req, res) {
        digitraffic.showCategories(req, res);
});

app.get('/roadweather.json', function (req, res) {
        digitraffic.roadweather(req, res);
});


app.get('/tredata.json', function (req, res) {
	tampere.getTreJSONData(req, res);
});

io.on('connection', function(socket){
    console.log('a client connected');
    socket.on('disconnect', function(){
	console.log('a client disconnected');
    });
});

app.set('port', (process.env.PORT || 3000));

http.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});

setInterval(updateClientData, 300000);
//setInterval(updateClientData, 10000);

function updateClientData() {
    digitraffic.updateClientData(io);
}
