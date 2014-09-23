
var INITIAL_LAT = 61.5;
var INITIAL_LON = 23.766667;

var INITIAL_AREA_RADIUS = 500;

var wgs84Proj4 = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs';
var etrsgk24Proj4 = '+proj=tmerc +lat_0=0 +lon_0=24 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs';

// var test = proj4(wgs84Proj4, etrsgk24Proj4, [INITIAL_LON, INITIAL_LAT]);
// console.log(test);

// console.log(proj4(etrsgk24Proj4, wgs84Proj4, test));
// var test2 = [487573.8889, 6821232.4117];
// console.log(proj4(etrsgk24Proj4, wgs84Proj4, test2));

var center_icon = L.icon({
  iconUrl: '/images/center_icon.png',
  iconSize: [20, 20],
  iconAnchor: [9, 9]
});

var parking_icon = L.icon({
  iconUrl: '/images/parking_garage_22x22.png',
  iconSize: [22, 22],
  iconAnchor: [10, 10]
});

var area_circle_tool_selected = true;
var area_rectangle_tool_selected = false;

function StatArea(path, type, marker, selected, name, radius) {
	this.path = path;
	this.type = type;
	this.marker = marker;
	this.selected = selected;
	this.name = name;
	if (type == "circle") {
		this.radius = radius;
	}
	else {
		this.latRadius = radius;
		this.lngRadius = radius;
	}
}

StatArea.prototype.isLatLngInsidePath = function(latlng) {
	if (this.type == "circle") {
		return is_inside_circle(latlng, this.path);
	}
	else {
		return is_inside_rectangle(latlng, this.path);
	}
}

var statAreas = [];

var statAreaColors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', 
   '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'];
   
var statAreaCount = 0;

var categories = [
	{
		name: "Keskustan maksulliset tai muuten rajoitetut pysäköintikohteet",
		internalName: "car_parking"
	},
	{
		name: "Pyöräparkit",
		internalName: "bike_parking"
	}
];

var selectedCategories = [];

var osmLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 18
});
var osmCycleLayer = L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Maps &copy; <a href="http://thunderforest.com/">Thunderforest</a>',
    maxZoom: 18
});
var mapBoxLayer = L.tileLayer('http://{s}.tiles.mapbox.com/v3/' + api_keys.mapbox + '/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
});
var mapQuestLayer = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg', {
	subdomains: '1234',
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">',
    maxZoom: 18
});
var stamenTonerLayer = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.jpg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>. Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>',
    maxZoom: 18
});
var mmlPerusLayer = L.tileLayer('http://tiles.kartat.kapsi.fi/peruskartta/{z}/{x}/{y}.jpg', {
    attribution: 'Sisältää Maanmittauslaitoksen peruskartta-aineistoa, <a href="http://www.maanmittauslaitos.fi/avoindata_lisenssi_versio1_20120501">lisenssi</a>, TMS: <a href="http://kartat.kapsi.fi/">kartat.kapsi.fi</a>',
    maxZoom: 18
});
var mmlTaustaLayer = L.tileLayer('http://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg', {
    attribution: 'Sisältää Maanmittauslaitoksen taustakartta-aineistoa, <a href="http://www.maanmittauslaitos.fi/avoindata_lisenssi_versio1_20120501">lisenssi</a>, TMS: <a href="http://kartat.kapsi.fi/">kartat.kapsi.fi</a>',
    maxZoom: 18
});
var mmlOrtoLayer = L.tileLayer('http://tiles.kartat.kapsi.fi/ortokuva/{z}/{x}/{y}.jpg', {
    attribution: 'Sisältää Maanmittauslaitoksen ortoilmakuva-aineistoa, <a href="http://www.maanmittauslaitos.fi/avoindata_lisenssi_versio1_20120501">lisenssi</a>, TMS: <a href="http://kartat.kapsi.fi/">kartat.kapsi.fi</a>',
    maxZoom: 18,
	minZoom: 13
});
var treGuideLayer = L.tileLayer.wms('http://opendata.navici.com/tampere/ows?service=wms', {
	attribution: 'Sisältää Tampereen kaupungin <a href="http://palvelut2.tampere.fi/tietovaranto/tietovaranto.php?id=136&alasivu=1&vapaasana=">"Tampereen opaskartta"</a>-aineistoa, <a href="http://www.tampere.fi/avoindata/lisenssi">lisenssi</a>',
	layers: 'opendata:tampere_okartta_gk24',
	version: '1.3.0'
});
var treBaseLayer = L.tileLayer.wms('http://opendata.navici.com/tampere/ows?service=wms', {
	attribution: 'Sisältää Tampereen kaupungin <a href="http://palvelut2.tampere.fi/tietovaranto/tietovaranto.php?id=137&alasivu=1&vapaasana=">"Tampereen kantakartta ilman kiinteistörajoja"</a>-aineistoa, <a href="http://www.tampere.fi/avoindata/lisenssi">lisenssi</a>',
	layers: 'opendata:tampere_kkartta_pohja_gk24',
	version: '1.3.0'
});

