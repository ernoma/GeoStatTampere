
var areaTypes = [
	{type: "K",
	color: "#00FF00",
	legend: "Kadunvarren pys&auml;k&ouml;intialue"}, // 
	{type: "E",
	color: "#00FFFF",
	legend: "Erillinen pys&auml;k&ouml;intialue"}, // , magenta
	{type: "I",
	color: "#0000FF",
	legend: "Inva-pys&auml;k&ouml;intialue"}, // 
	{type: "L",
	color: "#FFFF00",
	legend: "Linja-autojen pys&auml;k&ouml;intialue"}, // , keltainen
	{type: "T",
	color: "#FF00FF",
	legend: "Taksiasema"}, // , violetti
	{type: "M",
	color: "#FF99CC",
	legend: "Moottoripy&ouml;rien pys&auml;k&ouml;intialue"}, // , marjapuuro
	{type: "P",
	color: "#00DCFF",
	legend: "Yleinen pys&auml;k&ouml;intilaitos"} // , sinertävä valtameri
]

var directionTypes = [
	{type: "S",
	legend: "Paikat kadun suuntaisesti"},
	{type: "V",
	legend: "Paikat katuun n&auml;hden viistossa"},
	{type: "K",
	legend: "Paikat katuun n&auml;hden kohtisuorassa"}
]

var restrictionTypes = [
	{type: "M",
	legend: "Maksullinen pys&auml;k&ouml;inti"},
	{type: "K",
	legend: "Kiekkopys&auml;k&ouml;inti"},
	{type: "L",
	legend: "Pys&auml;k&ouml;intikielto osan vuorokaudesta"}
]

var map = null;

var mapShapes = {
	K: [],
	E: [],
	I: [],
	L: [],
	T: [],
	M: [],
	P: []
}

$(document).ready(function(){
	for (var i = 0; i < areaTypes.length-1; i++) {
		var $colorBox = $("<div class='ui-block-a' style='width:15%'><div class='legendColorBox' style='background-color:" + areaTypes[i].color + ";'/></div>");
		var $legend = $("<div class='ui-block-b' style='width:60%;'><span class='legendAreaSpan'>" + areaTypes[i].legend + "</span></div>");
		var $flipSwitch = $("<form class='legendAreaTypeForm'><label for='flip-checkbox-" + areaTypes[i].type + "' class='ui-hidden-accessible'>Flip toggle switch:</label><input class='legendAreaTypeSwitch' data-role='flipswitch' name='flip-checkbox-" + areaTypes[i].type + "' id='flip-checkbox-" + areaTypes[i].type + "' data-on-text='Kartalla' data-off-text='Piilotettu' data-wrapper-class='custom-size-flipswitch' checked='' type='checkbox' onchange='changeAreaTypeVisibility(\"" + areaTypes[i].type + "\")'></form>");
		var $areaTypesDiv = $("<div class='ui-grid-a'/>");
		$areaTypesDiv.append($colorBox);
		$areaTypesDiv.append($legend);
		$("#legend_panel").append($areaTypesDiv);
		$("#legend_panel").append($flipSwitch);
	}
	
	
	var $areaTypeDiv = $("<div class='ui-block-a' style='width:15%'><div class='legendImageBox'><img src='images/parking_20x20.png'></div></div><div class='ui-block-b' style='width:60%;'><span class='legendAreaSpan'>" + areaTypes[areaTypes.length-1].legend + "</span></div>");
	var $flipSwitch = $("<form class='legendAreaTypeForm'><label for='flip-checkbox-" + areaTypes[areaTypes.length-1].type + "' class='ui-hidden-accessible'>Flip toggle switch:</label><input class='legendAreaTypeSwitch' data-role='flipswitch' name='flip-checkbox-" + areaTypes[areaTypes.length-1].type + "' id='flip-checkbox-" + areaTypes[areaTypes.length-1].type + "' data-on-text='Kartalla' data-off-text='Piilotettu' data-wrapper-class='custom-size-flipswitch' checked='' type='checkbox' onchange='changeAreaTypeVisibility(\"" + areaTypes[areaTypes.length-1].type + "\")'></form>");
	var $areaTypesDiv = $("<div class='ui-grid-a'/>");
	$areaTypesDiv.append($areaTypeDiv);
	$("#legend_panel").append($areaTypesDiv);
	$("#legend_panel").append($flipSwitch);
	
	$( "#legend_panel" ).trigger( "create" );
	//$( "#legend_panel" ).trigger( "updatelayout" );
});

