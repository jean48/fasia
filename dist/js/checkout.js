$(document).ready(function(){ 
	getSelectedCheckoutAmount();
	rdbCheckoutChange();
});


function rdbCheckoutChange(){
	$('#rdb1').on('click',function(){
		getSelectedCheckoutAmount();
	});
	$('#rdb2').on('click',function(){
		getSelectedCheckoutAmount();
	});
	$('#rdb3').on('click',function(){
		getSelectedCheckoutAmount();
	});
}

function getSelectedCheckoutAmount(){
	var checkouts = document.getElementsByName('checkout_type');
	var type;
	for(var i = 0; i < checkouts.length; i++){
	    if(checkouts[i].checked){
	        type = checkouts[i].value;
	        var token = checkToken();
	        var data = { 
	        	checkout_type 	: type
	        };
	        ajaxWithHeader(api+"order/checkout_type_amount",data,token,function(response){
	        	console.log(response);
			}); 
	        return;
	    }
	}
}
 
function checkToken(){
	var token = readCookie('token');
	if( token == null){
		var dialog = bootbox.dialog({
			
			message: '<p class="fa-red lead gothic">Please login before accessing the shop.</p>',
			buttons: {
			    ok: {
			        label: "OK",
			        className: 'fa-red-bg text-light',
			        callback: function(){
			            window.location.href="index.html";
			            return false;
			        }
			    }
			}
		});
	}else{
		return token;
	}
}