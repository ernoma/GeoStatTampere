
var statAreaColors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', 
   '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'];
   
var statAreaCount = 0;

var center_icon = L.icon({
  iconUrl: '/images/center_icon.png',
  iconSize: [20, 20],
  iconAnchor: [9, 9]
});

var resize_icon = L.icon({
  iconUrl: '/images/resize_icon.png',
  iconSize: [10, 10],
  iconAnchor: [4, 4]
});

var statAreaID = 0;

function StatArea(type, latLng, selected, name, radius, map) {
	this.id = statAreaID++;
	this.type = type;
	var color = statAreaColors[statAreaCount % statAreaColors.length];
	this.color = color;
	this.dataLayers = [];
	this.selected = selected;
	this.name = name;
	if (type == "circle") {
		this.radius = radius;
	}
	else {
		this.latRadius = radius;
		this.lngRadius = radius;
	}
	var statArea = this;
	if (this.type == "circle") {
		statArea.path = L.circle(latLng, radius, {
			color: color,
			weight: 5,
			fillColor: color,
			fillOpacity: 0.5
		}).addTo(map);
		statArea.path.on('mouseover', function(event) {
			var center = this.getBounds().getCenter();
			var text = 
				"<p>Nimi: " + statArea.name +
				"<br>Alueen keskipiste:<br>&nbsp;&nbsp;&nbsp;&nbsp;(lng, lat) = (" + center.lat.toFixed(5) + ", " + center.lng.toFixed(5) + ")" +
				"<br>Säde: " + this.getRadius() + " m</p>"
			featureInfoControl.update(text);
		});
		statArea.path.on('mouseout', function(event) {
			featureInfoControl.update();
		});
	} else {
		var latLngBounds = getlatLngBounds(latLng, radius, radius);
		statArea.path = L.rectangle(latLngBounds, {
			color: color,
			weight: 5,
			fillColor: color,
			fillOpacity: 0.5
		}).addTo(map);
		statArea.path.on('mouseover', function(event) {
			var center = this.getBounds().getCenter();
			var text = 
				"<p>Nimi: " + statArea.name +
				"<br>Alueen keskipiste:<br>&nbsp;&nbsp;&nbsp;&nbsp;(lng, lat) = (" + center.lat.toFixed(5) + ", " + center.lng.toFixed(5) + ")" +
				"<br>Leveys: " + this.lngRadius * 2	+ " m" +
				"<br>Korkeus: " + this.latRadius * 2	+ " m" + "</p>"
			featureInfoControl.update(text);
		});
		statArea.path.on('mouseout', function(event) {
			featureInfoControl.update();
		});
	}
		
	statAreaCount++;
	
	this.marker = this.createCenterMarker(latLng, map);
	this.resizeMarkers = this.createResizeMarkers(map);
	
	handleHistory('area', this);
}

function createStatAreasFromHistory(historyString) {
	var statAreaStrings = historyString.split(';');
	for (var i = 0; i < statAreaStrings.length; i++) {
		var statArea = createStatAreaFromHistoryString(statAreaStrings[i]);
		statAreas.push(statArea);
		statArea.getDataOnArea();
	}
}

function createStatAreaFromHistoryString(historyString) {
	var parts = historyString.split('+');
	var name = parts[0];
	var type = parts[1] == 'c' ? 'circle' : 'rectangle';
	var decodedLatLng = parts[2].split(',');
	var center = L.latLng(parseFloat(decodedLatLng[0]), parseFloat(decodedLatLng[1]));
	var color = parts[4];
	var selected = parts[5] == 't' ? true : false;
	var statArea;
	if (type == 'circle') {
		var radius = parseInt(parts[3]);
		statArea = new StatArea(type, center, selected, name, radius, map);
	}
	else {
		var radiusParts = parts[3].split(',');
		var latRadius = parseInt(radiusParts[0]);
		var lngRadius = parseInt(radiusParts[1]);
		statArea = new StatArea(type, center, selected, name, latRadius, map);
		statArea.lngRadius = lngRadius;
		statArea.latRadius = latRadius;
		var latLngBounds = getlatLngBounds(statArea.marker.getLatLng(), statArea.latRadius, statArea.lngRadius);
		statArea.path.setBounds(latLngBounds);
	}
	statArea.id = parseInt(parts[6]);
	return statArea;
}