var map = L.map('map_canvas', {layers: [osmLayer]}).setView([INITIAL_LAT, INITIAL_LON], 13);

map.on('zoomend', function(e) {
	console.log("zoom: " + map.getZoom());
});

var baseMaps = {
	"Perinteinen, OpenStreetMap": osmLayer,
	"Opaskartta, Tampere": treGuideLayer,
	"Kantakartta, Tampere": treBaseLayer,
	"Ilmakuva, Maanmittauslaitos": mmlOrtoLayer,
	"Katu, MapBox": mapBoxLayer,
	"Katu, MapQuest": mapQuestLayer,
	"Pyöräily, Thunderforest": osmCycleLayer,
	// "Peruskartta, Maanmittauslaitos": mmlPerusLayer,
	// "Taustakartta, Maanmittauslaitos": mmlTaustaLayer,
	"Mustavalko, Stamen": stamenTonerLayer
}
L.control.layers(baseMaps).addTo(map);

L.control.scale({
	imperial: false
}).addTo(map);

var popup = L.popup()
    .setLatLng([INITIAL_LAT, INITIAL_LON])
    .setContent("Klikkaa karttaa lisätäksesi alueen.")
    .openOn(map);

var layers = {
	parkingLayer: L.geoJson(null,
		{
			pointToLayer : function (feature, latlng) {
				return L.marker(latlng, { icon: parking_icon });
			}
		}).addTo(map)
}

function getDataOnArea(lat, lon, statArea, sizeFilter) {

	var valueArray = Array.apply(null, new Array(selectedCategories.length)).map(Number.prototype.valueOf,0); // array of zeros
	
	var series = geochart.addChartSeries(valueArray, statArea.name);

	for (var i = 0; i < selectedCategories.length; i++) {
		getDataOnCategory(selectedCategories[i], series.name, lat, lon, sizeFilter);
	}
}

function updateDataOnArea(lat, lon, statArea, sizeFilter) {
	
	for (var i = 0; i < selectedCategories.length; i++) {
		getDataOnCategory(selectedCategories[i], statArea.name, lat, lon, sizeFilter);
	}
}

function getDataOnCategory(category, seriesName, lat, lon, sizeFilter) {
	
	var n = Math.floor((Math.random() * 100) + 1);
	console.log("Alue: " + seriesName + ", kategoria: " + category.name + ", count: " + n);
	geochart.updateSeriesCategory(category.name, seriesName, n);
	
	// $.getJSON("/" +  category.internalName + ".json", { sizeFilter: JSON.stringify(sizeFilter), lat: lat, lon: lon }, function(response) {
		// parsed_response = JSON.parse(response)
		// console.log("N of features: " + parsed_response.totalFeatures)
				
		// geochart.updateSeriesCategory(category.name, seriesName, parsed_response.totalFeatures);
	// });
}


//$(document).ready(getDataOnArea(500, INITIAL_LAT, INITIAL_LON ))

function geoLocate() {
	map.locate({setView: true, maxZoom: 16, enableHighAccuracy: true});
}

// function onLocationFound(e) {
    // var radius = e.accuracy / 2;

    // L.marker(e.latlng).addTo(map)
        // .bindPopup("You are within " + radius + " meters from this point").openPopup();

    // L.circle(e.latlng, radius).addTo(map);
// }

function onLocationError(e) {
    alert(e.message);
	// TODO better message
}

$("#geolocate_button").click(geoLocate)

//map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

