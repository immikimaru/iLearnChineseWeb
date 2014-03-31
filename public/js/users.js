$(document).ready(function () {
    $.getJSON( '/api/users', function( data ) {
        console.log(data);
        $.each(data,function( key,value ) {
	    $.getJSON( 'http://graph.facebook.com/'+value.fbId+'?fields=cover', function( data ) {
		console.log(data);
		if (!data.cover)
		    source = "http://lorempixel.com/g/720/550/";
		else
		    source = data.cover.source;
		$('section#users').append('<div class="user col-lg-2" id="'+ value._id +
					  '"><div class="cover-photo" style="position:relative;height:150px;overflow:hidden;"><div style="position:absolute;margin-left:10px; margin-top:10px;"><img class="img-circle pull-left" style="width:80px;height:80px;border: 4px solid rgba(255,255,255,0.5);" src="http://graph.facebook.com/'+ value.fbId +'/picture?type=large" ><div class="user-name pull-left" style="color:#fff;font-weight:bold;font-size:1.1em;background-color:rgba(0,0,0,0.7);padding:5px;margin-top:20px;border-radius:5px;margin-left:10px;">'+ value.name+'</div><div class="clearfix"></div></div><img class="img-responsive" src="'+ source +'" alt="'+ value.name  +'" ></div></div>');
	    });				 
        });
    });
});

