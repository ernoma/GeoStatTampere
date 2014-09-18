
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

$(function () {

	var zone1 = {
		countRestrictionM: 0,
		countRestrictionK: 0,
		countRestrictionL: 0
	}
	var zone2 = {
		countRestrictionM: 0,
		countRestrictionK: 0,
		countRestrictionL: 0
	}
	var zone3 = {
		countRestrictionM: 0,
		countRestrictionK: 0,
		countRestrictionL: 0
	}

	var countParkingHall = 0;
	
	parkingWFSFeatures.forEach(function(feature) {
		switch (feature.properties.MAKSUVYOHYKE) {
			case 0:
				if (feature.properties.RAJOITUSTYYPPI == 'M' && feature.properties.KOHDETYYPPI == 'P') {
					countParkingHall += feature.properties.PAIKKOJEN_LUKUMAARA;
				}
				else {
					console.log("Tuntematon rajoitustyyppi");
					console.log(feature);
				}
				break;
			case 1:
				if (feature.properties.RAJOITUSTYYPPI == 'M') {
					zone1.countRestrictionM += feature.properties.PAIKKOJEN_LUKUMAARA;
				}
				else if (feature.properties.RAJOITUSTYYPPI == 'K') {
					zone1.countRestrictionK += feature.properties.PAIKKOJEN_LUKUMAARA;
				}
				else if (feature.properties.RAJOITUSTYYPPI == 'L' ||
				(feature.properties.RAJOITUSTYYPPI == null && feature.properties.KOHDETYYPPI == 'K') ||
				(feature.properties.RAJOITUSTYYPPI == null && feature.properties.KOHDETYYPPI == 'I') ||
				(feature.properties.RAJOITUSTYYPPI == null && feature.properties.KOHDETYYPPI == 'T') ||
				(feature.properties.RAJOITUSTYYPPI == null && feature.properties.KOHDETYYPPI == 'L') ||
				(feature.properties.RAJOITUSTYYPPI == null && feature.properties.KOHDETYYPPI == 'E') ||
				(feature.properties.RAJOITUSTYYPPI == null && feature.properties.KOHDETYYPPI == 'M')) {
					zone1.countRestrictionL += feature.properties.PAIKKOJEN_LUKUMAARA;
				}
				else {
					console.log("Tuntematon rajoitustyyppi");
					console.log(feature);
				}
				break;
			case 2:
				if (feature.properties.RAJOITUSTYYPPI == 'M') {
					zone2.countRestrictionM += feature.properties.PAIKKOJEN_LUKUMAARA;
				}
				else if (feature.properties.RAJOITUSTYYPPI == 'K') {
					zone2.countRestrictionK += feature.properties.PAIKKOJEN_LUKUMAARA;
				}
				else if (feature.properties.RAJOITUSTYYPPI == 'L' ||
				(feature.properties.RAJOITUSTYYPPI == null && feature.properties.KOHDETYYPPI == 'K') ||
				(feature.properties.RAJOITUSTYYPPI == null && feature.properties.KOHDETYYPPI == 'I') ||
				(feature.properties.RAJOITUSTYYPPI == null && feature.properties.KOHDETYYPPI == 'T') ||
				(feature.properties.RAJOITUSTYYPPI == null && feature.properties.KOHDETYYPPI == 'L') ||
				(feature.properties.RAJOITUSTYYPPI == null && feature.properties.KOHDETYYPPI == 'E') ||
				(feature.properties.RAJOITUSTYYPPI == null && feature.properties.KOHDETYYPPI == 'M')) {
					zone2.countRestrictionL += feature.properties.PAIKKOJEN_LUKUMAARA;
				}
				else {
					console.log("Tuntematon rajoitustyyppi");
					console.log(feature);
				}
				break;
			case 3:
				if (feature.properties.RAJOITUSTYYPPI == 'M') {
					zone3.countRestrictionM += feature.properties.PAIKKOJEN_LUKUMAARA;
				}
				else if (feature.properties.RAJOITUSTYYPPI == 'K') {
					zone3.countRestrictionK += feature.properties.PAIKKOJEN_LUKUMAARA;
				}
				else if (feature.properties.RAJOITUSTYYPPI == 'L' ||
				(feature.properties.RAJOITUSTYYPPI == null && feature.properties.KOHDETYYPPI == 'K') ||
				(feature.properties.RAJOITUSTYYPPI == null && feature.properties.KOHDETYYPPI == 'I') ||
				(feature.properties.RAJOITUSTYYPPI == null && feature.properties.KOHDETYYPPI == 'T') ||
				(feature.properties.RAJOITUSTYYPPI == null && feature.properties.KOHDETYYPPI == 'L') ||
				(feature.properties.RAJOITUSTYYPPI == null && feature.properties.KOHDETYYPPI == 'E') ||
				(feature.properties.RAJOITUSTYYPPI == null && feature.properties.KOHDETYYPPI == 'M')) {
					zone3.countRestrictionL += feature.properties.PAIKKOJEN_LUKUMAARA;
				}
				break;
			default:
				console.log("Tuntematon maksuvyöhyke");
				console.log(feature.properties.MAKSUVYOHYKE);
		}
		
	});

	$('#chart_container').highcharts({
		chart: {
			type: 'bar'
		},
		title: {
			text: 'Pysäköintipaikkojen lukumäärät'
		},
		xAxis: {
			categories: [ '1. maksuvyöhyke', '2. maksuvyöhyke', '3. maksuvyöhyke', 'Pysäköintilaitokset'],
			title: { text: null }
		},
		yAxis: {
			min: 0,
			title: {
				text: 'Lukumäärä',
			}
		},
		plotOptions: {
            series: {
				stacking: 'normal'
			}
        },
		credits: {
            enabled: false
        },
        series: [
		{
			name: 'Pysäköintilaitokset',
			data: [0, 0, 0, countParkingHall]
		}, {
			name: 'Maksullinen',
			data: [zone1.countRestrictionM, zone2.countRestrictionM, zone3.countRestrictionM, 0]
		}, {
			name: 'Kiekko',
			data: [zone1.countRestrictionK, zone2.countRestrictionK, zone3.countRestrictionK, 0]
		}, {
			name: 'Muu rajoitus',
			data: [zone1.countRestrictionL, zone2.countRestrictionL, zone3.countRestrictionL, 0]
		}]
	});
});