function initialize() {
	var mapOptions = {
	  center: new google.maps.LatLng(61.5016, 23.7737),
	  zoom: 13
	};
	map = new google.maps.Map(document.getElementById("map-canvas"),
		mapOptions);
	
	//console.log("parkingWFSFeatures.length:" + parkingWFSFeatures.length);
	//console.log(parkingWFSFeatures);
	
	parkingWFSFeatures.forEach(function(feature) {
	
		var infoWindowString = createInfoWindowString(feature);
		
		var infoWindow = new google.maps.InfoWindow({
			content: infoWindowString
		});
	
		if (feature.properties.KOHDETYYPPI != "P") { // Yleinen pysäköintilaitos sisältää vain yhden koordinaattiparin.
	
			var slotCoords = [];
			for (i = 0; i < feature.geometry.coordinates[0].length; i++) {
				var latLng = new google.maps.LatLng(feature.geometry.coordinates[0][i][1], feature.geometry.coordinates[0][i][0]);
				slotCoords.push(latLng);
			}
			
			areaTypeColor = "#FFFFFF"
			
			for (i = 0; i < areaTypes.length; i++) {
				if (areaTypes[i].type == feature.properties.KOHDETYYPPI) {
					areaTypeColor = areaTypes[i].color;
				}
			}
			
			var parkingSlot = new google.maps.Polygon({
				map: map,
				paths: slotCoords,
				strokeColor: '#FF0000',
				strokeOpacity: 0.8,
				strokeWeight: 1,
				fillColor: areaTypeColor,
				fillOpacity: 1
			  });
		
			if (mapShapes[feature.properties.KOHDETYYPPI] != undefined) {
				mapShapes[feature.properties.KOHDETYYPPI].push(parkingSlot);
			}
		
			var bounds = new google.maps.LatLngBounds();
			for (i = 0; i < slotCoords.length; i++) {
				bounds.extend(slotCoords[i]);
			}
			//console.log(slotCoords[0]);
			//console.log(bounds.getCenter());
			infoWindow.setOptions({position: bounds.getCenter()});
			google.maps.event.addListener(parkingSlot, 'click', function() {
				infoWindow.open(map);
			});
		}
		else { // Yleinen pysäköintilaitos
		
			//console.log(feature);
			//console.log("" + feature.geometry.coordinates[1] + "," + feature.geometry.coordinates[0]);
			var position = new google.maps.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
			
			var image = {
				url: 'images/parking_20x20.png',
				size: new google.maps.Size(20, 20)
			};
			
			var marker = new google.maps.Marker({
				map: map,
				title: 'Yleinen pys&auml;k&ouml;intilaitos',
				position: position,
				zIndex: 9,
				icon: image
			});
			
			mapShapes[feature.properties.KOHDETYYPPI].push(marker);
			
			google.maps.event.addListener(marker, 'click', function() {
				infoWindow.open(map, marker);
			});

		}
		
		//console.log(feature.properties.KOHDETYYPPI);
		//console.log("" + feature.geometry.coordinates[0][0][0] + "," + feature.geometry.coordinates[0][0][1]);
	});
}
 
google.maps.event.addDomListener(window, 'load', initialize);

