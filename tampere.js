
var gdal = require('gdal')
var request = require('request')

// http://tampere.navici.com/tampere_wfs_geoserver/opendata/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=opendata:KESKUSTAN_PYSAKOINTI_VIEW&outputFormat=json&srsName=EPSG:4326&Filter=%3CFilter%20xmlns:gml=%22http://www.opengis.net/gml%22%3E%3CDWithin%3E%3CPropertyName%3Eopendata:GEOLOC%3C/PropertyName%3E%3Cgml:Point%3E%3Cgml:coordinates%3E24486813.517,6821119.113%3C/gml:coordinates%3E%3C/gml:Point%3E%3CDistance%3E1000%3C/Distance%3E%3C/DWithin%3E%3C/Filter%3E
// Filter=<Filter xmlns:gml="http://www.opengis.net/gml"><DWithin><PropertyName>opendata:GEOLOC</PropertyName><gml:Point><gml:coordinates>24486813.517,6821119.113</gml:coordinates></gml:Point><Distance>1000<Distance></DWithin></Filter>
// child_process.spawn('gdaltransform') -s

var tampere_data_names = {
	car_parking: "opendata:KESKUSTAN_PYSAKOINTI_VIEW",
	bike_parking: "opendata:PYORAPARKIT_VIEW"
}

var wgs84 = gdal.SpatialReference.fromEPSG(4326);
var gk24 = gdal.SpatialReference.fromEPSG(3878);
var coord_transform = new gdal.CoordinateTransformation(wgs84, gk24);

exports.getCarParkingJSONData = function getCarParkingJSONData(req, res) {
	getJSONData(req, res, tampere_data_names.car_parking);
}

exports.getBikeParkingJSONData = function getBikeParkingJSONData(req, res) {
	getJSONData(req, res, tampere_data_names.bike_parking);
}

function getJSONData(req, res, typeName) {
	var point_orig = {
		x: parseFloat(req.query.lon),
		y: parseFloat(req.query.lat)
	}

	var pt_gk24 = coord_transform.transformPoint(point_orig);

	console.log ("pt_gk24 - lat: " + pt_gk24.x + ", lon: " + pt_gk24.y);

	request('http://tampere.navici.com/tampere_wfs_geoserver/opendata/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=' + typeName + '&outputFormat=json&srsName=EPSG:4326&Filter=%3CFilter%20xmlns:gml=%22http://www.opengis.net/gml%22%3E%3CDWithin%3E%3CPropertyName%3Eopendata:GEOLOC%3C/PropertyName%3E%3Cgml:Point%3E%3Cgml:coordinates%3E' + pt_gk24.x + ',' + pt_gk24.y + '%3C/gml:coordinates%3E%3C/gml:Point%3E%3CDistance%3E' + req.query.radius + '%3C/Distance%3E%3C/DWithin%3E%3C/Filter%3E', function (error, response, body) {
		if (error) {
			return console.log('ERROR: ', error);
			// TODO better
		}
		else if (!error && response.statusCode == 200) {
			//console.log(body)
			res.json(body)
		}
		else {
			// TODO
		}
	})
}