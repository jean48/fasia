$(document).ready(function(){
	$('#username').focus();
	$('#username').keypress(function (e) {
		if (e.which == 13) {
			validate();
		}
	});

	$('#password').keypress(function (e) {
		if (e.which == 13) {
			validate();
		}
	});

	$('#signin').on('click', function(){
		validate();
	});

	$('#username').on('blur', function() {
		var username = $('#username').val();

		if(username.length !== 0){
			$('#userDiv').removeClass('has-danger');
			$('#userError').html('');
		}
		
	});

	$('#password').on('blur', function() {
		var passsword = $('#password').val();
		
		if(passsword.length !== 0){
			$('#passDiv').removeClass('has-danger');
			$('#passError').html('');
		}
		
	});

});

function validate(e){
	var username = $('#username').val();
	var passsword = $('#password').val();
	var password1 = $.md5($('#password').val());

    	console.log("Hello2!");
		if(username.length == 0){
			$('#userDiv').addClass('has-danger');
			$('#userError').html('This is a required field');		
			return;
		}
		else{
			$('#userDiv').removeClass('has-danger');
		 	$('#userError').html('');
		}
		if(passsword.length == 0){

			$('#passDiv').addClass('has-danger');
			$('#passError').html('This is a required field');
			return;
		}
		else{
		 	$('#passDiv').removeClass('has-danger');
		 	$('#passError').html('');
		}

		if(username.length > 0 && password1.length > 0) {
			console.log("Success");
			// var a = {"cardNumber":username, "password" :password1};		

			// var stringify = JSON.stringify(a);

			// console.log(a);

			// ajax(api+"login/login/"+stringify,function(data) {	

			// 	if(data.statusCode == 1){

			//         createCookie('token', data.token, 1);

			//         $('#alertDiv').append(''+
   //                  '<div class="alert alert-danger alert-dismissible fade show" role="alert">'+
   //                  '<strong>'+data.statusDescription+'</strong>'+
   //                  '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
   //                  '<span aria-hidden="true">&times;</span>'+
   //                  '</button>'+
   //                  '</div>');

			// 		$('#username').val("");
			// 		$('#password').val("");

			//     	window.location.href="landingpage.html";
			//     	return;
			//     }

			// 	else{

			// 		$('#alertDiv').append(''+
   //                  '<div class="alert alert-danger alert-dismissible fade show" role="alert">'+
   //                  '<strong>'+data.statusDescription+'</strong>'+
   //                  '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
   //                  '<span aria-hidden="true">&times;</span>'+
   //                  '</button>'+
   //                  '</div>');

			// 	    return;
			// 	}				    
			// });			
		}									
}