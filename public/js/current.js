$(document).ready(function () {

    $("div.dashboard-elem").bind('click', function(){
	alert($(this).attr('id'));
	var link = "/flashcards/level/"+$(this).attr('id');
	window.location = link;
    });

});