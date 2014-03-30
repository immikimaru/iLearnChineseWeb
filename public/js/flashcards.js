function loadNewCard(level,userId){
    $.getJSON( '/api/'+userId+'/level/'+level, function( data ) {
        console.log(data);
        $( '.loader' ).fadeOut();
        $( '.ilc-card .title').empty().append(data.chs);
	$( '.ilc-card #hanziId').val(data._id);
	if (data.isLearned){
	    $( '.ilc-card .title').addClass( "isLearned" );
	}
	else
	    $( '.ilc-card .title').removeClass( "isLearned" );
    });
}

$(document).ready(function () {

    var pathArray = window.location.pathname.split( '/' );
    var uid =  $( '#userId').val();
    console.log(uid);

    if (pathArray[1] == "flashcards" && pathArray[2] == "level" &&  pathArray[3] != "" && uid != "")
	{
	    var level =  pathArray[3];
	    loadNewCard(level,uid);

	    $( ".ilc-card #next" ).click(function() {
		loadNewCard(level,uid);
	    });

	    $( ".ilc-card #learned" ).click(function() {
		var uid =  $( '#userId').val();
		var hid =  $( '.ilc-card #hanziId').val();
		$.ajax({
		    type: "POST",
		    url: '/api/'+uid+'/addLearned/'+hid,
		    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
		});
		//loadNewCard(level,uid);
		$( '.ilc-card .title').addClass( "isLearned" );
            });
	}
});
