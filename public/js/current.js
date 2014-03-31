$(document).ready(function () {

    $("div.dashboard-elem").bind('click', function(){
	var link = "/flashcards/level/"+$(this).attr('id');
	window.location = link;
    });

    $('.ajst #notifications').popover({
	html : true,
	content : "3 notifications blq dd fdsfd sfds <br>Wait for improvements",
	placement : "bottom"
    });

});