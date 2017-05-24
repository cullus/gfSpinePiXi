function ImageLoader(path, data){
	this.path = path;
	this.basedata = data;
	this.resources = {};
	this.loader = new PIXI.loaders.Loader(this.path);
}

ImageLoader.prototype = {
	log : function(l){
		console.log(l + ' : ImageLoader');
	},
	getfullpath : function(genus, name, type){
		var full_path = '';
		if(genus == 'default')
			full_path = genus + '/' + name + '.' + type;
		else
			full_path = genus + '/' + genus + '_' + name + '.' + type;
		return full_path;
	},

	load : function(genus, name, callback){
		if(!genus || !name){
			log("变量不足");
			return ;
		}
		var res_name = genus + '-' + name;

		if(!this.basedata[genus] || !this.basedata[genus][name]){
			log('未能找到' + res_name);
			return ;
		}

		if(this.resources[genus] && this.resources[genus][name]){
			callback(this.resources[genus][name]);
			return ;
		}

		var info = this.basedata[genus][name];
		var res_path = this.getfullpath(genus, name, 'png');
		this.loader.add(res_name + '-png', res_path, { 'xhrTypr' : 'png' });
		this.loader.load((loader, resources) => {
			this.resources[genus] = this.resources[genus] || {};
			this.resources[genus][name] = resources[res_name + '-png'].texture;
			callback(this.resources[genus][name]);
		});
	}
}