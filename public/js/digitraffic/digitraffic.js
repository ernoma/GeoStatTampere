$(document).on('pagecreate','[data-role=page]', function(){
    console.log('PAGECREATE');
    
    $.getJSON("/roadweather.json", function(response) {
	console.log(response);
        //parsed_response = JSON.parse(response);
        //console.log(parsed_response);
    });
});
