
var gdal = require('gdal');
var request = require('request');

// child_process.spawn('gdaltransform') -s

var tampereOpenDataSets = [
	{
		internal_name: "cp",
		name: "opendata:KESKUSTAN_PYSAKOINTI_VIEW",
		path: "tampere_wfs_geoserver/opendata/ows"
	},
	{
		internal_name: "bp",
		name: "opendata:PYORAPARKIT_VIEW",
		path: "tampere_wfs_geoserver/opendata/ows"
	},
	{
		internal_name: "dp",
		name: "opendata:WFS_KOIRAPUISTO_MVIEW",
		path: "tampere_wfs_geoserver/opendata/ows"
	},
	{
		internal_name: "bs",
		name: "tampere_ora:BUSSIPYSAKIT",
		path: "tampere_wfs_geoserver/tampere_ora/ows"
	},
	{
		internal_name: "bd",
		name: "tampere_iris:WFS_LAITURIPAIKKA",
		path: "tampere_wfs_geoserver/tampere_iris/ows"
	},
	{
		internal_name: "rbd",
		name: "opendata:WFS_SOUTUVENERANTA",
		path: "tampere_wfs_geoserver/opendata/ows"
	},
	{
		internal_name: "ws",
		name: "tampere_iris:WFS_TALVILIUKUPAIKKA",
		path: "tampere_wfs_geoserver/tampere_iris/ows"
	},
	{
		internal_name: "pf",
		name: "opendata:WFS_KENTTA_MVIEW",
		path: "tampere_wfs_geoserver/opendata/ows"
	},
	{
		internal_name: "sa",
		name: "opendata:WFS_RULLALAUTAILUALUE_MVIEW",
		path: "tampere_wfs_geoserver/opendata/ows"
	},
	{
		internal_name: "pg",
		name: "opendata:WFS_LEIKKIPAIKKA_MVIEW",
		path: "tampere_wfs_geoserver/opendata/ows"
	},
	{
		internal_name: "es",
		name: "opendata:KOULUT",
		path: "tampere_wfs_geoserver/opendata/ows"
	},
	{
		internal_name: "dc",
		name: "opendata:PAIVAKODIT",
		path: "tampere_wfs_geoserver/opendata/ows"
	},
	{
		internal_name: "t",
		name: "opendata:WFS_ROSKIS",
		path: "tampere_wfs_geoserver/opendata/ows"
	},
	{
		internal_name: "sl",
		name: "opendata:WFS_KATUVALO",
		path: "tampere_wfs_geoserver/opendata/ows"
	},
	{
		internal_name: "tls",
		name: "opendata:WFS_LIIKENNEVALO_ILMAISIN",
		path: "tampere_wfs_geoserver/opendata/ows"
	},
	{
		internal_name: "b",
		name: "tampere_iris:WFS_SILTA",
		path: "tampere_wfs_geoserver/tampere_iris/ows"
	},
	{
		internal_name: "tlj",
		name: "opendata:WFS_LIIKENNEVALO_LIITTYMA",
		path: "tampere_wfs_geoserver/opendata/ows"
	}
];

var wgs84 = gdal.SpatialReference.fromEPSG(4326);
var gk24 = gdal.SpatialReference.fromEPSG(3878);
var coord_transform = new gdal.CoordinateTransformation(wgs84, gk24);