function onMapClick(e) {

	var found = false;
	
	console.log("ctrlKeyPressed: " + ctrlKeyPressed);
	
	for(var i = 0; i < statAreas.length; i++) {
		if (statAreas[i].isLatLngInsidePath(e.latlng)) {
			found = true;
			// TODO
			
			statAreas[i].path.setStyle({
				weight: 5
			});
			statAreas[i].selected = true;
		
		}
		else {
			if (!ctrlKeyPressed && statAreas[i].selected) {
				statAreas[i].path.setStyle({
					weight: 2
				});
				statAreas[i].selected = false;
			}
		}
	}
	
	if (!found) {
		
		var circle = null;
		var rectangle = null;
	
		if (area_circle_tool_selected) {
			circle = L.circle(e.latlng, INITIAL_AREA_RADIUS, {
				color: statAreaColors[statAreaCount % statAreaColors.length],
				weight: 5,
				fillColor: statAreaColors[statAreaCount % statAreaColors.length],
				fillOpacity: 0.5
			}).addTo(map);
		} else {
			var latLngBounds = getlatLngBounds(e.latlng, INITIAL_AREA_RADIUS, INITIAL_AREA_RADIUS);
			rectangle = L.rectangle(latLngBounds, {
				color: statAreaColors[statAreaCount % statAreaColors.length],
				weight: 5,
				fillColor: statAreaColors[statAreaCount % statAreaColors.length],
				fillOpacity: 0.5
			}).addTo(map);
		}
		
		statAreaCount++;
		
		var marker = L.marker(e.latlng, { icon: center_icon, draggable:'true' }).addTo(map);
		//marker.bindPopup("leveys: " + INITIAL_LAT + ", pituus: " + INITIAL_LON);
		marker.bindPopup("Alue " + statAreaCount);
		var statArea = new StatArea(area_circle_tool_selected ? circle : rectangle,
			area_circle_tool_selected ? "circle" : "rectangle",
			marker,
			true,
			"Alue " + statAreaCount, INITIAL_AREA_RADIUS);
			
		if (area_circle_tool_selected) {
			marker.on('drag', function(event){
				var position = event.target.getLatLng();
				circle.setLatLng(position);
			});
		}
		else {
			marker.on('drag', function(event){
				var position = event.target.getLatLng();
				var latLngBounds = getlatLngBounds(position, statArea.latRadius, statArea.lngRadius);
				rectangle.setBounds(latLngBounds);
			});
		}
		
		statAreas.push(statArea);
	
		marker.on('click', function(event){
			for(var i = 0; i < statAreas.length; i++) {
				if (statAreas[i].marker == this) {
					found = true;
					statAreas[i].path.setStyle({
						weight: 5
					})
					statAreas[i].selected = true;
					$("#delete_button").removeAttr("disabled");
				}
				else {
					if (!ctrlKeyPressed && statAreas[i].selected) {
						statAreas[i].path.setStyle({
							weight: 2
						})
						statAreas[i].selected = false;
					}
				}
			}
			checkSelectedAreas();
		});
	
		marker.on('dragend', function(event){
			var position = event.target.getLatLng();
			for(var i = 0; i < statAreas.length; i++) {
				if (statAreas[i].marker == this) {
				
					if (statAreas[i].type == "circle") {
						statAreas[i].path.setLatLng(position);
					}
					else {
						var latLngBounds = getlatLngBounds(position, statAreas[i].latRadius, statAreas[i].lngRadius);
						statAreas[i].path.setBounds(latLngBounds);
					}
					found = true
					statAreas[i].path.setStyle({
						weight: 5
					})
					statAreas[i].selected = true;
					if (statAreas[i].type == "circle") {
						updateDataOnArea(e.latlng.lat, e.latlng.lng, statArea, { radius: statAreas[i].path.getRadius() });
					}
					else {
						var latLngBounds = statAreas[i].path.getBounds();
						updateDataOnArea(e.latlng.lat, e.latlng.lng, statArea, { east: latLngBounds.getEast(), south: latLngBounds.getSouth(), west: latLngBounds.getWest(), north: latLngBounds.getNorth() });
					}
					$("#delete_button").removeAttr("disabled");
				}
				else {
					if (!ctrlKeyPressed && statAreas[i].selected) {
						statAreas[i].path.setStyle({
							weight: 2
						})
						statAreas[i].selected = false;
					}
				}
			}
			checkSelectedAreas();
		})
		
		if (statAreas[i].type == "circle") {
			getDataOnArea(e.latlng.lat, e.latlng.lng, statArea, { radius: statArea.path.getRadius() });
		}
		else {
			var latLngBounds = statAreas[i].path.getBounds();
			getDataOnArea(e.latlng.lat, e.latlng.lng, statArea, { east: latLngBounds.getEast(), south: latLngBounds.getSouth(), west: latLngBounds.getWest(), north: latLngBounds.getNorth() });
		}
	}
	
	checkSelectedAreas();
	$("#delete_button").removeAttr("disabled");
	$("#delete_all_button").removeAttr("disabled");
}

