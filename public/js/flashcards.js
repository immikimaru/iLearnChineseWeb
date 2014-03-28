$(document).ready(function () {

    var pathArray = window.location.pathname.split( '/' );
    console.log(pathArray);
    
    if (pathArray[1] == "flashcards" && pathArray[2] == "level" &&  pathArray[3] != "")
	{
	    var level =  pathArray[3];
	    console.log(level);
	    $.getJSON( "/hanzi/level/"+level, function( data ) {
		console.log(data);
		$( '.loader' ).hide();
		$( '.ilc-card .title').append(data.chs);

	    });
	}
});