exports.getTreJSONData = function getTreJSONData(req, res) {

	var typeName = undefined;
	var path = undefined;
	
	for (var i = 0; i < tampereOpenDataSets.length; i++) {
		if (req.query.dataSetName == tampereOpenDataSets[i].internal_name) {
			typeName = tampereOpenDataSets[i].name;
			path = tampereOpenDataSets[i].path;
			break;
		}
	}
	
	if (typeName != undefined) {
	
		var point_orig = {
			x: parseFloat(req.query.lon),
			y: parseFloat(req.query.lat)
		}

		var pt_gk24 = coord_transform.transformPoint(point_orig);

		//console.log ("pt_gk24 - lng: " + pt_gk24.x + ", lat: " + pt_gk24.y);

		//console.log(req.query.sizeFilter);
		var sizeFilter = JSON.parse(req.query.sizeFilter);
		//console.log(sizeFilter);
		
		if (sizeFilter.radius != undefined) { // circle
			// http://tampere.navici.com/tampere_wfs_geoserver/opendata/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=opendata:KESKUSTAN_PYSAKOINTI_VIEW&outputFormat=json&srsName=EPSG:4326&Filter=%3CFilter%20xmlns:gml=%22http://www.opengis.net/gml%22%3E%3CDWithin%3E%3CPropertyName%3Eopendata:GEOLOC%3C/PropertyName%3E%3Cgml:Point%3E%3Cgml:coordinates%3E24486813.517,6821119.113%3C/gml:coordinates%3E%3C/gml:Point%3E%3CDistance%3E1000%3C/Distance%3E%3C/DWithin%3E%3C/Filter%3E
			// Filter=<Filter xmlns:gml="http://www.opengis.net/gml"><DWithin><PropertyName>opendata:GEOLOC</PropertyName><gml:Point><gml:coordinates>24486813.517,6821119.113</gml:coordinates></gml:Point><Distance>1000<Distance></DWithin></Filter>
			
			//console.log('http://tampere.navici.com/' + path + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + typeName + '&outputFormat=json&srsName=EPSG:4326&Filter=%3CFilter%20xmlns:gml=%22http://www.opengis.net/gml%22%3E%3CDWithin%3E%3CPropertyName%3Eopendata:GEOLOC%3C/PropertyName%3E%3Cgml:Point%3E%3Cgml:coordinates%3E' + pt_gk24.x + ',' + pt_gk24.y + '%3C/gml:coordinates%3E%3C/gml:Point%3E%3CDistance%3E' + sizeFilter.radius + '%3C/Distance%3E%3C/DWithin%3E%3C/Filter%3E');
			
			request('http://tampere.navici.com/' + path + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + typeName + '&outputFormat=json&srsName=EPSG:4326&Filter=%3CFilter%20xmlns:gml=%22http://www.opengis.net/gml%22%3E%3CDWithin%3E%3CPropertyName%3Eopendata:GEOLOC%3C/PropertyName%3E%3Cgml:Point%3E%3Cgml:coordinates%3E' + pt_gk24.x + ',' + pt_gk24.y + '%3C/gml:coordinates%3E%3C/gml:Point%3E%3CDistance%3E' + sizeFilter.radius + '%3C/Distance%3E%3C/DWithin%3E%3C/Filter%3E', function (error, response, body) {
				if (error) {
					return console.log('ERROR: ', error);
					// TODO better
				}
				else if (!error && response.statusCode == 200) {
					//console.log(body)
					res.json(body);
				}
				else {
					// TODO
				}
			});
		} else if (sizeFilter.east != undefined ) { // rectangle
		
			var point_orig_sw = {
				x: sizeFilter.west,
				y: sizeFilter.south
			}
			var pt_gk24_sw = coord_transform.transformPoint(point_orig_sw);
			var point_orig_ne = {
				x: sizeFilter.east,
				y: sizeFilter.north
			}
			var pt_gk24_ne = coord_transform.transformPoint(point_orig_ne);
		
			request('http://tampere.navici.com/' + path + '?service=WFS&version=1.0.0&request=GetFeature&typeName=' + typeName + '&outputFormat=json&srsName=EPSG:4326&bbox=' + pt_gk24_sw.x + ',' + pt_gk24_sw.y + ',' + pt_gk24_ne.x + ',' + pt_gk24_ne.y, function (error, response, body) {
				if (error) {
					return console.log('ERROR: ', error);
					// TODO better
				}
				else if (!error && response.statusCode == 200) {
					//console.log(body)
					res.json(body);
				}
				else {
					console.log("response.statusCode: " + response.statusCode);
					// TODO
				}
			});
		}
		else { // no filter
			// TODO
		}
	}
	else {
		// TODO
	}
}
