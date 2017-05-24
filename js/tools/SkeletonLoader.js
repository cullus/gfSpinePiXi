function SkeletonLoader(path, data){
	this.path = path;
	this.basedata = data;
	this.resources = {};
	this.loader = new PIXI.loaders.Loader(this.path);
}

SkeletonLoader.prototype = {
	log : function(l){
		console.log(l + " : SkeletonLoader");
	},
	getfullpath : function(genus, name, type){
		var full_path = '';
		if(this.basedata[genus][name][type]){
			full_path = genus + '/' + this.basedata[genus][name][type] + '.' + type;
		}else{
			full_path = genus + '/' + name + '.' + type;
		}
		return full_path;
	},

	RES_PATH : ['skel', 'json', 'atlas', 'png'],
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
		var res_paths = {};
		for(var i = 0; i < this.RES_PATH.length; i++){
			res_paths[this.RES_PATH[i]] = this.getfullpath(genus, name, this.RES_PATH[i]);
		}

		if(info['json']){
			this.loader.add(res_name + '-json', res_paths.json, { 'xhrType' : 'text' });
		}else{
			this.loader.add(res_name + '-skel', res_paths.skel, { 'xhrType' : 'arraybuffer' });
		}
		this.loader.add(res_name + '-atlas', res_paths.atlas, { 'xhrTypr' : 'text' });
		this.loader.add(res_name + '-png', res_paths.png, { 'xhrTypr' : 'png' });
		this.loader.load((loader, resources) => {
			var rawSkeletonData, rawAtlasData, rawPngData;

			if(resources[res_name + '-json']){
				rawSkeletonData = JSON.parse(resources[res_name + '-json'].data);
			}else{
				var skel_bin = new SkeletonBinary();
				skel_bin.data = new Uint8Array(resources[res_name + '-skel'].data);
				skel_bin.initJson();
				rawSkeletonData = skel_bin.json;
			}
			rawAtlasData = resources[res_name + '-atlas'].data;
			rawPngData = resources[res_name + '-png'].data;

			var spineAtlas = new PIXI.spine.SpineRuntime.Atlas(rawAtlasData, function(line, callback, pngData = rawPngData) {
                callback(new PIXI.BaseTexture(pngData));
            });
            var spineAtlasParser = new PIXI.spine.SpineRuntime.AtlasAttachmentParser(spineAtlas);
            var spineJsonParser = new PIXI.spine.SpineRuntime.SkeletonJsonParser(spineAtlasParser);
            var skeletonData = spineJsonParser.readSkeletonData(rawSkeletonData, name);

            this.resources[genus] = this.resources[genus] || {};
            this.resources[genus][name] = skeletonData;

            callback(this.resources[genus][name]);
		});
	}
}