function Animation(){
	this.animations = new Array();
	this.animationframe = null;
}
Animation.prototype = {
	start : function(){
		this.animationframe = window.requestAnimationFrame((time) => {
			this.animate(time);
		});
	},
	animate : function(t){
		this.animationframe = window.requestAnimationFrame((time) => {
			this.animate(time);
		});
		for(var i = 0; i < this.animations.length; i++){
			this.animations[i](t);
		}
	}
}