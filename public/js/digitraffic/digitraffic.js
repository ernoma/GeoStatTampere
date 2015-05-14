
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

$(document).on('pageshow','[data-role=page]', function(){
    console.log('PAGECREATE');

    map.invalidateSize();

    $.getJSON("/roadweather.json", { radius: INITIAL_RADIUS, lat: INITIAL_LAT, lng: INITIAL_LNG }, function(response) {
	console.log(response);

	for (var i = 0; i < popups.length; i++) {
	    map.removeLayer(popups[i]);
	}

	popups = [];

	for (var i = 0; i < response.length; i++) {

	    var timestamp = moment(response[i].measurement_time.localtime[0]);
	    var time_string = timestamp.format('HH:mm');

	    var popup = L.popup( {autoPan: false, closeOnClick: false, closeButton: false} ).setLatLng([response[i].lat, response[i].lng])
		.setContent("Kello " + time_string + "<br>" +
			    "Ilma: " + response[i].air_temperature + "&deg;C<br>" +
			    "Tie: " + response[i].road_temperature1 + "&deg;C");
	    map.addLayer(popup);
	    popups.push(popup);
	}

        //parsed_response = JSON.parse(response);
        //console.log(parsed_response);

        //nextId++;

        //var content = "<div data-role='collapsible' id='set" + nextId + "'><h3>Road weather</h3>";

        

        //content += "</div>";

	//$( "#result_set" ).append( content ).collapsibleset( "refresh" );
    });
});
