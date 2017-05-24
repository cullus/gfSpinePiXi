$(document).ready(function(){
	game.init();
});

var game = {
	init : function(){
		gameview = new DormView(1920, 1080);
	}
}