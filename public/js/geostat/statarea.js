
function StatArea(path, type, marker, selected, name, radius) {
	this.path = path;
	this.type = type;
	this.marker = marker;
	this.selected = selected;
	this.name = name;
	if (type == "circle") {
		this.radius = radius;
	}
	else {
		this.latRadius = radius;
		this.lngRadius = radius;
	}
	
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
	name = newName;
}

StatArea.prototype.createMapLayer = function(map, category, geoJsonObject) {
	
	var layerGroup = L.layerGroup();
	
	console.log("createMapLayer", geoJsonObject);
	console.log("category", category);
	
	for (var i = 0; i < geoJsonObject.features.length; i++) {
		if (geoJsonObject.features[i].geometry.type == "Point") {
			var marker = L.marker([geoJsonObject.features[i].geometry.coordinates[1], geoJsonObject.features[i].geometry.coordinates[0]],
				{ icon: category.icon });
			layerGroup.addLayer(marker);
		}
		else if (geoJsonObject.features[i].geometry.type == "Polygon") {
			var latLngArray = [];
			for (var j = 0; j < geoJsonObject.features[i].geometry.coordinates[0].length; j++) {
				var latLng = L.latLng(geoJsonObject.features[i].geometry.coordinates[0][j][1], geoJsonObject.features[i].geometry.coordinates[0][j][0]);
				//console.log(latLng);
				latLngArray.push(latLng);
			}
			//console.log("L.polygon(latLngArray).getBounds().getCenter()", L.polygon(latLngArray).getBounds().getCenter());
			var marker = L.marker(L.polygon(latLngArray).getBounds().getCenter(), { icon: category.icon });
			layerGroup.addLayer(marker);
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
