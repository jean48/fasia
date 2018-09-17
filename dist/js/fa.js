$(document).ready(function(){
 
var result = checkCookies(); 
if(result !== null){ 
	var sp = $('#loginPlaceholder');
	var sp2 = $('#loginPlaceholder2');
	console.log(result);
	var cus_name = getCookie('customer_code');
	sp.html('<label class="label label-default text-light" style="margin-bottom:0px;" >'+result+'</label>' + 
			//'<a class="text-light dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> '+cus_name+' - '+result+'</a>'+
			'<button style=" " class="btn btn-link btn-lg text-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+ cus_name +'</button>'+
		  	'<div class="dropdown-menu" aria-labelledby="dropdownMenuButton"  >'+
			    '<a class="dropdown-item" href="account.html">View Account</a>'+
			    '<a class="dropdown-item" href="#" id="logout">Logout</a>'+
		  	'</div>');
	sp2.html('<label class="label label-default text-light">'+result+'</label>' + '<button class="btn btn-link btn-lg text-light dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+ cus_name +'</button>'+
		  	//'<a class="text-light dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> '+cus_name+'</a>'+
		  	'<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">'+
			    '<a class="dropdown-item" href="account.html">View Account</a>'+
			    '<a class="dropdown-item" href="#" id="logoutm">Logout</a>'+
		  	'</div>');
}
  
getCartSize();

$('#logout').on('click', function(){
	logoutFA();
});

$('#logoutm').on('click', function(){
	logoutFA();
});

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

$('#sub').on('click', function(){
	var email = $('#email').val();

	if(email.length !== 0 && validateEmail(email) == true){
		ajax(api+"subscribe",{'email': email},function(data){
			 if(data.success == false){
                showWarningSub('Subscription',data.message);
                return;
              }

              showSuccessSub('Subscription',data.message);
              $('#email').val('');
		});
	}else{
		$.notify({
					title: '<strong>Invalid email address</strong>',
					message: 'Please try again.'
				},{
					type: 'danger',
					newest_on_top: true,
					offset: {
						x: 0,
						y: 20
					}
				});
	}
});

});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function checkCookies(){
	//add cart
	var token = getCookie('token');
	if(token !== null){
		var name = getCookie('name');

		return name;
	}else{
		return null;
	}
}

function getCartSize(){
	var token = readCookie('token');
	ajaxWithHeader(api+"cart/countCart",{},token,function(data){
		$('#cartsizeD').html('');
		$('#cartsize').html('');

		if(data.statusCode == 1){
			$('#cartsizeD').html(data.data);
			$('#cartsize').html(data.data);
		}else{
			$('#cartsizeD').html('0');
			$('#cartsize').html('0');
		}
		
	});
}

function yearNow(){
	var dt = new Date();
	$('#yearSpan').html(dt.getFullYear());
}
function openNav() {
    document.getElementById("mySidenav").style.width = "80%";
    document.getElementById("main").style.marginRight = "250px";
    // document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

/* Set the width of the side navigation to 0 and the Right margin of the page content to 0, and the background color of body to white */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
    document.body.style.backgroundColor = "white";
}

function login(username, password){
	var a = {"code":username,"password":password};
	ajax(api+"customer/login",a,function(data){
		console.log(data);
		if(data.statusCode == 1){
			// try{
			// 	var info = data.data;
			// 	var name = info.fName.trim() +" "+info.lName.trim();
			// 	createCookie('token', info.token, 30);
			// 	createCookie('name', name, 30);
			// 	window.location.href="index.html";
			// }catch(err){
			// 	$('#loginModal').modal('toggle');
			// 	$.notify({
			// 		title: '<strong>Something went wrong.</strong>',
			// 		message: err
			// 	},{
			// 		type: 'danger',
			// 		newest_on_top: true
			// 	});
			// }


			try{
				var info = data.data;
				var name = info.customerName;
				createCookie('token', info.token, 30);
				createCookie('name', name, 30);
				createCookie('customer_code', username, 30);
				window.location.href="index.html";
			}catch(err){
				$.notify({
					title: '<strong>Something went wrong.</strong>',
					message: 'Please Contact Administrator.'
				},{
					type: 'danger',
					newest_on_top: true,
					offset: {
						x: 0,
						y: 20
					}
				});
				$('#loginModal').modal('toggle');
			}
			
		}else if(data.statusCode == 3){
			$('#loginModal').modal('toggle');
			$.notify({
				title: '<strong>Account still logged in on another device!</strong>',
				message: 'Please try again'
			},{
				type: 'danger',
				newest_on_top: true,
				offset: {
						x: 0,
						y: 20
					}
			});
		}else{
			$('#loginModal').modal('toggle');
			$.notify({
				title: '<strong>Invalid Username and/or Password!</strong>',
				message: 'Please try again'
			},{
				type: 'danger',
				newest_on_top: true,
				offset: {
						x: 0,
						y: 20
					}
			});

		}
	});
}
function validate(){
	var username = $('#username').val();
	var password = $('#password').val();
	// var password1 = $.md5($('#password').val());

		if(username.length == 0){
			$('#userDiv').addClass('has-danger');
			$('#userError').html('This is a required field');		
			return;
		}
		else{
			$('#userDiv').removeClass('has-danger');
		 	$('#userError').html('');
		}
		if(password.length == 0){

			$('#passDiv').addClass('has-danger');
			$('#passError').html('This is a required field');
			return;
		}
		else{
		 	$('#passDiv').removeClass('has-danger');
		 	$('#passError').html('');
		}

		if(username.length > 0 && password.length > 0) {
			login(username, password);
		}
}
function addComma(number) {
    var parts = number.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
function logoutFA(){
	var token = readCookie('token');
	console.log(token);
	ajaxWithHeader(api+"customer/logout",{},token,function(data){
		console.log(data);
		if(data.statusCode == 1){
			eraseAllCookie();
			window.location.href="index.html";
		}else{
			$.notify({
				title: '<strong>Something Went Wrong!</strong>',
				message: data.statusDescription
			},{
				type: 'danger',
				newest_on_top: true,
				offset: {
						x: 0,
						y: 20
					}
			});
		}

	});
}
