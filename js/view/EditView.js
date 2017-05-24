function EditView(select){
	SideView.call(this, select);
	this.focusnum = null;
	this.pos_x = this.side.find('.pos_x>input');
	this.pos_y = this.side.find('.pos_y>input');
	this.scale = this.side.find('.scale>input');
	this.top = this.side.find('.edit>.top');
	this.down = this.side.find('.edit>.down');
	this.top.click(function(e){
		e.stopPropagation();
		if(editview.focusnum == null || editview.focusnum <= 0){
			return;
		}
		var num = dormview.upplayer(editview.focusnum);
		var items = editview.item.find('.item');
		$(items[editview.focusnum]).insertBefore($(items[num]));
		$(items[editview.focusnum]).click();
	});
	this.down.click(function(e){
		e.stopPropagation();
		if(editview.focusnum == null || editview.focusnum >= editview.item.find('.item').length - 1){
			return;
		}
		var num = dormview.downplayer(editview.focusnum);
		var items = editview.item.find('.item');
		$(items[editview.focusnum]).insertAfter($(items[num]));
		$(items[editview.focusnum]).click();
	});
	this.wall = this.side.find('#wall');
	this.wall.find('.remove').click(function(e){
		e.stopPropagation();
		dormview.removeWall();
		$(this).prev('.name').html('空');
	});
	this.floor = this.side.find('#floor');
	this.floor.find('.remove').click(function(e){
		e.stopPropagation();
		dormview.removeFloor();
		$(this).prev('.name').html('空');
	});
	this.item = this.side.find('#item');
}(function(){
	var Super = function(){};
	Super.prototype = SideView.prototype;
	EditView.prototype = new Super();
})();

EditView.prototype.init = function(){
	this.init_exit();
	dormview.animations.push(function(t){
		if(editview.focusnum == null)
			return;
		var x = editview.pos_x.val();
		var y = editview.pos_y.val();
		var s = editview.scale.val();
		var p = dormview.player[editview.focusnum];
		p.position.set(x, y);
		if(p.scale.x > 0){
			p.scale.set(s / 1000);
		}else{
			p.scale.set(-s / 1000, s / 1000);
		}
	});
}

EditView.prototype.setWall = function(name){
	this.wall.find('.name').html(name);
}

EditView.prototype.setFloor = function(name){
	this.floor.find('.name').html(name);
}

EditView.prototype.addItem = function(info){
	var str = "<div class='item'><div class='tab'><span class='name'>" + info.genus + '_' + info.name + "</span><div class='turn icon'></div><div class='remove icon'></div></div></div>";
	var dom = this.item.children('.menu').append(str);
	dom.find('.item:last').click(function(e){
		e.stopPropagation();
		$(this).siblings().removeClass('focusitem');
		$(this).addClass('focusitem');
		var num = $(this).prevAll().length;
		editview.focusnum = num;
		var p = dormview.player[editview.focusnum];
		editview.pos_x.attr("min", -p.width);
		editview.pos_x.attr("max", 1920 + p.width);
		editview.pos_x.val(p.position.x);
		editview.pos_y.val(p.position.y);
		editview.pos_y.attr("min", -p.height);
		editview.pos_y.attr("max", 1080 + p.height);
		editview.scale.val(p.scale.x * 1000);
	});
	dom.find('.item:last').click();
	dom.find('.remove:last').click(function(e){
		e.stopPropagation();
		var item = editview.item.find('.menu>.focusitem');
		var num = $(this).parent().parent('.item').prevAll().length;
		dormview.removePlayer(num);
		$(this).parent().parent('.item').remove();
		if(num == editview.focusnum)
			editview.focusnum = null;
		else
			item.click();
	});
	dom.find('.turn:last').click(function(e){
		e.stopPropagation();
		var item = editview.item.find('.menu>.focusitem');
		var num = $(this).parent().parent('.item').prevAll().length;
		dormview.player[num].scale.x *= -1;
	});
	if(info['animate']){
		dom.find('.item:last').find('.name').html(info.name);
		dom.find('.item:last').children('.tab').append("<div class='next icon'></div><div class='stop icon'></div>");
		dom.find('.next:last').click(function(e){
			e.stopPropagation();
			var num = $(this).parent().parent('.item').prevAll().length;
			dormview.nextAnimation(num);
		});
		dom.find('.stop:last').click(function(e){
			e.stopPropagation();
			var num = $(this).parent().parent('.item').prevAll().length;
			var b = dormview.changeupdate(num);
			if(b){
				$(this).removeClass('play').addClass('stop');
			}else{
				$(this).removeClass('stop').addClass('play');
			}
		});
	}
}