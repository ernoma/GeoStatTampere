
var request = require('request');
var xml2js = require('xml2js');
var fs = require('fs');

var parser = new xml2js.Parser();

//fs.readFile(__dirname + '/data/meta_rws_stations_2014_09_23.csv', function(err, data) {  
//    parser.parseString(data);
//});

exports.roadweather = function roadweather(req, res) {

    parser.on('end', function(result) {  
      console.log(result);
      res.json(result);
    });

    fs.readFile(__dirname + '/data/roadWeather_response.xml', function(err, data) {  
      parser.parseString(data);
    });

    /*var SOAP_request = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" ' +
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
    }*/
  }

exports.showCategories = function showCategories(req, res) {
	
    res.render('digitraffic',
	       {title: 'Digitraffic'
		//categories: JSON.stringify(parkingWFSFeatures)
	       });
}
