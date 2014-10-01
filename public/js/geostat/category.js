
var categories = [
	{
		internalName: "car_parking",
		name: "Keskustan pysäköintikohteet",
		producer: "Suunnittelupalvelut / Kaupunkiympäristön kehittäminen",
		keyword1: "Liikenne",
		keyword2: "Pysäköinti",
		keyword3: "Autoilu",
		note: "Tilastossa näytetään kohteiden lukumäärä, eikä pysäköintipaikkojen\
			lukumäärää. Kohteet sisältävät maksulliset tai muutoin rajoitetut\
			kadunvarren pysäköintialueet, erilliset\
			pysäköintialueet, yleiset pysäköintilaitokset, taksiasemat, sekä inva-,\
			linja-autojen ja moottoripyörien pysäköintialueet.",
		icon: L.icon({
			iconUrl: '/images/map_data_icon_0033ff.png',
			iconSize: [5, 5],
			iconAnchor : [2, 2]
		}),
		polygonColor: '#03f',
		mapSymbol: "<img src='/images/map_data_icon_0033ff.png' style='width: 10px; height: 10px'> <img src='/images/map_data_poly_legend_0033ff.png' style='width: 20px; height: 20px'>",
		getInfoText: function(feature) {
		
			return createInfoWindowString(feature);
		
			// var parkingAreaLegend = "";
			// var restrictionTypeLegend = "";
		
			// for (var i = 0; i <  parkingDataTypes.areaTypes.length; i++) {
				// if (parkingDataTypes.areaTypes[i].type == feature.properties.KOHDETYYPPI) {
					// parkingAreaLegend = parkingDataTypes.areaTypes[i].legend;
					// break;
				// }
			// }
			// for (var i = 0; i <  parkingDataTypes.restrictionTypes.length; i++) {
				// if (parkingDataTypes.restrictionTypes[i].type == feature.properties.RAJOITUSTYYPPI) {
					// restrictionTypeLegend = parkingDataTypes.restrictionTypes[i].legend;
					// break;
				// }
			// }
			
			// return parkingAreaLegend + "<br>" + restrictionTypeLegend;
		}
	},
	{
		internalName: "bus_stops",
		name: "Bussipysäkit",
		producer: "Joukkoliikenne",
		keyword1: "Liikenne",
		keyword2: "Pysäkit",
		keyword3: "Joukkoliikenne",
		note: "",
		icon: L.icon({
			iconUrl: '/images/map_data_icon_33ff00.png',
			iconSize: [5, 5],
			iconAnchor : [2, 2]
		}),
		mapSymbol: "<img src='/images/map_data_icon_33ff00.png' style='width: 10px; height: 10px'>",
		getInfoText: function(feature) {
			return "hello";
		}
	},
	{
		internalName: "bike_parking",
		name: "Pyöräparkit",
		producer: "Suunnittelupalvelut / Kaupunkiympäristön kehittäminen",
		keyword1: "Liikenne",
		keyword2: "Pysäköinti",
		keyword3: "Pyöräily",
		note: "Tilastossa näytetään kohteiden lukumäärä, eikä pysäköintipaikkojen\
			lukumäärää. Kohteet sisältävät tavalliset pyöräpysäköintipaikat,\
			kaupunkipyöräpaikat, jotka on vain kaupunkipyörien käytössä, sekä\
			liityntäpysäköintipaikat, jotka on tarkoitettu ensisijaisesti joukkoliikenteen käyttäjille.",
		icon:  L.icon({
			iconUrl: '/images/map_data_icon_ff3300.png',
			iconSize: [5, 5],
			iconAnchor : [2, 2]
		}),
		mapSymbol: "<img src='/images/map_data_icon_ff3300.png' style='width: 10px; height: 10px'>",
		getInfoText: function(feature) {
			return "hello";
		}
	},
	{
		internalName: "dog_parking",
		name: "Koirapuistot",
		producer: "Yleisten alueiden suunnittelu",
		keyword1: "Viheralueet",
		keyword2: "Puistot",
		keyword3: "Lemmikit",
		note: "Koirapuistot ovat aidattuja alueita, jotka on tarkoitettu koirien vapaaseen ulkoiluttamiseen.",
		icon:  L.icon({
			iconUrl: '/images/map_data_icon_33ffff.png',
			iconSize: [5, 5],
			iconAnchor : [2, 2]
		}),
		polygonColor: '#3ff',
		mapSymbol: "<img src='/images/map_data_poly_legend_33ffff.png' style='width: 20px; height: 20px'>",
		getInfoText: function(feature) {
			return "hello";
		}
	},
	{
		internalName: "boat_docks",
		name: "Laituripaikat",
		producer: "Rakennuttaminen ja kunnossapito",
		keyword1: "Vapaa-aika",
		keyword2: "Veneily",
		keyword3: "Infraomaisuus",
		note: "Tilastossa näytetään kohteiden lukumäärä, eikä laiturien tai venepaikkojen\
			lukumäärää.",
		icon:  L.icon({
			iconUrl: '/images/map_data_icon_ff33ff.png',
			iconSize: [5, 5],
			iconAnchor : [2, 2]
		}),
		mapSymbol: "<img src='/images/map_data_icon_ff33ff.png' style='width: 10px; height: 10px'>",
		getInfoText: function(feature) {
			return "hello";
		}
	},
	{
		internalName: "rowing_boat_docks",
		name: "Soutuvenerannat",
		producer: "Kaupunkiympäristön kehittäminen / Tilaajaryhmä",
		keyword1: "Vapaa-aika",
		keyword2: "Veneily",
		keyword3: "Soutu",
		note: "Päivittäminen tapahtuu kausittain eikä kaikki kohteet ole sen\
			vuoksi välttämättä ajantasalla. Muutokset vuosittain ovat kuitenkin suhteellisen pieniä.",
		icon:  L.icon({
			iconUrl: '/images/map_data_icon_ffff33.png',
			iconSize: [5, 5],
			iconAnchor : [2, 2]
		}),
		polygonColor: '#ff3',
		mapSymbol: "<img src='/images/map_data_poly_legend_ffff33.png' style='width: 20px; height: 20px'>",
		getInfoText: function(feature) {
			return "hello";
		}
	},
	{
		internalName: "winter_slides",
		name: "Talviliukumäet",
		producer: "Yleisten alueiden suunnittelu",
		keyword1: "Vapaa-aika",
		keyword2: "Perheet",
		keyword3: "Viheralueet",
		note: "Talviliukumäet toteutetaan lumitilanteen mukaan.",
		icon:  L.icon({
			iconUrl: '/images/map_data_icon_000088.png',
			iconSize: [5, 5],
			iconAnchor : [2, 2]
		}),
		mapSymbol: "<img src='/images/map_data_icon_000088.png' style='width: 10px; height: 10px'>",
		getInfoText: function(feature) {
			return "hello";
		}
	},
	{
		internalName: "playing_fields",
		name: "Peli- ja palloilukentät",
		producer: "Yleisten alueiden suunnittelu",
		keyword1: "Vapaa-aika",
		keyword2: "Virkistysalueet",
		keyword3: "Viheralueet",
		note: "Kaupunkiympäristön kehittäminen –yksikön hallinnoimat asemakaavoitetuissa puistoissa\
			tai muilla puistomaisesti rakennetuilla yleisillä alueilla sijaitsevat kentät.\
			Sisältää myös osan Tilakeskuksen hallinnoimista koulujen pihojen kentistä.",
		icon:  L.icon({
			iconUrl: '/images/map_data_icon_880000.png',
			iconSize: [5, 5],
			iconAnchor : [2, 2]
		}),
		polygonColor: '#800',
		mapSymbol: "<img src='/images/map_data_poly_legend_880000.png' style='width: 20px; height: 20px'>",
		getInfoText: function(feature) {
			return "hello";
		}
	},
	{
		internalName: "skateboarding_areas",
		name: "Rullalautailualueet",
		producer: "Yleisten alueiden suunnittelu",
		keyword1: "Vapaa-aika",
		keyword2: "Virkistysalueet",
		keyword3: "Viheralueet",
		note: "Tampereen kaupungin hallinnoimat puistoissa, koulupihoilla tai muilla yleisillä\
			alueilla sijaitsevat rullalautailualueet.",
		icon:  L.icon({
			iconUrl: '/images/map_data_icon_008800.png',
			iconSize: [5, 5],
			iconAnchor : [2, 2]
		}),
		mapSymbol: "<img src='/images/map_data_icon_008800.png' style='width: 10px; height: 10px'>",
		getInfoText: function(feature) {
			return "hello";
		}
	},
	{
		internalName: "playing_grounds",
		name: "Leikkipaikat",
		producer: "Yleisten alueiden suunnittelu",
		keyword1: "Vapaa-aika",
		keyword2: "Perheet",
		keyword3: "Viheralueet",
		note: "Kaupunkiympäristön kehittäminen –yksikön hallinnoimat asemakaavoitetuissa puistoissa\
			tai muilla puistomaisesti rakennetuilla yleisillä alueilla sijaitsevat leikkipaikat.\
			Pääsiassa viheralueilla sijaitsevia pelaamiseen ja leikkitarkoitukseen varattuja kohteita,\
			joille on sijoitettu tähän tarkoitettuja välineitä tai rakenteita.\
			Aineisto sisältää myös muiden hallintokuntien ylläpitämiä leikkipaikkoja mm. kiinteistöjen\
			(kuten koulut ja päiväkodit). Aineisto ei ole niiden osalta kattava. Sisältää vain Tampereen\
			Infran kunnossapitämien koulujen ja päiväkotien leikkipaikat.",
		icon:  L.icon({
			iconUrl: '/images/map_data_icon_0088ff.png',
			iconSize: [5, 5],
			iconAnchor : [2, 2]
		}),
		mapSymbol: "<img src='/images/map_data_icon_0088ff.png' style='width: 10px; height: 10px'>",
		getInfoText: function(feature) {
			return "hello";
		}
	},
	{
		internalName: "elementary_schools",
		name: "Peruskoulut",
		producer: "Tilaajaryhmä / Lasten ja nuorten kasvun tukeminen",
		keyword1: "Opetus",
		keyword2: "Koulut",
		keyword3: "Perheet",
		note: "Tampereen kaupungin, valtion ja yksityiset peruskoulut.",
		icon:  L.icon({
			iconUrl: '/images/map_data_icon_8800ff.png',
			iconSize: [5, 5],
			iconAnchor : [2, 2]
		}),
		mapSymbol: "<img src='/images/map_data_icon_8800ff.png' style='width: 10px; height: 10px'>",
		getInfoText: function(feature) {
			return "hello";
		}
	},
	{
		internalName: "daycare_centers",
		name: "Päiväkodit",
		producer: "Tilaajaryhmä / Lasten ja nuorten kasvun tukeminen",
		keyword1: "Päivähoito",
		keyword2: "Varhaiskasvatus",
		keyword3: "Perheet",
		note: "Kaupungin omat, ostopalvelu-, palveluseteli- ja yksityiset päiväkotipisteet.",
		icon:  L.icon({
			iconUrl: '/images/map_data_icon_008888.png',
			iconSize: [5, 5],
			iconAnchor : [2, 2]
		}),
		mapSymbol: "<img src='/images/map_data_icon_008888.png' style='width: 10px; height: 10px'>",
		getInfoText: function(feature) {
			return "hello";
		}
	},
	{
		internalName: "trashcans",
		name: "Roskakorit",
		producer: "Kaupunkiympäristön kehittäminen / Tilaajaryhmä",
		keyword1: "Siisteys",
		keyword2: "Puhtaanapito",
		keyword3: "Viihtyvyys",
		note: "",
		icon:  L.icon({
			iconUrl: '/images/map_data_icon_880088.png',
			iconSize: [5, 5],
			iconAnchor : [2, 2]
		}),
		mapSymbol: "<img src='/images/map_data_icon_880088.png' style='width: 10px; height: 10px'>",
		getInfoText: function(feature) {
			return "hello";
		}
	}
];

function createInfoWindowString(feature) {
	var contentString = '';//'</p><p>Alueen numero: ' + feature.properties.ALUEEN_NUMERO + '</p>'
		
	contentString += '<p>Kohdetyyppi: ' //+ feature.properties.KOHDETYYPPI
	for (i = 0; i < parkingDataTypes.areaTypes.length; i++) {
		if (parkingDataTypes.areaTypes[i].type == feature.properties.KOHDETYYPPI) {
			contentString += parkingDataTypes.areaTypes[i].legend;
		}
	}

	if (feature.properties.PAIKKATYYPPI != null) {
		contentString += '<p>Paikkatyyppi: ' //+ feature.properties.PAIKKATYYPPI
		for (i = 0; i < parkingDataTypes.directionTypes.length; i++) {
			if (parkingDataTypes.directionTypes[i].type == feature.properties.PAIKKATYYPPI) {
				contentString += parkingDataTypes.directionTypes[i].legend;
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
		for (i = 0; i < parkingDataTypes.restrictionTypes.length; i++) {
			if (parkingDataTypes.restrictionTypes[i].type == feature.properties.RAJOITUSTYYPPI) {
				contentString += parkingDataTypes.restrictionTypes[i].legend;
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

