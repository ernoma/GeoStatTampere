
var request = require('request')


exports.roadweather = function roadweather(req, res) {

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

  request(options, function (error, response, body) {
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
}

exports.showCategories = function showCategories(req, res) {
	
    res.render('digitraffic',
	       {title: 'Digitraffic'
		//categories: JSON.stringify(parkingWFSFeatures)
	       });
}
