function DormView(w, h){
	BaseView.call(this, w, h);
	this.floor = new PIXI.Sprite(PIXI.Texture.EMPTY);
	this.wall = new PIXI.Sprite(PIXI.Texture.EMPTY);
	this.stage.addChild(this.floor);
	this.stage.addChild(this.wall);
	this.floor_z = this.stage.getChildIndex(this.floor);
	this.wall_z = this.stage.getChildIndex(this.wall);
	this.floor_mult = 4;
	this.floor_tan = 10;
	this.horizon = this.height / 4 * 3;
}(function(){
	var Super = function(){};
	Super.prototype = BaseView.prototype;
	DormView.prototype = new Super();
})();

DormView.prototype.setFloor = function(texture){
	var row = Math.floor(this.height / 2 / (texture.height / this.floor_mult)) + 1;
	var col = Math.floor(this.width / texture.width + row * 2 / this.floor_tan) + 1;
	var floor_w = col * texture.width;
	var floor_h = row * texture.height / this.floor_mult;
	var tiling = new PIXI.extras.TilingSprite(texture, texture.width * col, texture.height * row);
	var s = new PIXI.Container;
	s.addChild(tiling);
	var renderTexture = new PIXI.RenderTexture(this.renderer,texture.width * col, texture.height * row);
	renderTexture.render(s);

	var strip = new PIXI.mesh.Plane(renderTexture, col + 1, row + 1);
	for(var i = 0; i < row; i++){
		var w = col - (row - i) / this.floor_tan * 2;
		for(var j = 0; j < col + 1; j++){
			strip.vertices[(j + i * (col + 1)) * 2] = ((row - i) / this.floor_tan + j * (w / col)) * texture.width;
			strip.vertices[(j + i * (col + 1)) * 2 + 1] += (row - i) * texture.height * (1 - 1 / this.floor_mult);
		}
	}
	strip.x = (this.width - floor_w) / 2;
	strip.y = this.horizon - texture.height * row + floor_h;
	this.stage.removeChild(this.floor);
	this.floor = strip;
	this.stage.addChildAt(this.floor, this.floor_z);
	this.renderer.render(this.stage);
}

DormView.prototype.removeFloor = function(){
	this.stage.removeChild(this.floor);
	this.floor = new PIXI.Sprite(PIXI.Texture.EMPTY);
	this.stage.addChildAt(this.floor, this.floor_z);
	this.renderer.render(this.stage);
}

DormView.prototype.setWall = function(texture){
	var wall_mult = this.horizon / texture.height;
	var tiling = new PIXI.extras.TilingSprite(texture, this.width / wall_mult, texture.height);
	tiling.scale.set(wall_mult, wall_mult);
	tiling.anchor.set(0.5, 1);
	tiling.position.set(this.width / 2, this.horizon);
	this.stage.removeChild(this.wall);
	this.wall = tiling;
	this.stage.addChildAt(this.wall, this.wall_z);
	this.renderer.render(this.stage);
}

DormView.prototype.removeWall = function(){
	this.stage.removeChild(this.wall);
	this.wall = new PIXI.Sprite(PIXI.Texture.EMPTY);
	this.stage.addChildAt(this.wall, this.wall_z);
	this.renderer.render(this.stage);
}

DormView.prototype.removePlayer = function(num){
	var p = this.player[num];
	this.stage.removeChild(p);
	this.player.splice(num,1);
}