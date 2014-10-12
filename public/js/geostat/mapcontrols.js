
var INITIAL_AREA_RADIUS = 500;

var area_circle_tool_selected = true;
var area_rectangle_tool_selected = false;

var baseMaps = {
	"Perinteinen, OpenStreetMap": osmLayer,
	"Opaskartta, Tampere": treGuideLayer,
	"Kantakartta, Tampere": treBaseLayer,
	"Ilmakuva, MML / kartat.kapsi.fi": mmlOrtoLayer,
	"Katu, MapBox": mapBoxLayer,
	"Katu, MapQuest": mapQuestLayer,
	"Pyöräily, Thunderforest": osmCycleLayer,
	// "Peruskartta, Maanmittauslaitos": mmlPerusLayer,
	// "Taustakartta, Maanmittauslaitos": mmlTaustaLayer,
	"Mustavalko, Stamen": stamenTonerLayer
}
L.control.layers(baseMaps).addTo(map);

map.on('baselayerchange', function(event) {
	// console.log('baselayerchange');
	//console.log(event.layer);
	
	handleHistory('basemap', event.layer);
	
	if (event.layer.options.maxZoom < map.getZoom()) {
		map.setZoom(event.layer.options.maxZoom);
	}
	else if (event.layer.options.minZoom > map.getZoom()) {
		map.setZoom(event.layer.options.minZoom);
	}
});

var featureInfoControl = L.control();
featureInfoControl.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'feature_info'); // create a div with a class "info"
    this.update();
    return this._div;
}
featureInfoControl.update = function (text) {
    this._div.innerHTML = (text ? text : 'Ei valittua kohdetta');
};
featureInfoControl.addTo(map);

L.control.scale({
	imperial: false
}).addTo(map);

L.popup()
    .setLatLng([INITIAL_LAT, INITIAL_LON])
    .setContent("Klikkaa karttaa lisätäksesi alueen.")
    .openOn(map);

function onMapClick(e) {

	var found = false;
	
	//console.log("ctrlKeyPressed: " + ctrlKeyPressed);
	
	for(var i = 0; i < statAreas.length; i++) {
		if (statAreas[i].isLatLngInsidePath(e.latlng)) {
			found = true;
			statAreas[i].select();
		}
		else {
			if (!ctrlKeyPressed && statAreas[i].selected) {
				statAreas[i].unselect();
			}
		}
	}
	
	if (!found) {
		var statArea = new StatArea(
			area_circle_tool_selected ? "circle" : "rectangle",
			e.latlng,
			true,
			"Alue " + (statAreaCount+1), INITIAL_AREA_RADIUS, map);

		statArea.getDataOnArea();
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
});

function deleteSelectedAreas() {
	
	var updatedStatAreas = [];
	var removedAreas = [];
	
	for(var i = 0; i < statAreas.length; i++) {
		console.log(statAreas);
		if (statAreas[i].selected) {
			statAreas[i].remove(map);
			removedAreas.push(statAreas[i]);
		}
		else {
			updatedStatAreas.push(statAreas[i]);
		}
	}
	
	geochart.removeChartSeries(removedAreas);
	
	statAreas = updatedStatAreas;
	
	$("#area_edit_button").attr("disabled", "disabled");
	$("#delete_button").attr("disabled", "disabled");
	if(updatedStatAreas.length == 0) {
		$("#delete_all_button").attr("disabled", "disabled");
	}
}

function deleteAllAreas() {

	for(var i = 0; i < statAreas.length; i++) {
		statAreas[i].remove(map);
	}
	
	geochart.removeChartSeries(statAreas);
	
	statAreas = [];
	
	$("#area_edit_button").attr("disabled", "disabled");
	$("#delete_button").attr("disabled", "disabled");
	$("#delete_all_button").attr("disabled", "disabled");
}

$(function(){
	$('#color_picker_div').colorpicker();
});

$('#area_edit_button').click(function(e) {
	for (var i = 0; i < statAreas.length; i++) {
		if (statAreas[i].selected) {
			$('#area_edit_name').val(statAreas[i].name);
			//$('#area_edit_color').val(statAreas[i].color);
			$('#color_picker_div').colorpicker('setValue', statAreas[i].color);
			if (statAreas[i].type == "circle") {
				$('#area_edit_circle_size_div').removeClass('hidden');
				$('#area_edit_rectangle_size_div').removeClass('show');
				$('#area_edit_rectangle_size_div').addClass('hidden');
				$('#area_edit_circle_size_div').addClass('show');
				$('#area_edit_radius').val(statAreas[i].getRadius());
				break;
			}
			else {
				$('#area_edit_circle_size_div').removeClass('show');
				$('#area_edit_rectangle_size_div').removeClass('hidden');
				$('#area_edit_circle_size_div').addClass('hidden');
				$('#area_edit_rectangle_size_div').addClass('show');
				$('#area_edit_width').val(statAreas[i].getWidth());
				$('#area_edit_height').val(statAreas[i].getHeight());
				break;
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
				statAreas[i].rename(newName);
			}
			var colorValue = $('#area_edit_color').val();
			if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(colorValue) && colorValue != statAreas[i].color) {
				geochart.recolorSeries(statAreas[i].name, colorValue);
				statAreas[i].changeColor(colorValue);
			}
			
			if (statAreas[i].type == "circle") {
				var newRadius = parseInt($('#area_edit_radius').val());
				if (!isNaN(newRadius) && newRadius > 0 && !statAreas[i].isSameRadius()) {
					statAreas[i].setRadius(newRadius);
					statAreas[i].updateDataOnArea();
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
					!statAreas[i].isSameSize(newWidth, newHeight)) {
					statAreas[i].setSize(newWidth, newHeight);
					statAreas[i].updateDataOnArea();
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

var locateMeControl = L.Control.extend({
	options: {
		position: 'topleft'
	},
	onAdd: function(map) {
		
		var container = L.DomUtil.create('div', 'map_box_control');
		var button = L.DomUtil.create('a', 'map_box_control_locate_button', container);
		button.href = '#';
		button.title = 'Keskitä kartta sijaintiini';
		L.DomEvent
			.on(button, 'click', L.DomEvent.stop, this)
			.on(button, 'click', geoLocate, this);
		//$(container).append($('<span>hello</span>'));
		return container;
	}
});
map.addControl(new locateMeControl());

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

$("#geolocate_button").click(geoLocate);

//map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);
