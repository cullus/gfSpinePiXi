function SideView(select){
	this.side = $(select);
	this.side_exit = null;
}

SideView.prototype = {
	init_exit : function(){
		this.side_exit = this.side.children('.exit');
		this.side_exit.click(function(e){
			e.stopPropagation();
			var side_exit = $(this);
			var side = side_exit.parent();
			side.stop(true);
			var now, next, obj = {};
			if(side.hasClass('sideleft')){
				now = 'left'; next = 'right';
			}else{
				now = 'right'; next = 'left';
			}
			if(side_exit.hasClass('exit' + now)){
				side_exit.removeClass('exit' + now).addClass('exit' + next);
				var obj = {};
				obj[now] = '-' + side.css('width');
				side.animate(obj, 300);
			}else{
				side_exit.removeClass('exit' + next).addClass('exit' + now);
				var obj = {};
				obj[now] = '0';
				side.animate(obj, 300);
			}
		});
	}
}