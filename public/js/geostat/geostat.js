
var INITIAL_LAT = 61.5;
var INITIAL_LON = 23.766667;

var DEFAULT_ZOOM = 13;
var DEFAULT_BASEMAP_NAME = "osm";

var statAreas = [];
var selectedCategories = [];

var osmLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    maxZoom: 19
});
var osmCycleLayer = L.tileLayer('http://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Maps &copy; <a href="http://thunderforest.com/">Thunderforest</a>',
    maxZoom: 18
});
var mapBoxLayer = L.tileLayer('http://{s}.tiles.mapbox.com/v3/' + api_keys.mapbox + '/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 20
});
var mapQuestLayer = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg', {
	subdomains: '1234',
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">',
    maxZoom: 19
});
var stamenTonerLayer = L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.jpg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>. Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>',
    maxZoom: 20
});
var mmlPerusLayer = L.tileLayer('http://tiles.kartat.kapsi.fi/peruskartta/{z}/{x}/{y}.jpg', {
    attribution: 'Sisältää Maanmittauslaitoksen peruskartta-aineistoa, <a href="http://www.maanmittauslaitos.fi/avoindata_lisenssi_versio1_20120501">lisenssi</a>, TMS: <a href="http://kartat.kapsi.fi/">kartat.kapsi.fi</a>',
    maxZoom: 18
});
var mmlTaustaLayer = L.tileLayer('http://tiles.kartat.kapsi.fi/taustakartta/{z}/{x}/{y}.jpg', {
    attribution: 'Sisältää Maanmittauslaitoksen taustakartta-aineistoa, <a href="http://www.maanmittauslaitos.fi/avoindata_lisenssi_versio1_20120501">lisenssi</a>, TMS: <a href="http://kartat.kapsi.fi/">kartat.kapsi.fi</a>',
    maxZoom: 18
});
var mmlOrtoLayer = L.tileLayer('http://tiles.kartat.kapsi.fi/ortokuva/{z}/{x}/{y}.jpg', {
    attribution: 'Sisältää Maanmittauslaitoksen ortoilmakuva-aineistoa, <a href="http://www.maanmittauslaitos.fi/avoindata_lisenssi_versio1_20120501">lisenssi</a>, TMS: <a href="http://kartat.kapsi.fi/">kartat.kapsi.fi</a>',
    maxZoom: 19,
	minZoom: 13
});
var treGuideLayer = L.tileLayer.wms('http://opendata.navici.com/tampere/ows?service=wms', {
	attribution: 'Sisältää Tampereen kaupungin <a href="http://palvelut2.tampere.fi/tietovaranto/tietovaranto.php?id=136&alasivu=1&vapaasana=">"Tampereen opaskartta"</a>-aineistoa, <a href="http://www.tampere.fi/avoindata/lisenssi">lisenssi</a>',
	maxZoom: 18,
	layers: 'opendata:tampere_okartta_gk24',
	version: '1.3.0'
});
var treBaseLayer = L.tileLayer.wms('http://opendata.navici.com/tampere/ows?service=wms', {
	attribution: 'Sisältää Tampereen kaupungin <a href="http://palvelut2.tampere.fi/tietovaranto/tietovaranto.php?id=137&alasivu=1&vapaasana=">"Tampereen kantakartta ilman kiinteistörajoja"</a>-aineistoa, <a href="http://www.tampere.fi/avoindata/lisenssi">lisenssi</a>',
	maxZoom: 20,
	layers: 'opendata:tampere_kkartta_pohja_gk24',
	version: '1.3.0'
});

var baseMapIdentifiers = [{
	name: "osm",
	layer: osmLayer
	}, {
	name: "cycle",
	layer: osmCycleLayer
	}, {
	name: "mapbox",
	layer: mapBoxLayer
	}, {
	name: "mapquest",
	layer: mapQuestLayer
	}, {
	name: "stamen",
	layer: stamenTonerLayer
	}, {
	name: "orto",
	layer: mmlOrtoLayer
	}, {
	name: "treguide",
	layer: treGuideLayer
	}, {
	name: "trebase",
	layer: treBaseLayer
	}
];

var map = L.map('map_canvas', {layers: [osmLayer]}).setView([INITIAL_LAT, INITIAL_LON], 13);

map.on('zoomend', function(e) {
	console.log("zoom: " + map.getZoom());
	
	handleHistory("zoom");
});

$('#home .tab_switch_a a').click(function (e) {
  e.preventDefault();
  $(this).tab('show');
});
$('#data_selections_div .tab_switch_a a').click(function (e) {
  e.preventDefault();
  $(this).tab('show');
});
$('#about .tab_switch_a a').click(function (e) {
  e.preventDefault();
  $(this).tab('show');
});

