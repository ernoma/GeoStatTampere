
var INITIAL_LAT = 61.5016
var INITIAL_LON = 23.7737

var INITIAL_AREA_RADIUS = 500;

var center_icon = L.icon({
  iconUrl: '/images/center_icon.png',
  iconSize: [20, 20],
  iconAnchor: [9, 9]
})

var parking_icon = L.icon({
  iconUrl: '/images/parking_garage_22x22.png',
  iconSize: [22, 22],
  iconAnchor: [10, 10]
})

var area_circle_tool_selected = true;
var area_rectangle_tool_selected = false;

var statAreas = []

var statAreaColors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', 
   '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'];
   
var statAreaCount = 0;

var categories = [
	{
		name: "Pysäköintikohteet",
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
})
var osmCycleLayer = L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Maps &copy; <a href="http://thunderforest.com/">Thunderforest</a>',
    maxZoom: 18
})
var mapBoxLayer = L.tileLayer('http://{s}.tiles.mapbox.com/v3/ernoma.i04d787e/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18
})
var mapQuestLayer = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg', {
	subdomains: '1234',
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">',
    maxZoom: 18
})
var stamenTonerLayer = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.jpg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>. Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>',
    maxZoom: 18
})
var stamenWatercolorLayer = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>. Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>',
    maxZoom: 18
})
var mmlPerusLayer = L.tileLayer('http://tiles.kartat.kapsi.fi/peruskartta/{z}/{x}/{y}.jpg', {
    attribution: 'Sisältää Maanmittauslaitoksen peruskartta-aineistoa, <a href="http://www.maanmittauslaitos.fi/avoindata_lisenssi_versio1_20120501">lisenssi</a>, TMS: <a href="http://kartat.kapsi.fi/">kartat.kapsi.fi</a>',
    maxZoom: 18
})
var mmlTaustaLayer = L.tileLayer('http://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg', {
    attribution: 'Sisältää Maanmittauslaitoksen taustakartta-aineistoa, <a href="http://www.maanmittauslaitos.fi/avoindata_lisenssi_versio1_20120501">lisenssi</a>, TMS: <a href="http://kartat.kapsi.fi/">kartat.kapsi.fi</a>',
    maxZoom: 18
})
var mmlOrtoLayer = L.tileLayer('http://tiles.kartat.kapsi.fi/ortokuva/{z}/{x}/{y}.jpg', {
    attribution: 'Sisältää Maanmittauslaitoksen ortoilmakuva-aineistoa, <a href="http://www.maanmittauslaitos.fi/avoindata_lisenssi_versio1_20120501">lisenssi</a>, TMS: <a href="http://kartat.kapsi.fi/">kartat.kapsi.fi</a>',
    maxZoom: 18,
	minZoom: 13
})

var map = L.map('map_canvas', {layers: [osmLayer]}).setView([INITIAL_LAT, INITIAL_LON], 13)

map.on('zoomend', function(e) {
	console.log("zoom: " + map.getZoom());
})

var baseMaps = {
	"Perinteinen, OpenStreetMap": osmLayer,
	"Katu, MapBox": mapBoxLayer,
	"Katu, MapQuest": mapQuestLayer,
	"Pyöräily, Thunderforest": osmCycleLayer,
	"Ilmakuva, Maanmittauslaitos": mmlOrtoLayer,
	"Peruskartta, Maanmittauslaitos": mmlPerusLayer,
	"Taustakartta, Maanmittauslaitos": mmlTaustaLayer,
	"Mustavalko, Stamen": stamenTonerLayer,
	"Vesiväri, Stamen": stamenWatercolorLayer
}
L.control.layers(baseMaps).addTo(map)

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
				return L.marker(latlng, { icon: parking_icon })
			}
		}).addTo(map)
}

function getDataOnArea(radius, lat, lon, statArea) {

	var valueArray = Array.apply(null, new Array(selectedCategories.length)).map(Number.prototype.valueOf,0); // array of zeros
	
	var series = geochart.addChartSeries(valueArray, statArea.name);

	for (var i = 0; i < selectedCategories.length; i++) {
		getDataOnCategory(selectedCategories[i], series.name, radius, lat, lon);
	}
}

function updateDataOnArea(radius, lat, lon, statArea) {
	
	for (var i = 0; i < selectedCategories.length; i++) {
		getDataOnCategory(selectedCategories[i], statArea.name, radius, lat, lon);
	}
}

function getDataOnCategory(category, seriesName, radius, lat, lon) {
	
	var n = Math.floor((Math.random() * 100) + 1);
	
	console.log("Alue: " + seriesName + ", kategoria: " + category.name + ", count: " + n);
	
	geochart.updateSeriesCategory(category.name, seriesName, n);
	
	// $.getJSON("/" +  category.internalName + ".json", { radius: radius, lat: lat, lon: lon }, function(response) {
		// parsed_response = JSON.parse(response)
		// console.log("N of features: " + parsed_response.totalFeatures)
				
		// geochart.updateSeriesCategory(category.name, series.name, parsed_response.totalFeatures);
	// });
}


//$(document).ready(getDataOnArea(500, INITIAL_LAT, INITIAL_LON ))

function geoLocate() {
	map.locate({setView: true, maxZoom: 16, enableHighAccuracy: true})
}

// function onLocationFound(e) {
    // var radius = e.accuracy / 2;

    // L.marker(e.latlng).addTo(map)
        // .bindPopup("You are within " + radius + " meters from this point").openPopup();

    // L.circle(e.latlng, radius).addTo(map);
// }

