$(document).ready(function () {

    $("div.dashboard-elem").bind('click', function(){
	var link = "/flashcards/level/"+$(this).attr('id');
	window.location = link;
    });

});