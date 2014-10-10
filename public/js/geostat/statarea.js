
var statAreaColors = ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', 
   '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'];
   
var statAreaCount = 0;

var center_icon = L.icon({
  iconUrl: '/images/center_icon.png',
  iconSize: [20, 20],
  iconAnchor: [9, 9]
});

function StatArea(type, latLng, selected, name, radius, map) {
	this.type = type;
	
	var color = statAreaColors[statAreaCount % statAreaColors.length];
	
	if (this.type == "circle") {
		this.path = L.circle(latLng, INITIAL_AREA_RADIUS, {
			color: color,
			weight: 5,
			fillColor: color,
			fillOpacity: 0.5
		}).addTo(map);
	} else {
		var latLngBounds = getlatLngBounds(latLng, INITIAL_AREA_RADIUS, INITIAL_AREA_RADIUS);
		this.path = L.rectangle(latLngBounds, {
			color: color,
			weight: 5,
			fillColor: color,
			fillOpacity: 0.5
		}).addTo(map);
	}
		
	statAreaCount++;
	
	this.marker = this.createCenterMarker(latLng, map, this);
	this.selected = selected;
	this.name = name;
	if (type == "circle") {
		this.radius = radius;
	}
	else {
		this.latRadius = radius;
		this.lngRadius = radius;
	}
	this.color = color;
	
	this.dataLayers = [];

}

StatArea.prototype.isLatLngInsidePath = function(latlng) {
	if (this.type == "circle") {
		return is_inside_circle(latlng, this.path);
	}
	else {
		return is_inside_rectangle(latlng, this.path);
	}
}

StatArea.prototype.rename = function(newName) {
	this.name = newName;
}

StatArea.prototype.getInfoText = function() {

	var center = this.path.getBounds().getCenter();

	return "<p><i>Voit raahata alueen toiseen paikkaan hiirellä.</i></p>" +
		"<p>Nimi: " + this.name +
		"<br>Alueen keskipiste:<br>&nbsp;&nbsp;&nbsp;&nbsp;(leveys, pituus) = (" + center.lat.toFixed(5) + ", " + center.lng.toFixed(5) + ")</p>";
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


StatArea.prototype.removeMapLayer = function(map, name) {
	for (var i = 0; i < this.dataLayers.length; i++) {
		if (this.dataLayers[i].name == name) {
			map.removeLayer(this.dataLayers[i].layer);
			this.dataLayers.splice(i, 1);
			break;
		}
	}
}

StatArea.prototype.removeMapLayers = function(map) {
	for (var i = 0; i < this.dataLayers.length; i++) {
		map.removeLayer(this.dataLayers[i].layer);
	}
	
	this.dataLayers = [];
}

StatArea.prototype.createCenterMarker = function(latLng, map, statArea) {
	var marker = L.marker(latLng, { icon: center_icon, draggable:'true' }).addTo(map);
	//marker.bindPopup("leveys: " + INITIAL_LAT + ", pituus: " + INITIAL_LON);
	marker.bindPopup("Alue " + statAreaCount);

	if (this.type == 'circle') {
		marker.on('drag', function(event){
			var position = event.target.getLatLng();
			statArea.path.setLatLng(position);
			var text = statArea.getInfoText();
			featureInfoControl.update(text);
		});
	}
	else { // rectangle
		marker.on('drag', function(event){
			var position = event.target.getLatLng();
			var latLngBounds = getlatLngBounds(position, statArea.latRadius, statArea.lngRadius);
			statArea.path.setBounds(latLngBounds);
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

	marker.on('click', function(event){
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

	marker.on('dragend', function(event){
		var position = event.target.getLatLng();
		for(var i = 0; i < statAreas.length; i++) {
			if (statAreas[i].marker == this) {
				if (statAreas[i].type == "circle") {
					statAreas[i].path.setLatLng(position);
				}
				else {
					var latLngBounds = getlatLngBounds(position, statAreas[i].latRadius, statAreas[i].lngRadius);
					statAreas[i].path.setBounds(latLngBounds);
				}
				found = true
				statAreas[i].path.setStyle({
					weight: 5
				})
				statAreas[i].selected = true;
				if (statAreas[i].type == "circle") {
					console.log("updateDataOnArea", position.lat, position.lng);
					statArea.updateDataOnArea(position.lat, position.lng, { radius: statAreas[i].path.getRadius() });
				}
				else {
					var latLngBounds = statAreas[i].path.getBounds();
					statArea.updateDataOnArea(position.lat, position.lng, { east: latLngBounds.getEast(), south: latLngBounds.getSouth(), west: latLngBounds.getWest(), north: latLngBounds.getNorth() });
				}
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
	
	return marker;
}

StatArea.prototype.getDataOnArea = function() {

	var sizeFilter = null;
	if (this.type == "circle") {
		sizeFilter = { radius: this.path.getRadius() };
	}
	else {
		var latLngBounds = this.path.getBounds();
		sizeFilter = { east: latLngBounds.getEast(), south: latLngBounds.getSouth(), west: latLngBounds.getWest(), north: latLngBounds.getNorth() };
	}

	var valueArray = Array.apply(null, new Array(selectedCategories.length)).map(Number.prototype.valueOf,0); // array of zeros
	
	var series = geochart.addChartSeries(valueArray, this.name);

	for (var i = 0; i < selectedCategories.length; i++) {
		this.getDataOnCategory(selectedCategories[i], this.marker.getLatLng().lat, this.marker.getLatLng().lng, sizeFilter);
	}
}

StatArea.prototype.updateDataOnArea = function() {
	
	this.removeMapLayers(map);
	
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

