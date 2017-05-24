function BaseView(w, h){
	this.width = w || 400;
	this.height = h || 400;
	this.last_time = 0;
	this.now_time = 0;
	this.isUpdate = true;
	this.animationframe = null;
	this.animations = new Array();
	this.player = new Array();
	this.stage = new PIXI.Container;
	this.renderer = PIXI.autoDetectRenderer(this.width, this.height, { transparent : true });
}

BaseView.prototype = {
	clean : function(){
		this.stage.removeChildren();
		this.player = new Array();
	},
	addSpinePlayer : function(skeletonData){
		var spineplayer = new PIXI.spine.Spine(skeletonData);
		var animations = spineplayer.spineData.animations;
		spineplayer.position.set(this.width / 2, this.height / 2 + spineplayer.height / 2);
		spineplayer.scale.set(1);
		spineplayer.animation_num = 0;
        spineplayer.state.setAnimationByName(0, animations[0].name, true);
        spineplayer.skeleton.setToSetupPose();
        spineplayer.autoUpdate = false;
        spineplayer.update(0);
        spineplayer.isupdate = true;
        var num;
        num = this.player.push(spineplayer);
        this.stage.addChild(spineplayer);
        this.renderer.render(this.stage);
        return num;
	},
	nextAnimation : function(num){
		if(this.player[num] && this.player[num].spineData && this.player[num].spineData.animations){
			var animations = this.player[num].spineData.animations;
			this.player[num].animation_num = (this.player[num].animation_num + 1) % animations.length;
			this.player[num].state.setAnimationByName(0, animations[this.player[num].animation_num].name, true);
			this.player[num].update(0);
		}
	},
	changeupdate : function(num){
		this.player[num].isupdate = !this.player[num].isupdate;
		return this.player[num].isupdate;
	},
	upplayer : function(num){
		if(num <= 0){
			return null;
		}
		var now = this.stage.getChildIndex(this.player[num]);
		var next = this.stage.getChildIndex(this.player[num - 1]);
		var p = this.player[num];
		this.player[num] = this.player[num - 1];
		this.player[num  - 1] = p;
		this.stage.addChildAt(this.player[num], now);
		this.stage.addChildAt(this.player[num - 1], next);
		return num - 1;
	},
	downplayer : function(num){
		if(num >= this.player.length - 1){
			return null;
		}
		var now = this.stage.getChildIndex(this.player[num]);
		var next = this.stage.getChildIndex(this.player[num + 1]);
		var p = this.player[num];
		this.player[num] = this.player[num + 1];
		this.player[num  + 1] = p;
		this.stage.addChildAt(this.player[num], now);
		this.stage.addChildAt(this.player[num + 1], next);
		return num + 1;
	},
	addImagePlayer : function(texture){
		var imageplayer = new PIXI.Sprite(texture);
		imageplayer.anchor.set(0.5);
		imageplayer.position.set(this.width / 2, this.height / 2);
		this.player.push(imageplayer);
		this.stage.addChild(imageplayer);
        this.renderer.render(this.stage);
	},
	start : function(){
		this.animationframe = window.requestAnimationFrame((time) => {
			this.animate(time);
		});
	},
	animate : function(t){
		this.animationframe = window.requestAnimationFrame((time) => {
			this.animate(time);
		});
		this.last_time = this.now_time;
		this.now_time = t;
		var time_diff = this.now_time - this.last_time;
		if(this.isUpdate){
			for(var i = 0; i < this.player.length; i++){
				if(this.player[i].update && this.player[i].isupdate){
					this.player[i].update(time_diff / 1000);
				}
			}
		}
		for(var i = 0; i < this.animations.length; i++){
			this.animations[i](t);
		}
		this.renderer.render(this.stage);
	}
}