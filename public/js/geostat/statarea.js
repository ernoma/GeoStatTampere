
function StatArea(path, type, marker, selected, name, radius, color) {
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
	name = newName;
}

StatArea.prototype.getInfoText = function() {

	var center = this.path.getBounds().getCenter();

	return "<p><i>Voit raahata alueen toiseen paikkaan tästä.</i></p>" +
		"<p>Alueen keskipiste:<br>(leveys, pituus) = (" + center.lat.toFixed(6) + ", " + center.lng.toFixed(6) + ")</p>";
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
