$(document).ready(function () {
    var userId = $('#userId').val();
//    $( ".dashboard-elem" ).each(function( index ) {
//	var idLevel = $( this ).attr("id");
	$.getJSON( '/api/'+userId+'/count/'+"HSK1", function( data ) {
	    console.log(data);
//	    $( ".dashboard-elem#"+idLevel+" .meter" ).empty().append(data.count);
	});
//    });
});
