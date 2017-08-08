function PreView(select){
	SideView.call(this, select);
	this.side_item = null;
	this.wall_menu = null;
	this.floor_menu = null;
	this.girl_menu = null;
	this.fur_menu = null;
	this.view = new BaseView(this.side.width(), this.side.width());
	this.side.children('.view').append(this.view.renderer.view);
	this.view.start();
}(function(){
	var Super = function(){};
	Super.prototype = SideView.prototype;
	PreView.prototype = new Super();
})();

PreView.prototype.init = function(){
	this.init_exit();
	this.init_data();
	this.init_item();
}

PreView.prototype.init_item = function(){
	this.side_item = this.side.find('.item');
	for(var i = 0; i < this.side_item.length; i++){
		$(this.side_item[i]).children('.title').click(function(e){
			e.stopPropagation();
			var title = $(this);
			var menu = title.next('.menu');
			menu.stop(true);
			if(title.hasClass('itemclose')){
				title.removeClass('itemclose').addClass('itemopen');
				menu.css('display' , 'block');
				menu.animate({'height' : menu.children('.item').length * menu.children('.item').height() + 'px'}, 300, function(){$(this).css('height', 'auto');});
			}else{
				title.removeClass('itemopen').addClass('itemclose');
				menu.animate({'height' : '0'}, 300, function(){$(this).css('display','none')});
			}
		});
	}
}

PreView.prototype.init_data = function(){
	this.wall_menu = this.side.find('#wall');
	this.floor_menu = this.side.find('#floor');
	this.girl_menu = this.side.find('#girl');
	this.fur_menu = this.side.find('#fur');
	var wallstr = '', floorstr = '', girlstr = '', furstr = '';
	for(var genus in data_furniture){
		furstr += "<div class='item'><div class='title itemclose'><span>" + genus + "</span></div><div class='menu'>";
		for(var name in data_furniture[genus]){
			var str = "<div class='item'><div class='tab' value='" + genus + '#' + name +"'><span>" + genus + '_' + name + "</span><div class='add icon'></div></div></div>";
			if(name.split('_')[0] == 'wall'){
				wallstr += str;
			}else if(name.split('_')[0] == 'floor'){
				floorstr += str;
			}else{
				furstr += str;
			}
		}
		furstr +="</div></div>";
	}
	for(var genus in data_girl){
		girlstr += "<div class='item'><div class='title itemclose'><span>" + this.getGirlsName(genus) + "</span></div><div class='menu'>";
		for(var name in data_girl[genus]){
			girlstr += "<div class='item'><div class='tab' value='" + genus + '#' + name +"'><span>" + name + "</span><div class='add icon'></div></div></div>";
		}
		girlstr +="</div></div>";
	}
	this.wall_menu.children('.menu').html(wallstr);
	this.floor_menu.children('.menu').html(floorstr);
	this.girl_menu.children('.menu').html(girlstr);
	this.fur_menu.children('.menu').html(furstr);

	var v = this.view;
	this.side.find('#wall .tab, #floor .tab, #fur .tab').click(function(e){
		e.stopPropagation();
		var val = $(this).attr('value');
		var g = val.split('#')[0], n = val.split('#')[1];
		fursload.load(g, n, function(res){
			v.clean();
			v.addImagePlayer(res);
			v.player[0].scale.set(v.width * 0.8 / res.width);
		});
	});
	this.side.find('#wall .tab>.add').click(function(e){
		e.stopPropagation();
		var val = $(this).parent().attr('value');
		var g = val.split('#')[0], n = val.split('#')[1];
		fursload.load(g, n, function(res){
			dormview.setWall(res);
			editview.setWall(g + '_' + n);
		});
	});
	this.side.find('#floor .tab>.add').click(function(e){
		e.stopPropagation();
		var val = $(this).parent().attr('value');
		var g = val.split('#')[0], n = val.split('#')[1];
		fursload.load(g, n, function(res){
			dormview.setFloor(res);
			editview.setFloor(g + '_' + n);
		});
	});
	this.side.find('#fur .tab>.add').click(function(e){
		e.stopPropagation();
		var val = $(this).parent().attr('value');
		var g = val.split('#')[0], n = val.split('#')[1];
		fursload.load(g, n, function(res){
			var info = {};
			dormview.addImagePlayer(res);
			info['genus'] = g;
			info['name'] = n;
			editview.addItem(info);
		});
	});
	this.side.find('#girl .tab').click(function(e){
		e.stopPropagation();
		var val = $(this).attr('value');
		var g = val.split('#')[0], n = val.split('#')[1];
		girlsload.load(g, n, function(res){
			v.clean();
			v.addSpinePlayer(res);
		});
	});
	this.side.find('#girl .tab>.add').click(function(e){
		e.stopPropagation();
		var val = $(this).parent().attr('value');
		var g = val.split('#')[0], n = val.split('#')[1];
		girlsload.load(g, n, function(res){
			var info = {};
			dormview.addSpinePlayer(res);
			info['genus'] = g;
			info['name'] = n;
			info['animate'] = true;
			editview.addItem(info);
		});
	});
	$(this.view.renderer.view).click(function(e){
		e.stopPropagation();
		v.nextAnimation(0);
	});
}

PreView.prototype.getGirlsName = function(genus){
	if(data_girls_name[genus] != null){
		return data_girls_name[genus];
	}
	return genus;
}