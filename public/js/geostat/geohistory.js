
function handleHistory(type, data) {

	// TODO
	// - areas
	//   * name, location, type, size, color, selected
	// - selected categories

	//console.log("location", location);
	
	var params = [];
	if (location.search != undefined && location.search != null && location.search != '') {
		params = location.search.substring(1).split('&');
	}
	var newHistoryString = "?";
	var found = false;
	var wasEqual = false;
	for (var i = 0; i < params.length; i++) {
		var removedWholeParam = false;
		switch (type) {
			case 'zoom':
				if (params[i].indexOf('z=') != -1) {
					found = true;
					newHistoryString += "z=" + map.getZoom();
					if (params[i].split('=')[1] == map.getZoom()) {
						wasEqual = true;
					}
				}
				else {
					newHistoryString += params[i];
				}
				break;
			case 'basemap':
				if (params[i].indexOf('b=') != -1) {
					found = true;
					var mapName = "";
					for (var j = 0; j < baseMapIdentifiers.length; j++) {
						if (baseMapIdentifiers[j].layer == data) {
							mapName = baseMapIdentifiers[j].name;
							break;
						}
					}
					newHistoryString += "b=" + mapName;
					if (params[i].split('=')[1] == mapName) {
						wasEqual = true;
					}
				}
				else {
					newHistoryString += params[i];
				}
				break;
			case 'maploc':
				if (params[i].indexOf('l=') != -1) {
					found = true;
					var mapCenter = map.getCenter();
					var mapCenterLatLngString = mapCenter.lat + ',' + mapCenter.lng;
					var latLngString = params[i].split('=')[1];
					if (latLngString == mapCenterLatLngString) {
						wasEqual = true;
					}
					newHistoryString += "l=" + mapCenterLatLngString;
				}
				else {
					newHistoryString += params[i];
				}
				break;
			case 'area':
				if (params[i].indexOf('a=') != -1) {
					found = true;
					newHistoryString += "a=";
					var areaParam = params[i].split('=')[1];
					var areaStrings = areaParam.split(',');
					var foundArea = false;
					for (var j = 0; j < areaStrings.length; j++) {
						// if one of areasStrings has same id as the data.id then if it is not equal change the areaString
						if (data.isSameStatArea(areaStrings[j])) {
							foundArea = true;
							if (areaStrings[j] == data.getHistoryString()) {
								wasEqual = true;
								newHistoryString += areaStrings[j];
							}
							else {
								newHistoryString += data.getHistoryString();
							}
						}
						else {
							newHistoryString += areaStrings[j];
						}
						if (j < areaStrings.length - 1) {
							newHistoryString += ',';
						}
					}
					if (!foundArea) {
						newHistoryString += ',';
						newHistoryString += data.getHistoryString();
					}
				}
				else {
					newHistoryString += params[i];
				}
				break;
			case 'arearemove':
				if (params[i].indexOf('a=') != -1) {
					found = true;
					var areaParam = params[i].split('=')[1];
					var areaStrings = areaParam.split(',');
					var isAtStatAreaToRemove = false;
					if (areaStrings.length == 1) {
						removedWholeParam = true;
						if (newHistoryString.lastIndexOf('&') == newHistoryString.length - 1 && i == params.length - 1) {
							newHistoryString = newHistoryString.substring(0, newHistoryString.length - 1); // remove extra '&'
						}
					}
					else {
						newHistoryString += "a=";
						for (var j = 0; j < areaStrings.length; j++) {
							if (data.isSameStatArea(areaStrings[j])) {
								isAtStatAreaToRemove = true;
								if (j == areaStrings.length - 1) {
									newHistoryString = newHistoryString.substring(0, newHistoryString.length - 1); // remove extra ','
								}
							}
							else {
								newHistoryString += areaStrings[j];
								isAtStatAreaToRemove = false;
							}
							
							if (j < areaStrings.length - 1 && !isAtStatAreaToRemove) {
								newHistoryString += ',';
							}
						}
					}
				}
				else {
					newHistoryString += params[i];
				}
				break;
			case 'cat':
				if (params[i].indexOf('c=') != -1) {
					found = true;
					var name = getCategoryInternalName(data);
					newHistoryString += "c=";
					var catParam = params[i].split('=')[1];
					var catNames = catParam.split(',');
					var foundCat = false;
					for (var j = 0; j < catNames.length; j++) {
						// if one of areasStrings has same id as the data.id then if it is not equal change the areaString
						if (name == catNames[j]) {
							foundCat = true;
						}
						newHistoryString += catNames[j];
						if (j < catNames.length - 1) {
							newHistoryString += ',';
						}
					}
					if (!foundCat) {
						newHistoryString += ',';
						newHistoryString += name;
					}
				}
				else {
					newHistoryString += params[i];
				}
				break;
			case 'catremove':
				if (params[i].indexOf('c=') != -1) {
					found = true;
					var name = getCategoryInternalName(data);
					var catParam = params[i].split('=')[1];
					var catNames = catParam.split(',');
					var isAtCatToRemove = false;
					if (catNames.length == 1) {
						removedWholeParam = true;
						if (newHistoryString.lastIndexOf('&') == newHistoryString.length - 1 && i == params.length - 1) {
							newHistoryString = newHistoryString.substring(0, newHistoryString.length - 1); // remove extra '&'
						}
					}
					else {
						newHistoryString += "c=";
						for (var j = 0; j < catNames.length; j++) {
							if (name == catNames[j]) {
								isAtCatToRemove = true;
								if (j == catNames.length - 1) {
									newHistoryString = newHistoryString.substring(0, newHistoryString.length - 1); // remove extra ','
								}
							}
							else {
								newHistoryString += catNames[j];
								isAtCatToRemove = false;
							}
							
							if (j < catNames.length - 1 && !isAtCatToRemove) {
								newHistoryString += ',';
							}
						}
					}
				}
				else {
					newHistoryString += params[i];
				}
				break;
			case 'catallremove':
				if (params[i].indexOf('c=') != -1) {
					found = true;
					removedWholeParam = true;
					if (newHistoryString.lastIndexOf('&') == newHistoryString.length - 1 && i == params.length - 1) {
						newHistoryString = newHistoryString.substring(0, newHistoryString.length - 1); // remove extra '&'
					}
				}
				else {
					newHistoryString += params[i];
				}
				break;
		}
		if ((i < params.length - 1 || (i == params.length - 1 && !found)) && !removedWholeParam) {
			newHistoryString += '&';
		}
	}
	if (!found) {
		switch (type) {
			case 'zoom':
				newHistoryString += "z=" + map.getZoom();
				break;
			case 'basemap':
				var mapName = "";
				for (var j = 0; j < baseMapIdentifiers.length; j++) {
					if (baseMapIdentifiers[j].layer == data) {
						mapName = baseMapIdentifiers[j].name;
						break;
					}
				}
				newHistoryString += "b=" + mapName;
				break;
			case 'maploc':
				var mapCenter = map.getCenter();
				var mapCenterLatLngString = mapCenter.lat + ',' + mapCenter.lng;
				newHistoryString += "l=" + mapCenterLatLngString;
				break;
			case 'area':
				newHistoryString += "a=" + data.getHistoryString();
				break;
			case 'cat':
				var name = getCategoryInternalName(data);
				newHistoryString += "c=" + name;
				break;
			default:
				newHistoryString = location.search;
		}
	}
	if (!wasEqual) {
		history.pushState(newHistoryString, '', newHistoryString);
	}

	console.log("history.state", history.state);
	console.log("location.search", location.search);
}

