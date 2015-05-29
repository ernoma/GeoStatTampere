
var INITIAL_LAT = 61.5;
var INITIAL_LNG = 23.766667;
var INITIAL_RADIUS = 60000; // in meters
var INITIAL_ZOOM = 11;


var osmLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a><br>Weather data &copy; Liikennevirasto <a href="http://www.digitraffic.fi/">Digitraffic</a>, <a href="http://creativecommons.org/licenses/by/4.0/deed.fi">CC-BY-4.0</a>',
    maxZoom: 19
});

var map = L.map('map_canvas', { center: [INITIAL_LAT, INITIAL_LNG], zoom: INITIAL_ZOOM });
osmLayer.addTo(map);

var popups = [];

var socket = io();

socket.on('weather', function(msg) {
    data = JSON.parse(msg);
    console.log(data);
    updateWeatherData(data);
});

$(document).on('pageshow','[data-role=page]', function(){
    console.log('PAGECREATE');

    map.invalidateSize();

    $.getJSON("/roadweather.json", { radius: INITIAL_RADIUS, lat: INITIAL_LAT, lng: INITIAL_LNG }, function(response) {
	console.log(response);
	
	for (var i = 0; i < response.traffic_station_locations.length; i++) {
	    var marker = L.marker([response.traffic_station_locations[i].lat, response.traffic_station_locations[i].lng]);
	    marker.addTo(map);
	}

	updateWeatherData(response.road_weather_data);
    });
});


function updateWeatherData(data) {
    for (var i = 0; i < popups.length; i++) {
	map.removeLayer(popups[i]);
    }
    
    popups = [];
    
    for (var i = 0; i < data.length; i++) {

	var timestamp = moment(data[i].measurement_time.localtime[0]);
	var time_string = timestamp.format('HH:mm');
	
	var popup = L.popup( {autoPan: false, closeOnClick: false, closeButton: false} ).setLatLng([data[i].lat, data[i].lng])
	    .setContent("Kello " + time_string + "<br>" +
			"Ilma: " + data[i].air_temperature + "&deg;C<br>" +
			"Tie: " + data[i].road_temperature1 + "&deg;C");
	map.addLayer(popup);
	popups.push(popup);
    }
}
