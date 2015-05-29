

$( document ).ready(function() {

    $('button').button().click(function (event) {
	event.preventDefault();
	//console.log(this);
	//console.log(event);
	if (this.id == '#play_days_button') {
	    play_demo(event);
	}
	else if(this.id == '#pause_days_button') {
            pause_demo(event);
        }
	else if(this.id == '#stop_days_button') {
            stop_demo(event);
        }
    });

    $( "#datepicker" ).datepicker();

    $("#hours_slider").rangeSlider({
        bounds: {
            min: 0,
            max: 24
        },
        defaultValues: {
            min: 0,
            max: 24
        }
    });


    $("#date_slider").dateRangeSlider({
	bounds: {
	    min: new Date(2015, 5, 1),
	    max: new Date(2015, 5, 30)
	},
	defaultValues: {
	    min: new Date(2015, 5, 19),
	    max: new Date(2015, 5, 28)
	}
    });

    $( "#time_scale_tabs" ).tabs({
	activate: function( event, ui ) {
	    var slider = $(ui.newPanel).find("#hours_slider");
	    if (slider.length > 0) {
		slider.rangeSlider("resize");
	    }
	    else {
		slider =  $(ui.newPanel).find("#date_slider");
		slider.dateRangeSlider("resize");
	    }
	}
    });
});

var opts = {
  lines: 13, // The number of lines to draw
  length: 10, // The length of each line
  width: 5, // The line thickness
  radius: 15, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#000', // #rgb or #rrggbb or array of colors
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: '0%', // Top position relative to parent
  left: '50%' // Left position relative to parent
};
var target = document.getElementById('spinner');
var spinner = new Spinner(opts).spin(target);

var meshes = [];
var circle_meshes = [];

var all_data = null;
var data_index = 0;

// For animation
var stopped = true;
var paused = false;
var tickCount = 0;

// For random disturbance report visualization
var road_point_locations = [];

var svg = undefined;

var xScale = undefined;
var yScale = undefined;
var colorFunction = undefined;

var terrainWidth = 120;
var terrainHeight = 80;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 45, $('#webgl').innerWidth() / $('#webgl').innerHeight(), 0.1, 1000 );
camera.position.set(0, -50, 50);
//camera.position.set(0, 0, 80);
//camera.lookAt(0, 0, 0);
//camera.position.z = 5;

var renderer = new THREE.WebGLRenderer({ alpha: true });
console.log($('#webgl').innerWidth());
console.log($('#webgl').innerHeight());
renderer.setSize( $('#webgl').innerWidth(), $('#webgl').innerHeight() );
//renderer.setSize( window.innerWidth, window.innerHeight );
//renderer.setClearColorHex( 0xffffff, 1 )
document.getElementById('webgl').appendChild( renderer.domElement );

var controls = new THREE.TrackballControls(camera, renderer.domElement);


var origTerrainWidth = 400;
var origTerrainHeight = 268;

var heightMap = new Array(origTerrainHeight);
for (var i = 0; i < origTerrainHeight; i++) {
    heightMap[i] = new Array(origTerrainWidth);
}

createChart();

