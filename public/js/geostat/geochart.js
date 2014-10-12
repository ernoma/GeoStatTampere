
var geochart = {
	removeChartSeries: function (statAreas) {
		var series = [];
		var chart = $("#chart_container").highcharts()
		for(var i = 0; i < chart.series.length; i++) {
			for(var j = 0; j < statAreas.length; j++) {
				if (chart.series[i].name == statAreas[j].name) {
					series.push(chart.series[i]);
					break;
				}
			}
		}
		for (var i = 0; i < series.length; i++) {
			series[i].remove( false );
		}
		chart.redraw();
	},
	addChartSeries: function(counts, name) {
		var chart = $("#chart_container").highcharts();
		
		//console.log("series length: " + chart.series.length)
		
		var series = chart.addSeries({
			name: name,
			data: counts
		})
		
		//console.log(chart.series)
		
		return series;
	},
	renameChartSeries: function(oldName, newName) {
		var chart = $("#chart_container").highcharts();
		for(var i = 0; i < chart.series.length; i++) {
			if (chart.series[i].name == oldName) {
				chart.series[i].update({name: newName}, false);
				chart.redraw();
				break;
			}
		}
	},
	addCategory: function(name) {
		var chart = $("#chart_container").highcharts()
		var categories = chart.xAxis[0].categories;
        categories.push(name);
		//console.log("categories", categories);
        chart.xAxis[0].setCategories(categories);
		//console.log("chart.xAxis[0].categories", chart.xAxis[0].categories);
		for(var i = 0; i < chart.series.length; i++) {
			chart.series[i].addPoint(0);
		}
	},
	removeCategory: function(name) {
		var chart = $("#chart_container").highcharts();
				
		for(var i = 0; i < chart.series.length; i++) {
		
			var seriesData = [];
			
			for (var j = 0; j < chart.series[i].data.length; j++) {
				if (chart.series[i].data[j].category != name) {
					seriesData.push(chart.series[i].data[j].y);
				}
			}
			
			chart.series[i].setData(seriesData, false);
		}
		
		var categories = chart.xAxis[0].categories;
        categories.splice( $.inArray(name, categories), 1 );
		//console.log("categories", categories);
		//console.log(chart.xAxis.length);
        chart.xAxis[0].setCategories(categories, false);
		//console.log("setCategories called");
		// chart.addAxis({
			// categories: categories
		// }, true);
		// chart.xAxis[0].remove(false);
		//console.log("calling chart.redraw();");
		
		chart.redraw();
		//console.log("called chart.redraw();");
	},
	updateSeriesCategory: function(categoryName, seriesName, count) {
		var chart = $("#chart_container").highcharts();
		for (var i = 0; i < chart.series.length; i++) {
			if (chart.series[i].name == seriesName) {
				//console.log("found series")
				for (var j = 0; j < chart.series[i].data.length; j++) {
					//console.log(chart.series[i].data[j].category);
					if (chart.series[i].data[j].category == categoryName) {
						//console.log("updating")
						chart.series[i].data[j].update(count);
						return;
					}
				}
			}
		}
	},
	recolorSeries: function(seriesName, color) {
		var chart = $("#chart_container").highcharts();
		for (var i = 0; i < chart.series.length; i++) {
			if (chart.series[i].name == seriesName) {
				chart.series[i].update({
					color: color
				});
				break;
			}
		}
	}
}

$(function() {
	$("#chart_container").highcharts({
        chart: {
            type: 'column',
			borderWidth: 1,
			style: {
				'-webkit-backface-visibility': 'hidden' // due to chrome 37 "Layer squashing issues"
			},
			//marginBottom: 200
        },
        title: {
            text: 'Alueiden tilastot'
        },
		lang: {
			noData: 'Et ole lisännyt kartalle alueita tai valinnut yhtään näytettävää aineistoa' // vaihtoehtoisesti näytä teksti "et ole valinnut yhtään verrattavaa kategoriaa"
		},
		xAxis: {
			categories: [],
			labels: {
				staggerLines: 3
				//maxStaggerLines: 3
				//step: 1,
				//overflow: 'justify'
				//rotation: -45,
				//align: 'right'
			}
		},
		yAxis: {
			min: 0,
            title: {
                text: 'Lukumäärä'
            }
        }
	})
});
