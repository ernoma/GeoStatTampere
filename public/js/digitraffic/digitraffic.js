
var nextId = 0;

$(document).on('pagecreate','[data-role=page]', function(){
    console.log('PAGECREATE');
    
    $.getJSON("/roadweather.json", function(response) {
		console.log(response);
        //parsed_response = JSON.parse(response);
        //console.log(parsed_response);

        nextId++;

        var content = "<div data-role='collapsible' id='set" + nextId + "'><h3>Road weather</h3>";

        

        content += "</div>";

        $( "#result_set" ).append( content ).collapsibleset( "refresh" );
    });
});