function onLocationError(e) {
    alert(e.message)
	// TODO better message
}

$("#geolocate_button").click(geoLocate)

//map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError)

function onMapClick(e) {

	var found = false;
	
	console.log("ctrlKeyPressed: " + ctrlKeyPressed);
	
	for(var i = 0; i < statAreas.length; i++) {
		if (is_inside_circle(e.latlng, statAreas[i].path)) {
			found = true
			// TODO
			
			statAreas[i].path.setStyle({
				weight: 5
			})
			statAreas[i].selected = true
		
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
	
	if (!found) {
		var circle = L.circle(e.latlng, INITIAL_AREA_RADIUS, {
			color: statAreaColors[statAreaCount % statAreaColors.length],
			weight: 5,
			fillColor: statAreaColors[statAreaCount % statAreaColors.length],
			fillOpacity: 0.5
		}).addTo(map)

		statAreaCount++;
		
		var marker = L.marker(e.latlng, { icon: center_icon, draggable:'true' }).addTo(map)
		//marker.bindPopup("leveys: " + INITIAL_LAT + ", pituus: " + INITIAL_LON);
		marker.bindPopup("Alue " + statAreaCount);
		marker.on('drag', function(event){
			var position = event.target.getLatLng()
			circle.setLatLng(position)
		})
		
		var statArea = {
			path: circle,
			marker: marker,
			selected: true,
			name: "Alue " + statAreaCount
		}
		
		statAreas.push(statArea)
	
		marker.on('click', function(event){
			for(var i = 0; i < statAreas.length; i++) {
				if (statAreas[i].marker == this) {
					found = true
					
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
			var position = event.target.getLatLng()
			//marker.setPopupContent("leveys: " + position.lat + ", pituus: " + position.lng)
			circle.setLatLng(position)
			
			for(var i = 0; i < statAreas.length; i++) {
				if (statAreas[i].marker == this) {
					found = true
					
					statAreas[i].path.setStyle({
						weight: 5
					})
					statAreas[i].selected = true;
					
					updateDataOnArea(statAreas[i].path.getRadius(), e.latlng.lat, e.latlng.lng, statArea);
					
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
		
		getDataOnArea(statArea.path.getRadius(), e.latlng.lat, e.latlng.lng, statArea)
	}
	
	checkSelectedAreas();
	$("#delete_button").removeAttr("disabled")
	$("#delete_all_button").removeAttr("disabled")
}

function checkSelectedAreas() {
	var selectedCount = 0;
	
	for(var i = 0; i < statAreas.length; i++) {
		if (statAreas[i].selected == true) {
			selectedCount++;
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

	var lat1 = latlng.lat
	var lat2 = circle.getLatLng().lat
	var lng1 = latlng.lng
	var lng2 = circle.getLatLng().lng

	var dist = getDistanceFromLatLonInMeters(lat1, lng1, lat2, lng2)
	
	console.log(dist)
	console.log(circle.getRadius())
	
	return dist <= circle.getRadius()
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
  return deg * (Math.PI/180)
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

$("#delete_button").click(deleteSelectedAreas)
$("#delete_all_button").click(deleteAllAreas)

var ctrlKeyPressed = false;

$('html').keydown(function(e) {
	if (e.ctrlKey) {
		ctrlKeyPressed = true;
	}
});

$('html').keyup(function(e){
    if (e.keyCode == 46) { // del key
		deleteSelectedAreas();
	}
	
	if (!e.ctrlKey) {
		ctrlKeyPressed = false;
	}
}) 

function deleteSelectedAreas() {
	
	var updateStatAreas = []
	var removedAreas = []
	
	for(var i = 0; i < statAreas.length; i++) {
		console.log(statAreas);
		if (statAreas[i].selected) {
			map.removeLayer(statAreas[i].path)
			map.removeLayer(statAreas[i].marker)
			removedAreas.push(statAreas[i])
		}
		else {
			updateStatAreas.push(statAreas[i])
		}
	}
	
	geochart.removeChartSeries(removedAreas);
	
	statAreas = updateStatAreas
	
	$("#area_edit_button").attr("disabled", "disabled")
	$("#delete_button").attr("disabled", "disabled")
	if(updateStatAreas.length == 0) {
		$("#delete_all_button").attr("disabled", "disabled")
	}
}
function deleteAllAreas() {

	for(var i = 0; i < statAreas.length; i++) {
		map.removeLayer(statAreas[i].path)
		map.removeLayer(statAreas[i].marker)
	}
	
	geochart.removeChartSeries(statAreas);
	
	statAreas = []
	
	$("#area_edit_button").attr("disabled", "disabled")
	$("#delete_button").attr("disabled", "disabled")
	$("#delete_all_button").attr("disabled", "disabled")
}

$('#home a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})
$('#data_selections_div a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
})
$('#about a').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
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
					getDataOnCategory(selectedCategories[selectedCategories.length-1], statAreas[i].name, statAreas[i].path.getRadius(), statAreas[i].marker.getLatLng().lat, statAreas[i].marker.getLatLng().lng);
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
			$('#area_edit_name').val(statAreas[i].name);
			$('#area_edit_radius').val(statAreas[i].path.getRadius());
			break;
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
			
			var newRadius = $('#area_edit_radius').val();
			if (!isNaN(newRadius) && newRadius > 0 && newRadius != statAreas[i].path.getRadius()) {
				statAreas[i].path.setRadius(newRadius);
				updateDataOnArea(statAreas[i].path.getRadius(), statAreas[i].path.getLatLng().lat, statAreas[i].path.getLatLng().lng, statArea);
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

