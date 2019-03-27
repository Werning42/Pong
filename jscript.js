$(function(){
//Le bouton jouer redirige sur la page du jeu
$("#inJouer").click(function(){
	$("#menuAccueil").css("display", "none");
	window.location.href = "jeu/index.html";
});


//Le bouton Options cache le menu principal et fait apparaitre le menu options grâce à une suite de
//display none et display block, le système est le même pour chaque bouton
$("#inOptions").click(function(){
	$("#menuAccueil").css("display", "none");
	$("#menuOptions").css("display", "block");
	$("#menuOptions").css("opacity","0");
	$("#menuOptions").css("margin-top","300px");
	$("#menuOptions").animate({opacity : '1'},'slow');
	$("#inMuteOn").css("display", "none");
	$("#inReturn2").click(function(){
		$("#menuOptions").css("display", "none");
		$("#menuAccueil").css("display","block");
		$("#menuAccueil").css("opacity","0");
		$("#menuAccueil").animate({opacity : '1'},'slow');
	});
});

$("#inEnSavPlus").click(function(){
	$("#menuAccueil").css("display", "none");
	$("body").append("<div id='savPlus' style='opacity:0;text-align:center;color:white;font-size:21.5px;display:block;margin:0 auto; width:400px;margin-top:200px;'><h1>Projet DTA Pong customisé</h1><p>Ce projet à été créé le 12 Novembre 2018 par Pierrick et Tony, il a été finalisé le 28 Novembre.<br><br>Il s'agit de créer un jeu vidéo basé sur pong et de le customiser afin de<br>gagner en expérience avec les différents langages de codage.<br>Nous avons choisi d'utiliser jQuery 3.3.1, HTML5 et CSS3. </p><input style='margin:0 auto;' type='button' id='inReturn3' value='Retour'></div>");
	$("#savPlus").css("opacity","0");
	$("#savPlus").animate({opacity : '1'},'slow');	
	$("#inReturn3").click(function(){
		$("#savPlus").remove("");
		$("#menuAccueil").css("display","block");
		$("#menuAccueil").css("opacity","0");
		$("#menuAccueil").animate({opacity : '1'},'slow');
	});
})

//-------------------------------------OPTIONS-------------------------------------//

//fonction pour désactiver le son (inutile puisqu'il n'y a pas de son !)
$("#inMuteOff").click(function(){
	$("#inMuteOn").css("display", "block");
	$("#inMuteOff").css("display", "none");
	$("html").volume = 0;
});

//remettre le son !
$("#inMuteOn").click(function(){
	$("#inMuteOff").css("display", "block");
	$("#inMuteOn").css("display", "none");
	$("html").volume = 1;
});

$("#inReturn").click(function(){
	$("#menuAccueil").css("display", "block");
	$("#menuAccueil").css("opacity","0");
	$("#menuAccueil").animate({opacity : '1'},'slow');
	$("#menuOptions").css("display", "none");
});

});