$( document ).ready(function() {
	
	var cardView = false;

	// if ($(window).width() < 640) {
		// cardView = true;
	// }
	
	var dataTableColumns = [
		{field: 'state', checkbox: true},
		{field: 'name', title: 'Aineisto', sortable: true},
		{field: 'producer', title: 'Tuottaja', sortable: true},
		{field: 'keyword1', title: 'Avainsana 1', sortable: true},
		{field: 'keyword2', title: 'Avainsana 2', sortable: true},
		{field: 'note', title: 'Huomiot', sortable: false},
		{field: 'mapSymbol', title: 'Karttamerkinnät', sortable: false, halign: 'center'}
	];
	
	$('#data_selections_table').bootstrapTable({
		cardView: cardView,
		columns: dataTableColumns,
		data: categories,
		sortName: "name",
		onCheck: function(row) {
			//console.log('onCheck', row);
			for (var i = 0; i < categories.length; i++) {
				if (categories[i].name == row.name) {
					selectedCategories.push(categories[i]);
					break;
				}
			}
			geochart.addCategory(row.name);
			
			for (var i = 0; i < statAreas.length; i++) {
				statAreas[i].getDataOnCategory(selectedCategories[selectedCategories.length-1]);
			}
			
			handleHistory('cat', row.name);
		},
		onUncheck: function(row) {
			//console.log('onUncheck', row);
			for (var i = 0; i < selectedCategories.length; i++) {
				if (selectedCategories[i].name == row.name) {
					selectedCategories.splice(i, 1);
					break;
				}
			}
			console.log('selectedCategories', selectedCategories);
			for (var i = 0; i < statAreas.length; i++) {
				statAreas[i].removeDataLayer(map, row.name);
			}
			geochart.removeCategory(row.name);
			
			handleHistory('catremove', row.name);
		},
		onCheckAll: function() {
			//console.log('onCheckAll');
			
			for (var i = 0; i < categories.length; i++) {
				
				var found = false;
				
				for (var j = 0; j < selectedCategories.length; j++) {
					if (selectedCategories[j].name == categories[i].name) {
						found = true;
						break;
					}
				}
				if (!found) {
					selectedCategories.push(categories[i]);
					geochart.addCategory(categories[i].name);
					
					for (var j = 0; j < statAreas.length; j++) {
						statAreas[j].getDataOnCategory(selectedCategories[selectedCategories.length-1]);
					}
					
					handleHistory('cat', categories[i].name);
				}
			}
		},
		onUncheckAll: function() {
			//console.log('onUncheckAll');
			for (var i = 0; i < statAreas.length; i++) {
				statAreas[i].removeAllDataLayers(map);
			}
			for (var i = 0; i < selectedCategories.length; i++) {
				geochart.removeCategory(selectedCategories[i].name);
			}
			selectedCategories = [];
			
			handleHistory('catallremove');
		}
	});
	
	$('#data_selections_table').bootstrapTable('checkAll');
});

var spinnerOpts = {
  lines: 10, // The number of lines to draw
  length: 6, // The length of each line
  width: 3, // The line thickness
  radius: 6, // The radius of the inner circle
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
  top: '50%', // Top position relative to parent
  left: '0' // Left position relative to parent
};
var target = document.getElementById('spinner');
var spinner = new Spinner(spinnerOpts);
//spinner.spin(target);

$(document)
  .ajaxStart(function () {
    spinner.spin(target);
	//console.log("spin");
  })
  .ajaxStop(function () {
     spinner.stop();
	 //console.log("all done");
  });

$('#map_row').resizable({
	handles: 's', 
	resize: function(event, ui) {
		var mapHeight = ui.element.height();
		var parentHeight = ui.element.parent().height();
		$('#chart_row').css('height', (parentHeight - mapHeight) + 'px');
		var chart = $("#chart_container").highcharts();
		chart.reflow();
		map.invalidateSize();
	}
});

$( window ).resize( function(e) {
	//$('#map_row').redraw();
	if (e.target == window) {
		var mapHeight =  $('#map_row').height();
		var chartHeight = $('#chart_row').height();
		var parentHeight = $('#map_row').parent().height();
		$('#map_row').css('height', (parentHeight / 2) + 'px');
		$('#chart_row').css('height', (parentHeight / 2) + 'px');
		var chart = $("#chart_container").highcharts();
		chart.reflow();
		map.invalidateSize();
		
		// if (mapHeight > chartHeight) {
			// var division = chartHeight / mapHeight;
			// $('#map_row').css('height', (parentHeight * (1 - division)) + 'px');
			// $('#chart_row').css('height', (parentHeight * division) + 'px');
		// }
		// else {
			// var division = mapHeight / chartHeight;
			// $('#chart_row').css('height', (parentHeight * (1 - division)) + 'px');
			// $('#map_row').css('height', (parentHeight * division) + 'px');
		// }
	}
});