var terrainLoader = new THREE.TerrainLoader();
terrainLoader.load('data/tampere.bin', function(data) {
    console.log(data);
    
    var geometry = new THREE.PlaneGeometry(120, Math.floor(120 * (267 / 399)), 399, 267);
    
    console.log(geometry.vertices.length);
    
    var j = 0;
    var k = 0;

    for (var i = 0, l = geometry.vertices.length; i < l; i++) {
	var height = data[i] / 65535 * 5;
	geometry.vertices[i].z = height;
	heightMap[j][k] = height;
	k++;
	if (k == origTerrainWidth) {
	    j++;
	    k = 0;
	}
    }
    
    console.log("done modifying z");
    
    var material = new THREE.MeshPhongMaterial({
	map: THREE.ImageUtils.loadTexture('images/tampere_terrain.png')
	//color: 0xdddddd, 
	//wireframe: true
    });
    
    var plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    
    scene.add(new THREE.AmbientLight(0xeeeeee));

    var $loading = $('#loading').hide();
        
    var projection = d3.geo.mercator()
	.translate([terrainWidth / 2, terrainHeight / 2])
	.scale((terrainHeight + terrainWidth) / 2 * 180)
	.rotate([-26, 0, 0])
	.center([23.75189 - 26, 61.48865]); // mercator: 8738897, 2644048;

    var red_material = new THREE.MeshBasicMaterial({
        color: 0xff0000
    });

    d3.csv("data/weather_stations.csv", function(data) {
	console.log(data);

	for (var i = 0; i < data.length; i++) {
	    var height = 0.1;
	    coord = projection([data[i].x, data[i].y]);
	    var boxGeometry = new THREE.BoxGeometry( 0.5, 0.5, height/*Math.floor(Math.random() * 5)*/ );
	    boxGeometry.dynamic = true;
	    var weather_box = new THREE.Mesh(boxGeometry, red_material );
	    var x = coord[0];
            x = Math.round(x / 120 * origTerrainWidth);
            var y = coord[1];
            y = Math.round(y / 80 * origTerrainHeight);
            if (x >= 0 && y >= 0 && x < origTerrainWidth && y < origTerrainHeight) {
                var tcoord = translate(coord);
                //weather_box.position.set(tcoord[0], tcoord[1], heightMap[y][x] + weather_box.scale.z *0.1);
		weather_box.position.set(tcoord[0], tcoord[1], height / 2 + heightMap[y][x]);
		weather_box.origPosition = weather_box.position.clone();
		meshes.push(weather_box);
		scene.add( weather_box );
	    }
	}
    });

    var green_material = new THREE.MeshBasicMaterial({
        color: 0x00ff00
    });
    
    d3.csv("data/traffic_stations.csv", function(data) {
        console.log(data);

        for (var i = 0; i < data.length; i++) {
	    var height = 0.1;
            coord = projection([data[i].x, data[i].y]);
	    var boxGeometry = new THREE.BoxGeometry( 0.5, 0.5, height/*Math.floor(Math.random() * 40)*/ );
	    boxGeometry.dynamic = true;
            var box = new THREE.Mesh( boxGeometry, green_material );
	    var x = coord[0];
	    x = Math.round(x / 120 * origTerrainWidth);
	    var y = coord[1];
	    y = Math.round(y / 80 * origTerrainHeight);
	    if (x >= 0 && y >= 0 && x < origTerrainWidth && y < origTerrainHeight) {
		var tcoord = translate(coord);
		box.position.set(tcoord[0], tcoord[1], height / 2 + heightMap[y][x]);
		box.origPosition = box.position.clone();
		meshes.push(box);
		scene.add( box );
	    }
        }
    });

    // TODO:
    // 1. Add roads
    // 2. Attach meshes to the plane
    // 3. Somehow also visualize traffic fluency
    // 4. Resize meshes, randomly(?) and make them look nicer
    // 5. Add statistics bars to the page for each category (weather, LAM, traffic fluency)
    // 6. Add legend for the categories
    // 7. Add somekind UI controls (as an image) for selecting what categories are visualized, from which time frame,
    // and at which speed, time speed is from hours to days
    // 8. Screen capture to the plan from two times one following the other
    // ?. Liikennetiedotteet

    $.getJSON("/data/tampere_roads.json", function(data) {
	console.log(data);

	var material = new THREE.LineBasicMaterial({
	    color: 0xffffff,
	    linewidth: 2
	});

	for (var i = 0; i < data.features.length; i++) {
	    if (data.features[i].geometry.type == 'LineString') {
		var geometry = new THREE.Geometry();
		var coordinates = data.features[i].geometry.coordinates;
		for (var j = 0; j < coordinates.length; j++) {
		    coord = projection([coordinates[j][0], coordinates[j][1]]);
		    var x = coord[0];
		    x = Math.round(x / 120 * origTerrainWidth);
		    var y = coord[1];
		    y = Math.round(y / 80 * origTerrainHeight);
		    if (x >= 0 && y >= 0 && x < origTerrainWidth && y < origTerrainHeight) {
			var tcoord = translate(coord);
			var vector = new THREE.Vector3(tcoord[0], tcoord[1], heightMap[y][x] + 0.1 * heightMap[y][x]);
			geometry.vertices.push(vector);
			road_point_locations.push(vector);
		    }
		}
		var line = new THREE.Line(geometry, material);
		scene.add(line);
	    }
	}
    });

    /*coord = translate(projection([23.743183, 61.504961]));// Näsinneula 61.504961, 23.743183
    console.log(coord);

    var material = new THREE.MeshBasicMaterial({
	color: 0x00ffff
    });
    var radius = 0.2;
    var segments = 32;    
    var circleGeometry = new THREE.CircleGeometry( radius, segments );
    console.log(circleGeometry.vertices.length);
    var circle = new THREE.Mesh( circleGeometry, material );
    //circle.position.set(60, 40, 6); // top left corner above map    
    //scene.add( circle );

    circle.position.set(coord[0], coord[1], 3.3);
    scene.add( circle );*/

    /*var position = { x : coord[0], y: coord[1] };
    var target = { x : 60, y: 40 };
    var tween = new TWEEN.Tween(position).to(target, 10000);
    tween.easing(TWEEN.Easing.Elastic.InOut);

    tween.onUpdate(function(){
	circle.position.x = position.x;
	circle.position.y = position.y;
	//console.log(circle.position.x);
    });

    tween.start();*/
});