StatArea.prototype.isSameStatArea = function(historyString) {
	var parts = historyString.split('+');
	if (this.id == parseInt(parts[6])) {
		return true;
	}
	
	return false;
}

StatArea.prototype.getHistoryString = function() {
	var historyString = this.name + '+' + (this.type == 'circle' ? 'c' : 'r') + '+' +
		this.path.getBounds().getCenter().lat + ',' + this.path.getBounds().getCenter().lng + '+';
	if (this.type == 'circle') {
		historyString += this.getRadius();
	}
	else {
		historyString += this.latRadius + ',' + this.lngRadius;
	}
	historyString += '+' + this.color;
	historyString += '+' + (this.selected ? 't' : 'f');
	historyString += '+' + this.id;
	return historyString;
}

StatArea.prototype.isLatLngInsidePath = function(latlng) {
	if (this.type == "circle") {
		return is_inside_circle(latlng, this.path);
	}
	else {
		return is_inside_rectangle(latlng, this.path);
	}
}

StatArea.prototype.select = function() {
	this.path.setStyle({
		weight: 5
	});
	this.selected = true;
	
	handleHistory('area', this);
}

StatArea.prototype.unselect = function() {			
	this.path.setStyle({
		weight: 2
	});
	this.selected = false;
	
	handleHistory('area', this);
}

StatArea.prototype.rename = function(newName) {
	this.name = newName;
	this.marker.setPopupContent(newName);
	
	handleHistory('area', this);
}

StatArea.prototype.changeColor = function(colorValue) {
	this.path.setStyle({
		color: colorValue,
		fillColor: colorValue
	});
	this.color = colorValue;
	
	handleHistory('area', this);
}
	
StatArea.prototype.setRadius = function(newRadius) {
	this.path.setRadius(newRadius);
	
	handleHistory('area', this);
}
	
StatArea.prototype.setSize = function(newWidth, newHeight) {
	this.lngRadius = newWidth / 2;
	this.latRadius = newHeight / 2;
	var latLngBounds = getlatLngBounds(this.marker.getLatLng(), this.latRadius, this.lngRadius);
	//console.log("marker.getLatLng(): " + this.marker.getLatLng());
	//console.log("latLngBounds: " + this.latLngBounds.getSouthWest() + ', ' + this.latLngBounds.getNorthEast());
	this.path.setBounds(latLngBounds);
	
	handleHistory('area', this);
}

StatArea.prototype.getRadius = function() {
	return this.path.getRadius();
}
	
StatArea.prototype.getWidth = function() {
	return this.lngRadius * 2;
}

StatArea.prototype.getHeight = function() {
	return this.latRadius * 2;
}

StatArea.prototype.isSameSize = function(newWidth, newHeight) {
	return newWidth == this.lngRadius * 2 && newHeight == this.latRadius * 2;
}

StatArea.prototype.isSameRadius = function(newRadius) {
	return newRadius == this.path.getRadius();
}
	
StatArea.prototype.getInfoText = function() {

	var center = this.path.getBounds().getCenter();

	var text = "";
	if (this.type == "circle") {
		text = "<p><i>Voit raahata alueen toiseen paikkaan hiirellä.</i></p>" +
		"<p>Nimi: " + this.name +
		"<br>Alueen keskipiste:<br>&nbsp;&nbsp;&nbsp;&nbsp;(lng, lat) = (" + center.lat.toFixed(5) + ", " + center.lng.toFixed(5) + ")" +
		"<br>Säde: " + this.getRadius() + " m</p>"
	}
	else {
		text = "<p><i>Voit raahata alueen toiseen paikkaan hiirellä.</i></p>" +
		"<p>Nimi: " + this.name +
		"<br>Alueen keskipiste:<br>&nbsp;&nbsp;&nbsp;&nbsp;(lng, lat) = (" + center.lat.toFixed(5) + ", " + center.lng.toFixed(5) + ")" +
		"<br>Leveys: " + this.lngRadius * 2	+ " m" +
		"<br>Korkeus: " + this.latRadius * 2	+ " m" + "</p>"
	}
	
	return text;
}