function createInfoWindowString(feature) {
	var contentString = '</p><p>Alueen numero: ' + feature.properties.ALUEEN_NUMERO + '</p>'
		
	contentString += '<p>Kohdetyyppi: ' //+ feature.properties.KOHDETYYPPI
	for (i = 0; i < areaTypes.length; i++) {
		if (areaTypes[i].type == feature.properties.KOHDETYYPPI) {
			contentString += areaTypes[i].legend;
		}
	}

	if (feature.properties.PAIKKATYYPPI != null) {
		contentString += '<p>Paikkatyyppi: ' //+ feature.properties.PAIKKATYYPPI
		for (i = 0; i < directionTypes.length; i++) {
			if (directionTypes[i].type == feature.properties.PAIKKATYYPPI) {
				contentString += directionTypes[i].legend;
			}
		}
	}

	if (feature.properties.PAIKKATYYPPI != null && feature.properties.PAIKKATYYPPI == 'S') {
		contentString += '</p><p>Paikkojen arvioitu lukum&auml;&auml;r&auml; (kadun suuntaisissa paikoissa pituus 6 m/henk.auto): ' + feature.properties.PAIKKOJEN_LUKUMAARA + '</p>'
	}
	else {
		contentString += '</p><p>Paikkojen lukum&auml;&auml;r&auml;: ' + feature.properties.PAIKKOJEN_LUKUMAARA + '</p>'
	}
		
	if (feature.properties.RAJOITUSTYYPPI != null) { // Ainakaan takseilla ei ole
		contentString += '<p>Rajoitustyyppi alueen arkip&auml;iv&auml;n rajoituksen mukaan: ' //+ feature.properties.RAJOITUSTYYPPI
		for (i = 0; i < restrictionTypes.length; i++) {
			if (restrictionTypes[i].type == feature.properties.RAJOITUSTYYPPI) {
				contentString += restrictionTypes[i].legend;
			}
		}
	}
	
	if (feature.properties.YOPYSAKOINTIKIELTO == 1) {
		contentString += '<p>Y&ouml;pys&auml;k&ouml;intikielto (tod. näk. vain talvella)</p>'
	}
	else {
		//contentString += '<p>Ei y&ouml;pys&auml;k&ouml;intikieltoa</p>'
	}
	
	if (feature.properties.HINTA > 0) {
		contentString += '<p>Hinta: ' + feature.properties.HINTA + ' &euro;/tunti</p>'
	}
	
	if (feature.properties.MAX_AIKA > 0) { 
		contentString += '<p>Pisin sallittu pys&auml;k&ouml;intiaika tunneissa: ' + feature.properties.MAX_AIKA + '</p>'
	}

	if (feature.properties.RAJ_AIKA_ALKAA_ARK > 0) {
		contentString += '<p>Rajoitusaika arkisin (tunneissa): ' + feature.properties.RAJ_AIKA_ALKAA_ARK + '-' + feature.properties.RAJ_AIKA_PAATTYY_ARK + '</p>'
	}
	if (feature.properties.RAJ_AIKA_ALKAA_LA > 0) {
		contentString += '<p>Rajoitusaika launtaisin (tunneissa): ' + feature.properties.RAJ_AIKA_ALKAA_LA + '-' + feature.properties.RAJ_AIKA_PAATTYY_LA + '</p>'
	}
	if (feature.properties.RAJ_AIKA_ALKAA_SU > 0) {
		contentString += '<p>Rajoitusaika sunnuntaisin (tunneissa): ' + feature.properties.RAJ_AIKA_ALKAA_SU + '-' + feature.properties.RAJ_AIKA_PAATTYY_SU + '</p>'
	}
	
	if (feature.properties.ASUKASPYSAKOINTI == 1) {
		contentString += '<p>Pys&auml;k&ouml;inti sallittu asukas- ja yrityspys&auml;k&ouml;intitunnuksella</p>'
	}
	else {
		//contentString += '<p>Ei erillist&auml; asukas- ja yrityspys&auml;k&ouml;inti&auml;</p>'
	}
	
	if (feature.properties.TALVIKUNNOSSAPITO == 0) {
		//contentString += '<p>Ei siirtokehotuksia talviaikaan</p>'
	} 
	else {
		contentString += '<p>Siirtokehotus talvisin '
		if (feature.properties.TALVIKUNNOSSAPITO / 10 == 1) {
			contentString += 'parittoman viikon '
		}
		else {
			contentString += 'parillisen viikon '
		}
		var day = ""
		switch (feature.properties.TALVIKUNNOSSAPITO % 10) {
		case 1:
			day = "maanantaisin";
			break;
		case 2:
			day = "tiistaisin";
			break;
		case 3:
			day = "keskiviikkoisin";
			break;
		case 4:
			day = "torstaisin";
			break;
		case 5:
			day = "perjantaisin";
			break;
		case 6:
			day = "lauantaisin";
			break;
		case 7:
			day = "sunnuntaisin";
			break;
		}
		contentString += day + '</p>'
	}
	
	if (feature.properties.KOHDETYYPPI != "P") {
		contentString += '<p>Maksuvy&ouml;hyke: ' + feature.properties.MAKSUVYOHYKE + ' (<a target="maksuvyohyke" href="http://www.tampere.fi/liikennejakadut/pysakointi/maksuvyohykkeet.html">lis&auml;tietoa</a> Tampereen kaupungin sivuilla)</p>'
	}
	
	contentString += '<p>Muuta: ' + feature.properties.MUUTA + '</p>'
	
	if (feature.properties.PAIVITYS_PVM != null) {
		contentString += '<p>Viimeisimmän pysäköintialuetta koskevan muutoksen päivämäärä ja tietojen päivittäjä: ' + feature.properties.PAIVITYS_PVM + '</p>'
	}
	
	return contentString;
}

function changeAreaTypeVisibility(areaType) {
	console.log("changeAreaTypeVisibility() called for areaType:" + areaType);
	
	if ($('#flip-checkbox-' + areaType).prop('checked')) { // show
		mapShapes[areaType].forEach(function (shape) {
			shape.setMap(map);
		});
	}
	else {
		mapShapes[areaType].forEach(function (shape) {
			shape.setMap(null);
		});
	}
}