function render() {
    controls.update();
    requestAnimationFrame(render);
    //updateMeshes();
    //TWEEN.update();
    renderer.render(scene, camera);
}

render();


function translate(point) {
  return [point[0] - (terrainWidth / 2), (terrainHeight / 2) - point[1]];
}

function createChart() {

    var margin = {top: 20, right: 20, bottom: 100, left: 80},
    width = $('#chart').width() - margin.left - margin.right,
    height =  $('#chart').height() - margin.top - margin.bottom;
    
    svg = d3.select("#chart").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv("/data/sample_digi_data_1.tsv", function(error, data) {

	data.forEach(function(d) {
	    d.disturbance_reports = +d.disturbance_reports;
	    d.weather_observations = +d.weather_observations;
	    d.lam_observations = +d.lam_observations;
	});

	all_data = data;

	xScale = d3.scale.ordinal()
	    .domain(data.map(function(d) { return d.date; }))
	    .rangeRoundBands([0, width], .1);

	yScale = d3.scale.linear()
	    .domain([0, d3.max(data, function(d) { return d.disturbance_reports + d.weather_observations + d.lam_observations; })])
	    .range([height, 0]);

	colorFunction = d3.scale.ordinal()
	    .domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }))
	    .range(["#ff0000", "#00ff00", "#0000ff"]);

	var xAxis = d3.svg.axis()
	    .scale(xScale)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(yScale)
	    .orient("left")
	    //.tickFormat(d3.format(".2s"))
	    .ticks(5);

	data.forEach(function(d) {
	    var y0 = 0;
	    d.amounts = colorFunction.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
	});

	svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(xAxis)
	    .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
            });

	svg.append("g")
	    .attr("class", "y axis")
	    .call(yAxis)
	    .append("text")
	    .attr("transform", "translate(-75, 0)rotate(-90)")
	    .attr("y", 16)
	    .attr("dy", ".71em")
	    .style("text-anchor", "end")
	    .text("Amounts");
	

	/*bar.selectAll("rect")
	    .data(function(d) { return d.amounts; })
	    .enter().append("rect")
	    .attr("class", "bar")
	    .attr("width", x.rangeBand())
	    .attr("y", function(d) { return y(d.y1); })
	    .attr("height", function(d) { return y(d.y0) - y(d.y1); })
	    .style("fill", function(d) { return color(d.name); });*/


	margin = {top: 10, right: 10, bottom: 10, left: 10},
	width = $('#legend').width() - margin.left - margin.right,
	height =  $('#legend').height() - margin.top - margin.bottom;

	var legendSVG = d3.select("#legend").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var legend = legendSVG.selectAll(".legend")
	    .data(colorFunction.domain().slice().reverse())
	    .enter().append("g")
	    .attr("class", "legend")
	    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	legend.append("rect")
	    .attr("x", width - 28)
	    .attr("width", 18)
	    .attr("height", 18)
	    .style("fill", colorFunction);
	
	legend.append("text")
	    .attr("x", width - 34)
	    .attr("y", 9)
	    .attr("dy", ".35em")
	    .style("text-anchor", "end")
	    .text(function(d) { var title = d.replace("_", " "); title = title.charAt(0).toUpperCase() + title.slice(1); return title});

	$('#time_view').css('visibility', 'visible');

    });

}

