function BaseLoader(path, data){
	this.path = path;
	this.data = data;
	this.loader = new PIXI.loaders.Loader(this.path);
}