StatArea.prototype.createMapLayer = function(map, category, geoJsonObject) {
	
	var layerGroup = L.layerGroup();
	
	// var pointFound = false;
	// var polygonFound = false;
	
	//console.log("createMapLayer", geoJsonObject);
	//console.log("category", category);
	
	for (var i = 0; i < geoJsonObject.features.length; i++) {
		if (geoJsonObject.features[i].geometry.type == "Point") {
			// if (!pointFound) {
				// pointFound = true;
				// console.log(category.name + " has points");
			// }
			var marker = L.marker([geoJsonObject.features[i].geometry.coordinates[1], geoJsonObject.features[i].geometry.coordinates[0]],
				{ icon: category.icon });
			layerGroup.addLayer(marker);
			(function(i) {
				marker.on('mouseover', function(event) {
					var text = category.getInfoText(geoJsonObject.features[i]);
					featureInfoControl.update(text);
				});
				marker.on('mouseout', function(event) {
					featureInfoControl.update();
				});
			})(i);
		}
		else if (geoJsonObject.features[i].geometry.type == "Polygon") {
			// if (!polygonFound) {
				// polygonFound = true;
				// console.log(category.name + " has polys");
			// }
			var latLngArray = [];
			for (var j = 0; j < geoJsonObject.features[i].geometry.coordinates[0].length; j++) {
				var latLng = L.latLng(geoJsonObject.features[i].geometry.coordinates[0][j][1], geoJsonObject.features[i].geometry.coordinates[0][j][0]);
				//console.log(latLng);
				latLngArray.push(latLng);
			}
			
			var polygon = L.polygon(latLngArray, {
				weight: 1,
				color: category.polygonColor,
				opacity: 1,
				fillColor: category.polygonColor,
				fillOpacity: 0.2
			});
			layerGroup.addLayer(polygon);
			(function(i) {
				polygon.on('mouseover', function(event) {
					var text = category.getInfoText(geoJsonObject.features[i]);
					featureInfoControl.update(text);
				});
				polygon.on('mouseout', function(event) {
					featureInfoControl.update();
				});
			})(i);
			
			//console.log("L.polygon(latLngArray).getBounds().getCenter()", L.polygon(latLngArray).getBounds().getCenter());
			//var marker = L.marker(L.polygon(latLngArray).getBounds().getCenter(), { icon: category.icon });
			//layerGroup.addLayer(marker);
		}
		else {
			console.log("Did not create map marker because geometry: ", geoJsonObject.features[i].geometry.type);
		}
	}
	
	this.dataLayers.push({name: category.name, layer: layerGroup});
	layerGroup.addTo(map);
}

StatArea.prototype.remove = function(map) {
	map.removeLayer(this.path);
	map.removeLayer(this.marker);
	
	for (var i = 0; i < this.resizeMarkers.length; i++) {
		map.removeLayer(this.resizeMarkers[i]);
	}
	
	this.removeAllDataLayers(map);
	
	handleHistory('arearemove', this);
}

StatArea.prototype.removeDataLayer = function(map, name) {
	for (var i = 0; i < this.dataLayers.length; i++) {
		if (this.dataLayers[i].name == name) {
			map.removeLayer(this.dataLayers[i].layer);
			this.dataLayers.splice(i, 1);
			break;
		}
	}
}

StatArea.prototype.removeAllDataLayers = function(map) {
	for (var i = 0; i < this.dataLayers.length; i++) {
		map.removeLayer(this.dataLayers[i].layer);
	}
	
	this.dataLayers = [];
}