function checkSelectedAreas() {
	var selectedCount = 0;
	
	for(var i = 0; i < statAreas.length; i++) {
		if (statAreas[i].selected == true) {
			selectedCount++;;
		}
	}
	if (selectedCount == 1) {
		$("#area_edit_button").removeAttr("disabled");
	}
	else {
		$("#area_edit_button").attr("disabled", "disabled");
	}
}

map.on('click', onMapClick);

function is_inside_circle(latlng, circle) {

	var lat1 = latlng.lat;
	var lat2 = circle.getLatLng().lat;
	var lng1 = latlng.lng;
	var lng2 = circle.getLatLng().lng;

	var dist = getDistanceFromLatLonInMeters(lat1, lng1, lat2, lng2);
	
	console.log(dist);
	console.log(circle.getRadius());
	
	return dist <= circle.getRadius();
}

function is_inside_rectangle(latlng, rectangle) {
	return rectangle.getBounds().contains(latlng);
}

//
// Distance constant from http://gis.stackexchange.com/questions/19760/how-do-i-calculate-the-bounding-box-for-given-a-distance-and-latitude-longitude
//
function getlatLngBounds(latLng, latRadiusInMeters, lngRadiusInMeters) {
	// console.log("latRadiusInMeters: " + latRadiusInMeters);
	// console.log("lngRadiusInMeters: " + lngRadiusInMeters);
	
	var latLngInETRS = proj4(wgs84Proj4, etrsgk24Proj4, [latLng.lng, latLng.lat]);
	// console.log("latLngInETRS: " + latLngInETRS);
	
	var minLatInETRS = latLngInETRS[1] - latRadiusInMeters;
	var maxLatInETRS = latLngInETRS[1] + latRadiusInMeters;
	var minLngInETRS = latLngInETRS[0] - lngRadiusInMeters;
	var maxLngInETRS = latLngInETRS[0] + lngRadiusInMeters;
	// console.log("minLatInETRS: " + minLatInETRS);
	// console.log("maxLatInETRS: " + maxLatInETRS);
	// console.log("minLngInETRS: " + minLngInETRS);
	// console.log("maxLngInETRS: " + maxLngInETRS);
	
	var minLatLngInWGS84 = proj4(etrsgk24Proj4, wgs84Proj4, [minLngInETRS, minLatInETRS]);
	var maxLatLngInWGS84 = proj4(etrsgk24Proj4, wgs84Proj4, [maxLngInETRS, maxLatInETRS]);
	// console.log("minLatLngInWGS84: " + minLatLngInWGS84);
	// console.log("maxLatLngInWGS84: " + maxLatLngInWGS84);

	var minLat = minLatLngInWGS84[1];
	var maxLat = maxLatLngInWGS84[1];
	var minLng = minLatLngInWGS84[0];
	var maxLng = maxLatLngInWGS84[0];
	// console.log("minLat: " + minLat);
	// console.log("maxLat: " + maxLat);
	// console.log("minLng: " + minLng);
	// console.log("maxLng: " + maxLng);
	
	console.log("dist lat: " + getDistanceFromLatLonInMeters(minLat, minLng, maxLat, minLng));
	console.log("dist lng: " + getDistanceFromLatLonInMeters(minLat, minLng, minLat, maxLng));
	
	return L.latLngBounds(L.latLng(minLat, minLng), L.latLng(maxLat, maxLng));
}

