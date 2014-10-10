
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
	
			var contentString = '';
			contentString += 'Kohdetyyppi: ';
			for (i = 0; i < parkingDataTypes.areaTypes.length; i++) {
				if (parkingDataTypes.areaTypes[i].type == feature.properties.KOHDETYYPPI) {
					contentString += parkingDataTypes.areaTypes[i].legend;
				}
			}

			if (feature.properties.PAIKKATYYPPI != null && feature.properties.PAIKKATYYPPI == 'S') {
				contentString += '<br>Paikkojen arvioitu lukum&auml;&auml;r&auml;: ' + feature.properties.PAIKKOJEN_LUKUMAARA;
			}
			else {
				contentString += '<br>Paikkojen lukum&auml;&auml;r&auml;: ' + feature.properties.PAIKKOJEN_LUKUMAARA;
			}
				
			if (feature.properties.RAJOITUSTYYPPI != null) { 
				contentString += '<br>Rajoitustyyppi: ';
				for (i = 0; i < parkingDataTypes.restrictionTypes.length; i++) {
					if (parkingDataTypes.restrictionTypes[i].type == feature.properties.RAJOITUSTYYPPI) {
						contentString += parkingDataTypes.restrictionTypes[i].legend;
					}
				}
			}
			
			return contentString;
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
			return "Pysäkki: " + feature.properties.NIMI + ", " + feature.properties.NUMERO;
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
			return feature.properties.PYSAKOINTIPAIKAN_TYYPPI + '<br>' +
				'Paikkojen lukum&auml;&auml;r&auml;: ' + feature.properties.PAIKKAMAARA;
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
			return "Koirapuisto";
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
			var harborName = feature.properties.SATAMA.toLowerCase();
			return "Laituripaikka<br>" + "Satama: " + harborName.charAt(0).toUpperCase() + harborName.slice(1);
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
			var name = feature.properties.NIMI.toLowerCase();
			return "Soutuveneranta<br>" + name.charAt(0).toUpperCase() + name.slice(1);
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
			var name = feature.properties.ALUE_NIMI.toLowerCase();
			return "Talviliukumäki<br>" + name.charAt(0).toUpperCase() + name.slice(1);
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
			var name = feature.properties.ALUE_NIMI.toLowerCase();
			return "Peli- ja palloilukentät<br>" + name.charAt(0).toUpperCase() + name.slice(1);
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
			var name = feature.properties.ALUE_NIMI.toLowerCase();
			return "Rullalautailualue<br>" + name.charAt(0).toUpperCase() + name.slice(1);
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
			var name = feature.properties.ALUE_NIMI.toLowerCase();
			return "Leikkipaikka<br>" + name.charAt(0).toUpperCase() + name.slice(1);
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
			var name = feature.properties.NIMI;
			return name;
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
			var name = feature.properties.NIMI;
			return name;
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
			return "Roskakori";
		}
	},
	{
		internalName: "street_lighting",
		name: "Katuvalot",
		producer: "Kaupunkiympäristön kehittäminen / Tilaajaryhmä",
		keyword1: "Liikenne",
		keyword2: "Valaistus",
		keyword3: "Turvallisuus",
		note: "Katuvaloja on erittäin suuri määrä, joten niiden näyttäminen kartalla voi kestää.",
		icon:  L.icon({
			iconUrl: '/images/map_data_icon_888800.png',
			iconSize: [5, 5],
			iconAnchor : [2, 2]
		}),
		mapSymbol: "<img src='/images/map_data_icon_888800.png' style='width: 10px; height: 10px'>",
		getInfoText: function(feature) {
			return "Katuvalo<br>" +
				"Tyyppi: " + feature.properties.TYYPPI + (feature.properties.LAMPPU_TYYPPI != null ? ", " + feature.properties.LAMPPU_TYYPPI : "");
		}
	},
	{
		internalName: "traffic_light_sensors",
		name: "Liikennevalojen ilmaisimet",
		producer: "Yleisten alueiden suunnittelu",
		keyword1: "Liikenne",
		keyword2: "Liikenteen ohjaus",
		keyword3: "Autoilu",
		note: "",
		icon:  L.icon({
			iconUrl: '/images/map_data_icon_00ff33.png',
			iconSize: [5, 5],
			iconAnchor : [2, 2]
		}),
		mapSymbol: "<img src='/images/map_data_icon_00ff33.png' style='width: 10px; height: 10px'>",
		getInfoText: function(feature) {
			return "Liikennevalojen ilmaisin<br>ID: " + feature.properties.ILMAISIN_ID;
		}
	},
	{
		internalName: "bridges",
		name: "Sillat ja alikulkukäytävät",
		producer: "Rakentaminen ja kunnossapito",
		keyword1: "Liikenne",
		keyword2: "Liikenteen infrastruktuuri",
		keyword3: "Kaupunkiliikenne",
		note: "Sisältää Tampereen eri tyyppiset sillat ja alikulkukäytävät.",
		icon:  L.icon({
			iconUrl: '/images/map_data_icon_ff00ff.png',
			iconSize: [5, 5],
			iconAnchor : [2, 2]
		}),
		mapSymbol: "<img src='/images/map_data_icon_ff00ff.png' style='width: 10px; height: 10px'>",
		getInfoText: function(feature) {
			var name = feature.properties.NIMI.toLowerCase();
			return name.charAt(0).toUpperCase() + name.slice(1) +
				(feature.properties.PITUUS != undefined && feature.properties.PITUUS > 0 ? "<br>Pituus: " + feature.properties.PITUUS + " m" : "") +
				(feature.properties.LEVEYS != undefined && feature.properties.LEVEYS > 0 ? "<br>Leveys: " + feature.properties.LEVEYS + " m" : "") +
				(feature.properties.ALIKULKUKORKEUS != undefined && feature.properties.ALIKULKUKORKEUS > 0 ? "<br>Alikulkukorkeus: " + feature.properties.ALIKULKUKORKEUS + " m" : "");
		}
	},
	{
		internalName: "traffic_light_junction",
		name: "Liikennevaloristeykset",
		producer: "Yleisten alueiden suunnittelu",
		keyword1: "Liikenne",
		keyword2: "Liikenteen ohjaus",
		keyword3: "Kaupunkiliikenne",
		note: "Sisältää liikennevalo-ohjatut risteykset ja liittymät",
		icon:  L.icon({
			iconUrl: '/images/map_data_icon_ff0000.png',
			iconSize: [5, 5],
			iconAnchor : [2, 2]
		}),
		mapSymbol: "<img src='/images/map_data_icon_ff0000.png' style='width: 10px; height: 10px'>",
		getInfoText: function(feature) {
			return "Liikennevalo-ohjatut risteykset ja liittymät";
		}
	}
];