// $(window).bind('popstate', function(event) {
	// console.log('popstate');
	// console.log("history.state", history.state);
	// returnHistory();
// });

function returnHistory() {
	console.log("location.search", location.search);
	
	var params = [];
	if (location.search != undefined && location.search != null && location.search != '') {
		params = location.search.substring(1).split('&');
	}
	var zoom = DEFAULT_ZOOM;
	var mapLocation = [INITIAL_LAT, INITIAL_LON];
	var basemapName = DEFAULT_BASEMAP_NAME;
	for (var i = 0; i < params.length; i++) {
		var keyValPair = params[i].split('=');
		switch (keyValPair[0]) {
			case 'z':
				zoom = keyValPair[1];
				break;
			case 'b':
				basemapName = keyValPair[1];
				break;
			case 'l':
				mapLocation = keyValPair[1].split(',');
				break;
			case 'a':
				createStatAreasFromHistory(keyValPair[1]);
				break;
			case 'c':
				selectCategoriesFromHistory(keyValPair[1]);
				break;
		}
	}
	for (var j = 0; j < baseMapIdentifiers.length; j++) {
		if (baseMapIdentifiers[j].name == basemapName) {
			if (!map.hasLayer(baseMapIdentifiers[j].layer)) {
				baseMapIdentifiers[j].layer.addTo(map);
			}
		}
		else {
			map.removeLayer(baseMapIdentifiers[j].layer);
		}
	}
	map.setView(mapLocation, zoom);
}
$(function() {
	if (location.search != undefined && location.search != null && location.search != '') {
		map.closePopup(startPopup);
		returnHistory();
	}
});