//
// From http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points
//
function getDistanceFromLatLonInMeters(lat1,lon1,lat2,lon2) {
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

// $c = false; 

// $vertices_x = array(22.333,22.222,22,444);  //latitude points of polygon
// $vertices_y = array(75.111,75.2222,76.233);   //longitude points of polygon
// $points_polygon = count($vertices_x); 
// $longitude =  23.345; //latitude of point to be checked
// $latitude =  75.123; //longitude of point to be checked

// if (is_in_polygon($points_polygon, $vertices_x, $vertices_y, $longitude, $latitude)){
    // echo "Is in polygon!"."<br>";
// }
// else { 
    // echo "Is not in polygon"; 
// }

// function is_in_polygon($points_polygon, $vertices_x, $vertices_y, $longitude_x, $latitude_y) {
    // $i = $j = $c = 0;

    // for ($i = 0, $j = $points_polygon-1; $i < $points_polygon; $j = $i++) {
        // if (($vertices_y[$i] >  $latitude_y != ($vertices_y[$j] > $latitude_y)) && ($longitude_x < ($vertices_x[$j] - $vertices_x[$i]) * ($latitude_y - $vertices_y[$i]) / ($vertices_y[$j] - $vertices_y[$i]) + $vertices_x[$i])) {
            // $c = !$c;
        // }
    // }

    // return $c;
// }

$("#delete_button").click(deleteSelectedAreas);
$("#delete_all_button").click(deleteAllAreas);

var ctrlKeyPressed = false;

$('#home').keydown(function(e) {
	if (e.ctrlKey) {
		ctrlKeyPressed = true;
	}
});

$('#home').keyup(function(e){
    if (e.keyCode == 46) { // del key
		deleteSelectedAreas();
	}
	
	if (!e.ctrlKey) {
		ctrlKeyPressed = false;
	}
}) 

function deleteSelectedAreas() {
	
	var updateStatAreas = [];
	var removedAreas = [];
	
	for(var i = 0; i < statAreas.length; i++) {
		console.log(statAreas);
		if (statAreas[i].selected) {
			map.removeLayer(statAreas[i].path);
			map.removeLayer(statAreas[i].marker);
			removedAreas.push(statAreas[i]);
		}
		else {
			updateStatAreas.push(statAreas[i]);
		}
	}
	
	geochart.removeChartSeries(removedAreas);
	
	statAreas = updateStatAreas;
	
	$("#area_edit_button").attr("disabled", "disabled");
	$("#delete_button").attr("disabled", "disabled");
	if(updateStatAreas.length == 0) {
		$("#delete_all_button").attr("disabled", "disabled");
	}
}
function deleteAllAreas() {

	for(var i = 0; i < statAreas.length; i++) {
		map.removeLayer(statAreas[i].path);
		map.removeLayer(statAreas[i].marker);
	}
	
	geochart.removeChartSeries(statAreas);
	
	statAreas = [];
	
	$("#area_edit_button").attr("disabled", "disabled");
	$("#delete_button").attr("disabled", "disabled");
	$("#delete_all_button").attr("disabled", "disabled");
}

$('#home a').click(function (e) {
  e.preventDefault();
  $(this).tab('show');
})
$('#data_selections_div a').click(function (e) {
  e.preventDefault();
  $(this).tab('show');
})
$('#about a').click(function (e) {
  e.preventDefault();
  $(this).tab('show');
})

$( document ).ready(function() {
	
	for (var i = 0; i < categories.length; i++) {
	
		selectedCategories.push({name: categories[i].name, internalName: categories[i].internalName});
	
		geochart.addCategory(categories[i].name);
	
		var $html = $("<div class='checkbox'><label><input type='checkbox' value='' checked id='checkbox_" + categories[i].internalName + "'>" +
			categories[i].name + "</label></div>");
		$('#data_selection_checkboxes').append($html);
		
		$('#checkbox_' + categories[i].internalName).on('change', { name: categories[i].name, internalName: categories[i].internalName }, function(event) {
			if(this.checked) {
				selectedCategories.push({name: event.data.name, internalName: event.data.internalName});
				geochart.addCategory(event.data.name);
				
				for (var i = 0; i < statAreas.length; i++) {
					if (statAreas[i].type == "circle") {
						getDataOnCategory(selectedCategories[selectedCategories.length-1], statAreas[i].name, statAreas[i].marker.getLatLng().lat, statAreas[i].marker.getLatLng().lng, { radius: statAreas[i].path.getRadius() });
					}
					else {
						var latLngBounds = statAreas[i].path.getBounds();
						getDataOnCategory(selectedCategories[selectedCategories.length-1], statAreas[i].name, statAreas[i].marker.getLatLng().lat, statAreas[i].marker.getLatLng().lng, { east: latLngBounds.getEast(), south: latLngBounds.getSouth(), west: latLngBounds.getWest(), north: latLngBounds.getNorth() });
					}
				}
			}
			else {
				selectedCategories.splice( $.inArray(event.data.name, selectedCategories.name), 1 );
				geochart.removeCategory(event.data.name);
			}
		});
	}
});

$('#area_edit_button').click(function(e) {
	for (var i = 0; i < statAreas.length; i++) {
		if (statAreas[i].selected) {
			if (statAreas[i].type == "circle") {
				$('#area_edit_circle_size_div').removeClass('hidden');
				$('#area_edit_rectangle_size_div').removeClass('show');
				$('#area_edit_rectangle_size_div').addClass('hidden');
				$('#area_edit_circle_size_div').addClass('show');
				$('#area_edit_name').val(statAreas[i].name);
				$('#area_edit_radius').val(statAreas[i].path.getRadius());
				break;
			}
			else {
				$('#area_edit_circle_size_div').removeClass('show');
				$('#area_edit_rectangle_size_div').removeClass('hidden');
				$('#area_edit_circle_size_div').addClass('hidden');
				$('#area_edit_rectangle_size_div').addClass('show');
				$('#area_edit_name').val(statAreas[i].name);
				$('#area_edit_width').val(statAreas[i].lngRadius * 2);
				$('#area_edit_height').val(statAreas[i].latRadius * 2);
			}
		}
	}
});
 
 $('#area_edit_save_button').click(function(e) {
 
	for (var i = 0; i < statAreas.length; i++) {
		if (statAreas[i].selected) {
		
			var newName = $('#area_edit_name').val();
			if (statAreas[i].name != newName) {
				geochart.renameChartSeries(statAreas[i].name, newName);
				statAreas[i].name = newName;
				statAreas[i].marker.setPopupContent(newName);
			}
			
			if (statAreas[i].type == "circle") {
				var newRadius = parseInt($('#area_edit_radius').val());
				if (!isNaN(newRadius) && newRadius > 0 && newRadius != statAreas[i].path.getRadius()) {
					statAreas[i].path.setRadius(newRadius);
					updateDataOnArea(statAreas[i].path.getLatLng().lat, statAreas[i].path.getLatLng().lng, statAreas[i], { radius: statAreas[i].path.getRadius() });
				}
				else {
					// TODO
				}
			}
			else { // rectangle
				var newWidth =  parseInt($('#area_edit_width').val());
				var newHeight =  parseInt($('#area_edit_height').val());
				if (!isNaN(newWidth) && newWidth > 0 &&
					!isNaN(newHeight) && newHeight > 0 &&
					(newWidth != statAreas[i].lngRadius * 2 || newHeight != statAreas[i].latRadius * 2)) {
					statAreas[i].lngRadius = newWidth / 2;
					statAreas[i].latRadius = newHeight / 2;
					var latLngBounds = getlatLngBounds(statAreas[i].marker.getLatLng(), statAreas[i].latRadius, statAreas[i].lngRadius);
					console.log("marker.getLatLng(): " + statAreas[i].marker.getLatLng());
					console.log("latLngBounds: " + latLngBounds.getSouthWest() + ', ' + latLngBounds.getNorthEast());
					statAreas[i].path.setBounds(latLngBounds);
					updateDataOnArea(statAreas[i].marker.getLatLng().lat, statAreas[i].marker.getLatLng().lng, statAreas[i], { east: latLngBounds.getEast(), south: latLngBounds.getSouth(), west: latLngBounds.getWest(), north: latLngBounds.getNorth() });
				}
				else {
					// TODO
				}
			}
			break;
		}
	}
});
 
$('#area_rectangle_button').click(function(e) {
	if (!area_rectangle_tool_selected) {
		area_rectangle_tool_selected = true;
		area_circle_tool_selected = false;
		$('#area_rectangle_button_img').attr("src", 'images/primary_box_button_active_rectangle.png');
		$('#area_circle_button_img').attr("src", 'images/primary_box_button_circle.png');
	}
});
$('#area_circle_button').click(function(e) {
	if (!area_circle_tool_selected) {
		area_rectangle_tool_selected = false;
		area_circle_tool_selected = true;
		$('#area_rectangle_button_img').attr("src", 'images/primary_box_button_rectangle.png');
		$('#area_circle_button_img').attr("src", 'images/primary_box_button_active_circle.png');
	}
});

function okffiGeocoding(text, callOnResponse) {
	
	console.log(text);

	if (text.length < 3) {
		callOnResponse([]);
	} else {
		$.getJSON('http://api.okf.fi/gis/1/autocomplete.json?address=' + encodeURI(text) + '&language=fin', function(response) {
		
			var descriptions = [];
		
			for( var i = 0; i < response.predictions.length; i++) {
				for (var j = 0; j < response.predictions[i].address_components.length; j++) {
					if (response.predictions[i].address_components[j].types[0] == 'administrative_area_level_3') {
						if (response.predictions[i].address_components[j].long_name == 'Tampere') {
							descriptions.push(response.predictions[i].description.replace(/, /g, ',').replace(/ /g, '+'));
						}
						break;
					}
				}
			}
			
			var expectedResponseCount = descriptions.length;
			var responses = [];
			
			if (expectedResponseCount > 0) {
				for( var i = 0; i < descriptions.length; i++) {
					$.getJSON('http://api.okf.fi/gis/1/geocode.json?address=' + encodeURI(descriptions[i]) + '&lat=&lng=&language=fin', function(response) {
						//console.log(response);
						responses.push(response);
						if (responses.length == expectedResponseCount) {
							callOnResponse(responses);
						}
					});
				}
			}
			else {
				callOnResponse([]);
			}
		});
	}
}

function filterGeocodingResult(rawJson) {

	console.log(rawJson);

	var json = {},
	key, loc, disp = [];

	for(var i = 0; i < rawJson.length; i++) {
		if (rawJson[i].status == "OK") {
			for (var j = 0; j < rawJson[i].results.length; j++) {
				for (var k = 0; k < rawJson[i].results[j].address_components.length; k++) {
					if (rawJson[i].results[j].address_components[k].types[0] == 'administrative_area_level_3') {
						if (rawJson[i].results[j].address_components[k].long_name == 'Tampere') {
							key = rawJson[i].results[j].formatted_address;
							loc = L.latLng( rawJson[i].results[j].geometry.location.lat, rawJson[i].results[j].geometry.location.lng );
							json[ key ] = loc;	//key,value format
						}
						break;
					}
				}
			}
		}
	}

	return json;
}

map.addControl( new L.Control.Search({
	callData: okffiGeocoding,
	filterJSON: filterGeocodingResult,
	markerLocation: true,
	autoType: false,
	autoCollapse: true,
	minLength: 2,
	zoom: 10,
	text: "Osoite...",
	textCancel: "Peru",
	textErr: "Osoitetta ei löytynyt",
	zoom: {
		animate: true		
	},
	circleLocation: false
}) );


// var geocoder = new google.maps.Geocoder();

// function googleGeocoding(text, callResponse)
// {
	// geocoder.geocode({address: text, location: new google.maps.LatLng(61.5, 23.766667), bounds: new google.maps.LatLngBounds(new google.maps.LatLng(61.222, 22.795), new google.maps.LatLng(61.762, 24.719)), region: "fi"}, callResponse);
// }

// function filterJSONCall(rawjson)
// {
	// var json = {},
		// key, loc, disp = [];

	// for(var i in rawjson)
	// {
		// key = rawjson[i].formatted_address;
		
		// loc = L.latLng( rawjson[i].geometry.location.lat(), rawjson[i].geometry.location.lng() );
		
		// json[ key ]= loc;	//key,value format
	// }

	// return json;
// }

// map.addControl( new L.Control.Search({
	// callData: googleGeocoding,
	// filterJSON: filterJSONCall,
	// markerLocation: true,
	// autoType: false,
	// autoCollapse: true,
	// minLength: 2,
	// zoom: 10
// }) );
