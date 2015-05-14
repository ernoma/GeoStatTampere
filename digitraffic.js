var request = require('request');
var xml2js = require('xml2js');
var fs = require('fs');
var csv = require('csv');
var gdal = require('gdal');

var INITIAL_LAT = 61.5;
var INITIAL_LNG = 23.766667;
var INITIAL_RADIUS = 60000; // in meters

var static_weather_station_data = undefined;
var road_weather_data = undefined;

var wgs84 = gdal.SpatialReference.fromEPSG(4326);
var KKJ = gdal.SpatialReference.fromProj4('+proj=tmerc +lat_0=0 +lon_0=27 +k=1 +x_0=3500000 +y_0=0 +ellps=intl +towgs84=-96.062,-82.428,-121.753,4.801,0.345,-1.376,1.496 +units=m +no_defs');
var coord_transform = new gdal.CoordinateTransformation(KKJ, wgs84);

fs.readFile(__dirname + '/data/meta_rws_stations_2014_09_23.csv', function(err, csv_data) {  
    csv.parse(csv_data, function(err, data) {
	//console.log(data[1][0]);
	static_weather_station_data = data;
	static_weather_station_data.splice(0, 1);
    });
});

//fs.readFile(__dirname + '/data/roadWeather_response.xml', function(err, data) {  
//    parser.parseString(data);
//});

function retrieveWeatherData(center_lat, center_lng, radius, callback) {
    var SOAP_request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
        'xmlns:sch="http://www.gofore.com/sujuvuus/schemas">' +
        '<soapenv:Header/>' +
        '<soapenv:Body>' +
        '<sch:RoadWeather/>' +
        '</soapenv:Body>' +
        '</soapenv:Envelope>';

    var options = {
	method: 'POST',
	url: 'http://open.digitraffic.fi/services/roadWeather',
	headers: {
	    'DT-User-Agent' : 'digitrafficTest',
	    'DT-Contact-Info' : 'ernoma@gmail.com'
	},
	body: SOAP_request
    };
    
    var parser = new xml2js.Parser();

    request(options, function (error, response, body) {
	if (error) {
	    return console.log('ERROR: ', error);
	}
	else if (!error && response.statusCode == 200) {
	    //console.log(body)
	    parser.parseString(body);

	}
	else {
	    // TODO
	}
    });
	    
    parser.on('end', function(result) {  
	//console.log(result);
	road_weather_data = result['soap:Envelope']['soap:Body'][0].RoadWeatherResponse[0].roadweatherdata[0].roadweather;
	//console.log(road_weather_data.length);
	//console.log(road_weather_data[0]);

	cleaned_road_weather_data = [];

	for (var i = 0; i < road_weather_data.length; i++) {
	    for (var j = 0; j < static_weather_station_data.length; j++) {
		if (static_weather_station_data[j][0] == road_weather_data[i].stationid[0]) {
		    //console.log("found");
		    // Convert coordinates,
		    // calculate dist from req.query.lat,lng to station, and 
		    // if dist inside req.query.radius then
		    // include station data to the results

		    var point_orig = {
                        x: parseFloat(static_weather_station_data[j][9]),
                        y: parseFloat(static_weather_station_data[j][8])
                    }
                    var pt_wgs84 = coord_transform.transformPoint(point_orig);
		    var dist = getDistanceFromLatLonInMeters(pt_wgs84.y, pt_wgs84.x, center_lat, center_lng);
//		    if (point.orig.x == 6860000
		    //console.log(point_orig);
		    //console.log(pt_wgs84);
		    //console.log(dist);
		    if (dist <= radius) {
			station_data = {
			    id: road_weather_data[i].stationid[0],
			    lat: pt_wgs84.y,
			    lng: pt_wgs84.x,
			    air_temperature: road_weather_data[i].airtemperature1[0],
			    road_temperature1: road_weather_data[i].roadsurfacetemperature1[0],
			    //road_temperature2: road_weather_data[i].roadsurfacetemperature2[0],
			    measurement_time: road_weather_data[i].measurementtime[0]
			}
			cleaned_road_weather_data.push(station_data);
		    }

		    break;
		}
		else {
		    //console.log(static_weather_station_data[j][0] + "!=" + road_weather_data[i].stationid[0]);
		}
	    }
	}
    	callback(cleaned_road_weather_data);
    });
}


exports.updateClientData = function updateClientData(io) {
    retrieveWeatherData(INITIAL_LAT, INITIAL_LNG, INITIAL_RADIUS, function(cleaned_road_weather_data) {
	data = JSON.stringify(cleaned_road_weather_data);
	io.emit('weather', data);
    });
}

exports.roadweather = function roadweather(req, res) {
    retrieveWeatherData(req.query.lat, req.query.lng, req.query.radius, function(cleaned_road_weather_data) {
	res.json(cleaned_road_weather_data);
    });
}

exports.showCategories = function showCategories(req, res) {
	
    res.render('digitraffic',
	       {title: 'Tiesää'
		//categories: JSON.stringify(parkingWFSFeatures)
	       });
}

//
// From http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points
//
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  var R = 6371*1000; // Radius of the earth in m
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance inm
  return d;
}
function deg2rad(deg) {
  return deg * (Math.PI/180);
}
