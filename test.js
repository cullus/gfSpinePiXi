$(document).ready(function(){
	girlsload = new SkeletonLoader("assets/character/", data_girl);
	// girlsload.load('357', '357', function(d){
	// 	view.addSpinePlayer(girlsload.resources['357']['357']);
	// });
	fursload = new ImageLoader("assets/furniture/", data_furniture);
	// fursload.load('bld2016', 'bed', function(d){
	// 	view.addImagePlayer(fursload.resources['bld2016']['bed']);
	// });
	// fursload.load('cj2017', 'floor', function(d){
	// 	view.setFloor(fursload.resources['cj2017']['floor']);
	// });
	// fursload.load('cj2017', 'wall', function(d){
	// 	view.setWall(fursload.resources['cj2017']['wall']);
	// });
	dormview = new DormView(1920, 1080);
	$('.mainview').append(dormview.renderer.view);
	dormview.start();

	preview = new PreView('.mainview>.sideleft');

	editview = new EditView('.mainview>.sideright');

	preview.init();
	editview.init();

});

var girlsload, fursload;
var dormview;
var preview, editview;