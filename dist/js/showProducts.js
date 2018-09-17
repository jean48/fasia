$(document).ready(function(){ 
	var token = checkToken();
	if(token !== undefined){
		// if(paginate_isStart == false){
		// 	$('#productsDiv').empty();
		// 	GetProducts(token);
		// 	paginate_isStart = true;
		// 	$.notify({
		// 		title 	: '<strong>Message</strong>',
		// 		message : 'Please scroll down to see more products.'
		// 	},{
		// 		type: 'info',
		// 		newest_on_top: true,
		// 		offset: {
		// 				x: 0,
		// 				y: 20
		// 			}
		// 	});
		// }
		// window.onscroll = function() {
		//   var d = document.documentElement;
		//   var offset = d.scrollTop + window.innerHeight;
		//   var height = d.offsetHeight; 
		//   // console.log('offset = ' + offset);
		//   // console.log('height = ' + height); 
		//   if (offset === height) { 
		//     //console.log('At the bottom');
		//     GetProducts(token);
		//   }
		// };
		GetProducts(token);
	}
});