StatArea.prototype.createCenterMarker = function(latLng, map) {

	var statArea = this;

	var marker = L.marker(latLng, { icon: center_icon, draggable:'true' }).addTo(map);
	//marker.bindPopup("leveys: " + INITIAL_LAT + ", pituus: " + INITIAL_LON);
	marker.bindPopup("Alue " + statAreaCount);

	if (this.type == 'circle') {
		marker.on('drag', function(event) {
			var position = event.target.getLatLng();
			var oldPosition = statArea.path.getLatLng();
			var latDist = getDistanceFromLatLonInMeters(position.lat, position.lng, oldPosition.lat, position.lng);
			var lngDist = getDistanceFromLatLonInMeters(position.lat, position.lng, position.lat, oldPosition.lng);
			latDist = position.lat > oldPosition.lat ? latDist : -latDist;
			lngDist = position.lng > oldPosition.lng ? lngDist : -lngDist;
			statArea.path.setLatLng(position);
			var lat = addMetersToLat(statArea.resizeMarkers[0].getLatLng(), latDist);
			var lng = addMetersToLng(statArea.resizeMarkers[0].getLatLng(), lngDist);
			var resizeMarkerlatLng = L.latLng(lat, lng);
			statArea.resizeMarkers[0].setLatLng(resizeMarkerlatLng);
			var text = statArea.getInfoText();
			featureInfoControl.update(text);
		});
	}
	else { // rectangle
		marker.on('drag', function(event) {
			var position = event.target.getLatLng();
			var oldPosition = statArea.path.getBounds().getCenter();
			var latDist = getDistanceFromLatLonInMeters(position.lat, position.lng, oldPosition.lat, position.lng);
			var lngDist = getDistanceFromLatLonInMeters(position.lat, position.lng, position.lat, oldPosition.lng);
			latDist = position.lat > oldPosition.lat ? latDist : -latDist;
			lngDist = position.lng > oldPosition.lng ? lngDist : -lngDist;
			var latLngBounds = getlatLngBounds(position, statArea.latRadius, statArea.lngRadius);
			statArea.path.setBounds(latLngBounds);
			var lat = addMetersToLat(statArea.resizeMarkers[0].getLatLng(), latDist);
			var lng = addMetersToLng(statArea.resizeMarkers[0].getLatLng(), lngDist);
			var resizeMarkerlatLng = L.latLng(lat, lng);
			statArea.resizeMarkers[0].setLatLng(resizeMarkerlatLng);
			var text = statArea.getInfoText();
			featureInfoControl.update(text);
		});
	}
	marker.on('mouseover', function(event) {
		var text = statArea.getInfoText();
		featureInfoControl.update(text);
	});
	marker.on('mouseout', function(event) {
		featureInfoControl.update();
	});
	
	statAreas.push(statArea);

	marker.on('click', function(event) {
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

	marker.on('dragend', function(event) {
		var position = event.target.getLatLng();
		for(var i = 0; i < statAreas.length; i++) {
			if (statAreas[i].marker == this) {
				if (statAreas[i].type == "circle") {
					var oldPosition = statAreas[i].path.getLatLng();
					var latDist = getDistanceFromLatLonInMeters(position.lat, position.lng, oldPosition.lat, position.lng);
					var lngDist = getDistanceFromLatLonInMeters(position.lat, position.lng, position.lat, oldPosition.lng);
					latDist = position.lat > oldPosition.lat ? latDist : -latDist;
					lngDist = position.lng > oldPosition.lng ? lngDist : -lngDist;
					statAreas[i].path.setLatLng(position);
					var lat = addMetersToLat(statAreas[i].resizeMarkers[0].getLatLng(), latDist);
					var lng = addMetersToLng(statAreas[i].resizeMarkers[0].getLatLng(), lngDist);
					var resizeMarkerlatLng = L.latLng(lat, lng);
					statAreas[i].resizeMarkers[0].setLatLng(resizeMarkerlatLng);
				}
				else {
					var oldPosition = statAreas[i].path.getBounds().getCenter();
					var latDist = getDistanceFromLatLonInMeters(position.lat, position.lng, oldPosition.lat, position.lng);
					var lngDist = getDistanceFromLatLonInMeters(position.lat, position.lng, position.lat, oldPosition.lng);
					latDist = position.lat > oldPosition.lat ? latDist : -latDist;
					lngDist = position.lng > oldPosition.lng ? lngDist : -lngDist;
					var latLngBounds = getlatLngBounds(position, statAreas[i].latRadius, statAreas[i].lngRadius);
					statAreas[i].path.setBounds(latLngBounds);
					var lat = addMetersToLat(statAreas[i].resizeMarkers[0].getLatLng(), latDist);
					var lng = addMetersToLng(statAreas[i].resizeMarkers[0].getLatLng(), lngDist);
					var resizeMarkerlatLng = L.latLng(lat, lng);
					statAreas[i].resizeMarkers[0].setLatLng(resizeMarkerlatLng);
				}
				found = true
				statAreas[i].path.setStyle({
					weight: 5
				})
				statAreas[i].selected = true;
				statAreas[i].updateDataOnArea();
				$("#delete_button").removeAttr("disabled");
				
				handleHistory('area', statAreas[i]);
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
	
	return marker;
}


StatArea.prototype.createResizeMarkers = function(map) {
	var statArea = this;

	var isBottomMarker = true;
	var isLeftMarker = true;
	
	var resizeMarkers = [];
	
	if (this.type == "circle") {
		var lng = addMetersToLng(this.marker.getLatLng(), this.getRadius());
		var latLng = L.latLng(this.marker.getLatLng().lat, lng);
		var marker = L.marker(latLng, { icon: resize_icon, draggable:'true' }).addTo(map);
		resizeMarkers.push(marker);
		
		marker.on('drag', function(event) {
			var position = event.target.getLatLng();
			var centerMarkerPosition = statArea.marker.getLatLng();
			var newRadius =  Math.round(getDistanceFromLatLonInMeters(centerMarkerPosition.lat, centerMarkerPosition.lng, position.lat, position.lng));
			statArea.setRadius(newRadius);
			var text = "Säde: " + newRadius + " m";
			featureInfoControl.update(text);
		});
		marker.on('dragend', function(event) {
			var position = event.target.getLatLng();
			var centerMarkerPosition = statArea.marker.getLatLng();
			var newRadius =  Math.round(getDistanceFromLatLonInMeters(centerMarkerPosition.lat, centerMarkerPosition.lng, position.lat, position.lng));
			statArea.setRadius(newRadius);
			var text = "Säde: " + newRadius + " m";
			featureInfoControl.update(text);
			statArea.updateDataOnArea();
			
			handleHistory('area', statArea);
		});
		marker.on('mouseover', function(event) {
			var text = "<p><i>Voit raahata ympyrää hiirellä<br>suuuremmaksi tai pienemmäksi.</i></p>" +
				"<p>Säde: " + statArea.getRadius() + " m</p>";
			featureInfoControl.update(text);
		});
		marker.on('mouseout', function(event) {
			featureInfoControl.update();
		});
	}
	else {
		
		// bottom, left
		var lng = subtractMetersFromLng(this.marker.getLatLng(), this.getWidth() / 2);
		var lat = subtractMetersFromLat(this.marker.getLatLng(), this.getHeight() / 2);
		var latLng = L.latLng(lat, lng);
		var marker = L.marker(latLng, { icon: resize_icon, draggable:'true' }).addTo(map);
		resizeMarkers.push(marker);
		
		marker.on('drag', function(event) {
			var position = event.target.getLatLng();
			var oldBounds = statArea.path.getBounds();
			var newSouth = 0;
			var newWest = 0;
			var newNorth = 0;
			var newEast = 0;
			if (position.lat <= oldBounds.getNorth() && isBottomMarker) {
				newSouth = position.lat;
				newNorth = oldBounds.getNorth();
			}
			else {
				newSouth = oldBounds.getSouth();
				newNorth = position.lat;
				isBottomMarker = false;
			}
			if (position.lat < oldBounds.getSouth()) {
				newSouth = position.lat;
				newNorth = oldBounds.getNorth();
				isBottomMarker = true;
			}
			
			if (position.lng <= oldBounds.getEast() && isLeftMarker) {
				newWest = position.lng;
				newEast = oldBounds.getEast();
			}
			else {
				newWest = oldBounds.getWest();
				newEast = position.lng;
				isLeftMarker = false;
			}
			if (position.lng < oldBounds.getWest()) {
				newWest = position.lng;
				newEast = oldBounds.getEast();
				isLeftMarker = true;
			}
			statArea.path.setBounds(L.latLngBounds([newSouth, newWest], [newNorth, newEast]));
			statArea.marker.setLatLng(statArea.path.getBounds().getCenter());
			statArea.latRadius = Math.round(getDistanceFromLatLonInMeters(newSouth, newWest, newNorth, newWest) / 2);
			statArea.lngRadius = Math.round(getDistanceFromLatLonInMeters(newSouth, newWest, newSouth, newEast) / 2);
			var text = "Leveys: " + statArea.lngRadius * 2 + " m" +
				"<br>Korkeus: " + statArea.latRadius * 2 + " m";
			featureInfoControl.update(text);
		});
		marker.on('dragend', function(event) {
			var position = event.target.getLatLng();
			var oldBounds = statArea.path.getBounds();
			var newSouth = 0;
			var newWest = 0;
			var newNorth = 0;
			var newEast = 0;
			if (position.lat <= oldBounds.getNorth() && isBottomMarker) {
				newSouth = position.lat;
				newNorth = oldBounds.getNorth();
			}
			else {
				newSouth = oldBounds.getSouth();
				newNorth = position.lat;
				isBottomMarker = false;
			}
			if (position.lat < oldBounds.getSouth()) {
				newSouth = position.lat;
				newNorth = oldBounds.getNorth();
				isBottomMarker = true;
			}
			
			if (position.lng <= oldBounds.getEast() && isLeftMarker) {
				newWest = position.lng;
				newEast = oldBounds.getEast();
			}
			else {
				newWest = oldBounds.getWest();
				newEast = position.lng;
				isLeftMarker = false;
			}
			if (position.lng < oldBounds.getWest()) {
				newWest = position.lng;
				newEast = oldBounds.getEast();
				isLeftMarker = true;
			}	
			statArea.path.setBounds(L.latLngBounds([newSouth, newWest], [newNorth, newEast]));
			statArea.marker.setLatLng(statArea.path.getBounds().getCenter());
			statArea.latRadius = Math.round(getDistanceFromLatLonInMeters(newSouth, newWest, newNorth, newWest) / 2);
			statArea.lngRadius = Math.round(getDistanceFromLatLonInMeters(newSouth, newWest, newSouth, newEast) / 2);
			var text = "Leveys: " + statArea.lngRadius * 2 + " m" +
				"<br>Korkeus: " + statArea.latRadius * 2 + " m";
			featureInfoControl.update(text);
			statArea.updateDataOnArea();
			
			handleHistory('area', statArea);
		});
		marker.on('mouseover', function(event) {
			var text = "<p><i>Voit raahata suorakulmiota hiirellä<br>suuuremmaksi tai pienemmäksi.</i></p>" +
				"<p>Leveys: " + statArea.lngRadius * 2 + " m" +
				"<br>Korkeus: " + statArea.latRadius * 2 + " m</p>";
			featureInfoControl.update(text);
		});
		marker.on('mouseout', function(event) {
			featureInfoControl.update();
		});
	}
	
	return resizeMarkers;
}

StatArea.prototype.getDataOnArea = function() {

	var valueArray = Array.apply(null, new Array(selectedCategories.length)).map(Number.prototype.valueOf,0); // array of zeros
	
	var series = geochart.addChartSeries(valueArray, this.name);

	for (var i = 0; i < selectedCategories.length; i++) {
		this.getDataOnCategory(selectedCategories[i]);
	}
}

StatArea.prototype.updateDataOnArea = function() {
	
	this.removeAllDataLayers(map);
	
	var sizeFilter = null;
	if (this.type == "circle") {
		sizeFilter = { radius: this.path.getRadius() };
	}
	else {
		var latLngBounds = this.path.getBounds();
		sizeFilter = { east: latLngBounds.getEast(), south: latLngBounds.getSouth(), west: latLngBounds.getWest(), north: latLngBounds.getNorth() };
	}
	
	for (var i = 0; i < selectedCategories.length; i++) {
		this.getDataOnCategory(selectedCategories[i], this.marker.getLatLng().lat, this.marker.getLatLng().lng, sizeFilter);
	}
}

StatArea.prototype.getDataOnCategory = function(category) {
	
	var sizeFilter = null;
	if (this.type == "circle") {
		sizeFilter = { radius: this.path.getRadius() };
	}
	else {
		var latLngBounds = this.path.getBounds();
		sizeFilter = { east: latLngBounds.getEast(), south: latLngBounds.getSouth(), west: latLngBounds.getWest(), north: latLngBounds.getNorth() };
	}
	
	// var n = Math.floor((Math.random() * 100) + 1);
	// console.log("Alue: " + this.name + ", kategoria: " + category.name + ", count: " + n);
	// geochart.updateSeriesCategory(category.name, this.name, n);
	
	var statArea = this;
	
	$.getJSON("/tredata.json", { dataSetName: category.internalName, sizeFilter: JSON.stringify(sizeFilter), lat: this.marker.getLatLng().lat, lon: this.marker.getLatLng().lng }, function(response) {
		parsed_response = JSON.parse(response);
		console.log(category.internalName, "N of features: " + parsed_response.totalFeatures);
		
		geochart.updateSeriesCategory(category.name, statArea.name, parsed_response.totalFeatures);
		
		statArea.createMapLayer(map, category, parsed_response);
	});
}

