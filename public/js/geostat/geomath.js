
function is_inside_circle(latlng, circle) {

	var lat1 = latlng.lat;
	var lat2 = circle.getLatLng().lat;
	var lng1 = latlng.lng;
	var lng2 = circle.getLatLng().lng;

	var dist = getDistanceFromLatLonInMeters(lat1, lng1, lat2, lng2);
	
	console.log(dist);
	console.log(circle.getRadius());
	
	return dist <= circle.getRadius();
}

function is_inside_rectangle(latlng, rectangle) {
	return rectangle.getBounds().contains(latlng);
}

//
// Distance constant from http://gis.stackexchange.com/questions/19760/how-do-i-calculate-the-bounding-box-for-given-a-distance-and-latitude-longitude
//
function getlatLngBounds(latLng, latRadiusInMeters, lngRadiusInMeters) {
	// console.log("latRadiusInMeters: " + latRadiusInMeters);
	// console.log("lngRadiusInMeters: " + lngRadiusInMeters);
	
	var latLngInETRS = proj4(wgs84Proj4, etrsgk24Proj4, [latLng.lng, latLng.lat]);
	// console.log("latLngInETRS: " + latLngInETRS);
	
	var minLatInETRS = latLngInETRS[1] - latRadiusInMeters;
	var maxLatInETRS = latLngInETRS[1] + latRadiusInMeters;
	var minLngInETRS = latLngInETRS[0] - lngRadiusInMeters;
	var maxLngInETRS = latLngInETRS[0] + lngRadiusInMeters;
	// console.log("minLatInETRS: " + minLatInETRS);
	// console.log("maxLatInETRS: " + maxLatInETRS);
	// console.log("minLngInETRS: " + minLngInETRS);
	// console.log("maxLngInETRS: " + maxLngInETRS);
	
	var minLatLngInWGS84 = proj4(etrsgk24Proj4, wgs84Proj4, [minLngInETRS, minLatInETRS]);
	var maxLatLngInWGS84 = proj4(etrsgk24Proj4, wgs84Proj4, [maxLngInETRS, maxLatInETRS]);
	// console.log("minLatLngInWGS84: " + minLatLngInWGS84);
	// console.log("maxLatLngInWGS84: " + maxLatLngInWGS84);

	var minLat = minLatLngInWGS84[1];
	var maxLat = maxLatLngInWGS84[1];
	var minLng = minLatLngInWGS84[0];
	var maxLng = maxLatLngInWGS84[0];
	// console.log("minLat: " + minLat);
	// console.log("maxLat: " + maxLat);
	// console.log("minLng: " + minLng);
	// console.log("maxLng: " + maxLng);
	
	console.log("dist lat: " + getDistanceFromLatLonInMeters(minLat, minLng, maxLat, minLng));
	console.log("dist lng: " + getDistanceFromLatLonInMeters(minLat, minLng, minLat, maxLng));
	
	return L.latLngBounds(L.latLng(minLat, minLng), L.latLng(maxLat, maxLng));
}

//
// From http://stackoverflow.com/questions/27928/how-do-i-calculate-distance-between-two-latitude-longitude-points
//
function getDistanceFromLatLonInMeters(lat1,lon1,lat2,lon2) {
  var R = 6371*1000; // Radius of the earth in m
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance inm
  return d;
}
function deg2rad(deg) {
  return deg * (Math.PI/180);
}

// $c = false; 

// $vertices_x = array(22.333,22.222,22,444);  //latitude points of polygon
// $vertices_y = array(75.111,75.2222,76.233);   //longitude points of polygon
// $points_polygon = count($vertices_x); 
// $longitude =  23.345; //latitude of point to be checked
// $latitude =  75.123; //longitude of point to be checked

// if (is_in_polygon($points_polygon, $vertices_x, $vertices_y, $longitude, $latitude)){
    // echo "Is in polygon!"."<br>";
// }
// else { 
    // echo "Is not in polygon"; 
// }

// function is_in_polygon($points_polygon, $vertices_x, $vertices_y, $longitude_x, $latitude_y) {
    // $i = $j = $c = 0;

    // for ($i = 0, $j = $points_polygon-1; $i < $points_polygon; $j = $i++) {
        // if (($vertices_y[$i] >  $latitude_y != ($vertices_y[$j] > $latitude_y)) && ($longitude_x < ($vertices_x[$j] - $vertices_x[$i]) * ($latitude_y - $vertices_y[$i]) / ($vertices_y[$j] - $vertices_y[$i]) + $vertices_x[$i])) {
            // $c = !$c;
        // }
    // }

    // return $c;
// }
