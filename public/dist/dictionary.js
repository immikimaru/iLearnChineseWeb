$(document).ready(function () {
    $.getJSON( '/api/hanzi', function( data ) {
	console.log(data);
	$.each(data,function( key,value ) {
	    $('section#dictionary').append('<div class="word">'+value.chs+'</div>');
	});
    });
});