function play_demo(event) {
    //console.log("Play button clicked");
    //console.log(event);

    if (stopped) {
	reset();
	stopped = false;
	createjs.Ticker.addEventListener("tick", tick);
	createjs.Ticker.setInterval(1500);
    }
    else if (paused) {
	paused = false;
	createjs.Ticker.addEventListener("tick", tick);
	createjs.Ticker.setInterval(1500);
    }
}

function pause_demo(event) {
    //console.log("pause");
    if (paused == false) {
	createjs.Ticker.off("tick", tick);
	createjs.Ticker.setInterval(0);
	paused = true;
    }
    else {
	paused = false;
	createjs.Ticker.addEventListener("tick", tick);
        createjs.Ticker.setInterval(1500);
    }
}

function stop_demo(event) {
    createjs.Ticker.off("tick", tick);
    stopped = true;

    reset();
}

function reset() {
    svg.selectAll(".g")
        .data([]).exit().remove();

    tickCount = 0;
    data_index = 0;

    for (var i = 0; i < circle_meshes.length; i++) {
	scene.remove(circle_meshes[i]);
    }
    circle_meshes = [];

    for (var i = 0; i < meshes.length; i++) {
        meshes[i].scale.z = 1;
        meshes[i].position.z = meshes[i].origPosition.z;
        meshes[i].geometry.verticesNeedUpdate = true;
    }
    createjs.Ticker.setInterval(0);    
}

function tick(event) {

    //console.log(paused);
    if (paused) {
	return;
    }
    
    if (++tickCount >= all_data.length) {
	createjs.Ticker.off("tick", tick);
	stopped = true;
    }

    var data = all_data.slice(0, ++data_index);

    var bar = svg.selectAll(".g")
	.data(data)
	.enter().append("g")
	.attr("class", "g")
	.attr("transform", function(d) { return "translate(" + xScale(d.date) + ",0)"; });

    //console.log(data);

    bar.selectAll(".bar")
        .data(function(d) { /*console.log(d.amounts);*/ return d.amounts; })
        .enter().append("rect")
        .attr("class", "bar")
        .attr("width", xScale.rangeBand())
	.attr("height", function(d) { return 0; })
	.attr("y", function(d) { return yScale(d.y0); })
        .style("fill", function(d) { return colorFunction(d.name); })
	.transition()
	.duration(1000)
        .attr("y", function(d) { return yScale(d.y1); })
        .attr("height", function(d) { return yScale(d.y0) - yScale(d.y1); });

    updateMeshes(data[data.length - 1].disturbance_reports);
}

function updateMeshes(disturbance_report_count) {
    //console.log(meshes[0].scale.z);
    //console.log(scene.children);
    //console.log(disturbance_report_count);

    var scale = 30;
    
    for (var i = 0; i < meshes.length; i++) {
	//console.log(meshes[i].position);
	// Calculate position based on the original size and the previous scale.
	var position = meshes[i].position.z + 0.1 * (meshes[i].scale.z + scale) / 2 - (meshes[i].scale.z > 1 ? 0.1 * meshes[i].scale.z / 2 : 0);
	//console.log(position);
	meshes[i].scale.z += scale;
	meshes[i].position.z = position;
	meshes[i].geometry.verticesNeedUpdate = true;	
    }

    var radius = 1;
    var segments = 32;
    var circleGeometry = new THREE.CircleGeometry( radius, segments );
    var material = new THREE.MeshBasicMaterial({
        color: 0x0000ff
    });
    
    var count = Math.floor(disturbance_report_count / 10);
    for (var i = 0; i < count; i++) {
	var location_index = Math.floor(Math.random() * road_point_locations.length);
	var circle = new THREE.Mesh( circleGeometry, material );
	circle.position.set(road_point_locations[location_index].x, road_point_locations[location_index].y, road_point_locations[location_index].z + 0.1 * road_point_locations[location_index].z);
	circle_meshes.push(circle);
	scene.add( circle );
    }
}
