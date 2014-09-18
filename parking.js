
//var wfs = require('wfs')
var fs = require('fs')
var gdal = require('gdal')
//var child_process = require('child_process');
var request = require('request')

var file = __dirname + '/data/parking_slots.json';
 
var parkingWFSFeatures = null;
 
parkingWFSFeatures = JSON.parse(fs.readFileSync(file, 'utf8')).features;

// http://tampere.navici.com/tampere_wfs_geoserver/opendata/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=opendata:KESKUSTAN_PYSAKOINTI_VIEW&outputFormat=json&srsName=EPSG:4326&Filter=%3CFilter%20xmlns:gml=%22http://www.opengis.net/gml%22%3E%3CDWithin%3E%3CPropertyName%3Eopendata:GEOLOC%3C/PropertyName%3E%3Cgml:Point%3E%3Cgml:coordinates%3E24486813.517,6821119.113%3C/gml:coordinates%3E%3C/gml:Point%3E%3CDistance%3E1000%3C/Distance%3E%3C/DWithin%3E%3C/Filter%3E

//Filter=<Filter xmlns:gml="http://www.opengis.net/gml"><DWithin><PropertyName>opendata:GEOLOC</PropertyName><gml:Point><gml:coordinates>24486813.517,6821119.113</gml:coordinates></gml:Point><Distance>1000<Distance></DWithin></Filter>

//child_process.spawn('gdaltransform') -s

var wgs84 = gdal.SpatialReference.fromEPSG(4326);
var gk24 = gdal.SpatialReference.fromEPSG(3878);
var coord_transform = new gdal.CoordinateTransformation(wgs84, gk24);

exports.getParkingJSONData = function getParkingJSONData(req, res) {

  var point_orig = {
    x: parseFloat(req.query.lon),
    y: parseFloat(req.query.lat)
  }
  
  var pt_gk24 = coord_transform.transformPoint(point_orig);

  console.log ("pt_gk24 - lat: " + pt_gk24.x + ", lon: " + pt_gk24.y);

  request('http://tampere.navici.com/tampere_wfs_geoserver/opendata/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=opendata:KESKUSTAN_PYSAKOINTI_VIEW&outputFormat=json&srsName=EPSG:4326&Filter=%3CFilter%20xmlns:gml=%22http://www.opengis.net/gml%22%3E%3CDWithin%3E%3CPropertyName%3Eopendata:GEOLOC%3C/PropertyName%3E%3Cgml:Point%3E%3Cgml:coordinates%3E' + pt_gk24.x + ',' + pt_gk24.y + '%3C/gml:coordinates%3E%3C/gml:Point%3E%3CDistance%3E' + req.query.radius + '%3C/Distance%3E%3C/DWithin%3E%3C/Filter%3E', function (error, response, body) {
    if (error) {
      return console.log('ERROR: ', error);
    }
    else if (!error && response.statusCode == 200) {
      //console.log(body)
      res.json(body)
    }
    else {
      // TODO
    }
  })

	/*wfs.getFeature({
		url: 'http://tampere.navici.com/tampere_wfs_geoserver/opendata/ows',
		typeName: 'opendata:KESKUSTAN_PYSAKOINTI_VIEW',
		srsName : 'EPSG:4326',
		outputFormat: 'json',
		filter: '<Filter xmlns:gml="http://www.opengis.net/gml"><DWithin><PropertyName>opendata:GEOLOC</PropertyName><gml:Point>' +
			'<gml:coordinates>' + pt_gk24.x + ',' + pt_gk24.y + '</gml:coordinates>' +
			'</gml:Point><Distance>' + req.query.radius + '</Distance></DWithin></Filter>'
		}, function(err, results) {
			if (err) {
				return console.log('ERROR: ', err);
			}

      //console.log(JSON.parse(results).features)

			res.json(results)
			
			// if (results.features) {
				// console.log('found ' + results.features.length + ' parking places');
				// results.features.forEach(function(feature) {
					// //console.log('found feature: ' + feature.id);
				// });
				
				// // var jsonData = {
					// // "jee": "jaa"
				// // }
			
				// res.json(jsonData)
			// }
		})*/
}



exports.showParkingMap = function showParkingMap(re, res) {
	
	res.render('index',
		{title: 'Etusivu',
		parkingWFSFeatures: JSON.stringify(parkingWFSFeatures)})

	/* wfs.getFeature({
		url: 'http://tampere.navici.com/tampere_wfs_geoserver/opendata/ows',
		typeName: 'opendata:KESKUSTAN_PYSAKOINTI_VIEW',
		srsName : 'EPSG:4326'
		}, function(err, results) {
			if (err) {
				return console.log('ERROR: ', err);
			}

			if (results.features) {
				console.log('found ' + results.features.length + ' parking places');
				results.features.forEach(function(feature) {
					//console.log('found feature: ' + feature.id);
				});
				
				res.render('index',
					{title: 'Etusivu',
					parkingWFSFeatures: JSON.stringify(results.features)}
				)
			}
		})*/
}
	  

exports.showParkingCharts = function showParkingCharts(re, res) {
	
	res.render('charts',
		{title: 'Tilastoja',
		parkingWFSFeatures: JSON.stringify(parkingWFSFeatures)})

	/* wfs.getFeature({
		url: 'http://tampere.navici.com/tampere_wfs_geoserver/opendata/ows',
		typeName: 'opendata:KESKUSTAN_PYSAKOINTI_VIEW',
		srsName : 'EPSG:4326'
		}, function(err, results) {
			if (err) {
				return console.log('ERROR: ', err);
			}

			if (results.features) {
				console.log('found ' + results.features.length + ' parking places');
				results.features.forEach(function(feature) {
					//console.log('found feature: ' + feature.id);
				});
				
				res.render('index',
					{title: 'Etusivu',
					parkingWFSFeatures: JSON.stringify(results.features)}
				)
			}
		})*/
}
	  
