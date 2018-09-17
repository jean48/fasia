$(document).ready(function(){
	productSearching();
	rdbCheckoutChange();


	// var x = window.matchMedia("(min-width: 992px)")
	// affix(x) // Call listener function at run time
	// x.addListener(affix) // Attach listener function on state changes

	// function affix(x) {
	//     if (x.matches) { // If media query matches
	//         var hh = $('header').outerHeight();

	// 		var fh = $('footer').outerHeight();
	// 		console.log(hh);
	// 		var ct = $('#sidemenu');
	// 		ct.css('position', 'fixed'); 
	// 		ct.css('top', hh);
	//     } 
	// }  

	var token = checkToken();
	if(token !== undefined){
		// if(paginate_isStart == false){
		// 	$('#productsDiv').empty();
		// 	GetProducts(token);
		// 	paginate_isStart = true;
		// 	$.notify({
		// 		title 	: '<strong>Message</strong>',
		// 		message : 'Scroll down to load more products.'
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
		//   if (offset === height) {  
		//     GetProducts(token);
		//   }
		// };
		

		if($('#cart-TableMD').length == 0) {
			GetCart2(token);
			getCharges(token);
			getCustomerDetails(token);
		}else{
			GetCart(token);
		}  
	}

	//Called when displaying products modal
	$('#productModal').on('show.bs.modal', function (event) {
	  var button = $(event.relatedTarget); // Button that triggered the modal
	  var id = button.data('id'); // Extract info from data-* attributes

	  //setting the image of selected product in modal 
	  $('#productModal_img').attr('src', product_images[button.data('id')] );

	  var price = button.data('price');
	  var web_desc = button.data('webdesc');
	  var desc = button.data('desc');
	  var pn = button.data('partno');

	  var mdDesc = $('#productName');
	  mdDesc.html("");

	  var mdWebDesc = $('#desc');
	  mdWebDesc.html(""); 

	  var mdPrice = $('#pdPrice');
	  mdPrice.html("");
	  var mdPn = $('#partNo');
	  mdPn.html("");
	  var mdPid = $('#pid');
	  mdPid.html("")
	  mdDesc.html(desc);
	  mdWebDesc.html(web_desc);
	  mdPrice.html(addComma(price));
	  mdPrice.data('price', price);
	  mdPn.val(pn);
	  mdPid.val(id);

	  $('#qty').val('1');
	})
	//Adding item to cart
	$('#atc').on('click',function(){
		var name = $('#productName').text();
		var price = $('#pdPrice').data('price');
		var pn = $('#partNo').val();
		var pid = $('#pid').val();
		var qty = $('#qty').val(); 
		var token = checkToken();
		var product = {
			prodID : pid,
			status : "1",
			description : name,
			partNo : pn,
			qty : qty,
			price : price
		};

		addToCart(product);
		
		$('#productModal').modal('toggle');

	});
	//Check out
	$('#checkOut').on('click', function(){

		bootbox.confirm({
		    message: '<p class="gothic h4">Confirm Checkout?</p>',
		    buttons: {
		        confirm: {
		            label: 'Ok',
		            className: 'fa-red-bg text-light'
		        },
		        cancel: {
		            label: 'Cancel',
		            className: 'btn-outline-dark'
		        }
		    },
		    callback: function (result) {
		        if(result == true){
					checkOut();
				}else{
					return;
				}
		    }
		    
		});
		
	});

	$('#clearCart').on('click', function(){
		var x = $('#cartsizeD').text();
		var y = $('#cartsize').text();
		if( x > 0 & y > 0){
			bootbox.confirm({
			    message: '<p class="gothic h4">Confirm Emptying Cart? There is no undo.</p>',
			    buttons: {
			        confirm: {
			            label: 'Ok',
			            className: 'fa-red-bg text-light'
			        },
			        cancel: {
			            label: 'Cancel',
			            className: 'btn-outline-dark'
			        }
			    },
			    callback: function (result) {
			        if(result == true){
						emptyCart();
					}else{
						return;
					}
			    }
			});
		}else{
			//console.log(false);
		}
		
	});


});
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
 
var product_images = [];
var product_master_list = [];

var paginate_start = 0;
var paginate_end = 0;
var paginate_limit = 20;
var paginate_enabler = false;
var paginate_isStart = false;
var temp_ctr = 0;

function GetProducts(token){  
	//$('#productsDiv').empty();
	var a = {
		'paginate_start' 	:paginate_start,
		'paginate_limit'	:paginate_limit
	};
	//console.log(  a);
	var b = {"token":token};
	Pace.track(function(){
		ajaxWithHeader(api+"products/getProductByCustomerCode",a,token,function(data){
			if(data.statusCode == 1){ 
				paginate_start = paginate_start + paginate_limit;

				//console.log('new starting row: '+paginate_start);

			   	var p1 		= data.data;   
			   	//console.log(data);

			   	//p1 = p1.sort(compareProduct);
			   	if(data.count == 0){
			  //  		$.notify({
					// 	title 	: '<strong>Message</strong>',
					// 	message : 'There is no more product to be display!'
					// },{
					// 	type: 'warning',
					// 	newest_on_top: true,
					// 	offset: {
					// 			x: 0,
					// 			y: 20
					// 		}
					// });
			   		return;
			   	}
			   	product_master_list = p1;
			   	p1.forEach((item)=>{  
			   		product_images[item.id] = item.img;
			 		$('#productsDiv').append(''+
					'<div class="product fa-red-br" align="center">'+
						'<div class="product-link"><img src="'+item.img+'" class="product-image">'+
							'<div class="product-meta">'+
								'<div class="product-title">'+ item.desc +'</div>'+
								'<div class="product-price fa-red" id="productPrice">&#8369;'+item.price+'</div>'+ 
								'<div class="product-button mb-3"><button class="btn btn-light fa-btn fa-red-br fa-red rounded-0" data-toggle="modal" data-target="#productModal" data-id="'+item.id+'" data-price="'+item.price+'" data-desc="'+item.desc+'" data-webdesc="'+item.web_desc+'" data-partno="'+item.partNo+'">ORDER</button></div>'+
							'</div>'+
						'</div>'+
					'</div>'
					);
					temp_ctr ++;
				}); 

			   	setTimeout(function(){
			   		GetProducts(token);
			   	},100);
				
				
			}else if(data.statusCode == 0){
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
			}else if(data.statusCode == 2){
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
			}
		});
	});
}

function GetCart(token){
	var token = readCookie('token');
	ajaxWithHeader(api+"cart/getCart",{},token,function(data){
	 
		if(data.statusCode == 1){  

			$('#noItem').addClass('d-none');
			$('#cartParent').removeClass('d-none');
			$('#checkOut').prop('disabled', false);
			var ct  = data.data.items;
			// var tb = $('#cart-Table');
			// tb.html('');
			$('#cart-TableMD').html('');
			var ttl = 0;
			for(var i = 0; i <= data.data.count - 1; i++){
				var amt = ct[i].price * ct[i].qty;
				ttl += amt;
				// tb.append(''+
				// 		'<tr id="'+ct[i].id+'">'+
		  //   				'<td><img src="assets/fa-logo.jpeg" class="product-image" height="80px;" width="80px"></td>'+
		  //   				'<td>'+ct[i].partDesc+' <br><button class="btn btn-link fa-red" onclick="removeItem('+ct[i].id+');"><i class="fas fa-trash"></i> Delete</button></td>'+
		  //   				'<td>&#8369;'+ct[i].price+'</td>'+
		  //   				'<td><input type="number" id="upPrice" class="form-control rounded-0 transparent-bg" value="'+ct[i].qty+'" onblur="updateAmt($(this).val(), '+ct[i].price+', '+ct[i].id+');" min="1"></td>'+
		  //   				'<td>&#8369;<span id="cartAmt">'+addComma(amt.toFixed(2))+'</span></td>'+
			 //    		'</tr>'+
				// 	'');
				$('#cart-TableMD').append(''+
						'<tr id="'+ct[i].id+'">'+
		    				'<td><img src="'+ct[i].img+'" class="product-image" height="80px;" width="80px"></td>'+
		    				'<td>'+ct[i].partDesc+' <br><button class="btn btn-link fa-red" onclick="removeItem('+ct[i].id+','+amt+');"><i class="fas fa-trash"></i> Delete</button></td>'+
		    				'<td>&#8369;'+ct[i].price+'</td>'+
		    				'<td><input type="number" id="upPrice" class="form-control rounded-0 transparent-bg" value="'+ct[i].qty+'" onblur="updateAmt($(this).val(), '+ct[i].price+', '+ct[i].id+');" min="1"></td>'+
		    				'<td>&#8369;<span id="cartAmt">'+addComma(amt.toFixed(2))+'</span></td>'+
			    		'</tr>'+
					'');
			}

			ttl = ttl.toFixed(2);
			sub_total = ttl;
			ttl = addComma(ttl);
			$('#ttl').html(ttl);
			//console.log('GetCart | cart-TableMD : ' + sub_total);
			getCharges(token);
			getCartSize();
		}else if(data.statusCode == 2){
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
				sub_total = 0;
		}else{
			$('#cartParent').addClass('d-none');
			$('#noItem').removeClass('d-none');
			$('#ttl').html("0.00");
			$('#checkOut').prop('disabled', true);
		}
		
	});
}

function GetCart2(token){
	var token = readCookie('token');
	ajaxWithHeader(api+"cart/getCart",{},token,function(data){
		//console.log(data);
		if(data.statusCode == 1){
			$('#noItem').addClass('d-none');
			$('#cartParent').removeClass('d-none');
			$('#checkOut').prop('disabled', false);
			var ct  = data.data.items;
			var tb = $('#cart-Table');
			tb.html('');
			// $('#cart-TableMD').html('');
			var ttl = 0;
			for(var i = 0; i <= data.data.count - 1; i++){
				var amt = ct[i].price * ct[i].qty;
				ttl += amt;
				tb.append(''+
						'<tr id="'+ct[i].id+'">'+
		    				'<td><img src="'+ct[i].img+'" class="product-image" height="80px;" width="80px"></td>'+
		    				'<td>'+ct[i].partDesc+' <br><button class="btn btn-link fa-red" onclick="removeItem('+ct[i].id+','+amt+');"><i class="fas fa-trash"></i> Delete</button></td>'+
		    				'<td>&#8369;'+ct[i].price+'</td>'+
		    				'<td><input type="number" id="upPrice" class="form-control rounded-0 transparent-bg" value="'+ct[i].qty+'" onblur="updateAmt($(this).val(), '+ct[i].price+', '+ct[i].id+');" min="1"></td>'+
		    				'<td>&#8369;<span id="cartAmt">'+addComma(amt.toFixed(2))+'</span></td>'+
			    		'</tr>'+
					'');
				// $('#cart-TableMD').append(''+
				// 		'<tr id="'+ct[i].id+'">'+
		  //   				'<td><img src="assets/fa-logo.jpeg" class="product-image" height="80px;" width="80px"></td>'+
		  //   				'<td>'+ct[i].partDesc+' <br><button class="btn btn-link fa-red" onclick="removeItem('+ct[i].id+');"><i class="fas fa-trash"></i> Delete</button></td>'+
		  //   				'<td>&#8369;'+ct[i].price+'</td>'+
		  //   				'<td><input type="number" id="upPrice" class="form-control rounded-0 transparent-bg" value="'+ct[i].qty+'" onblur="updateAmt($(this).val(), '+ct[i].price+', '+ct[i].id+');" min="1"></td>'+
		  //   				'<td>&#8369;<span id="cartAmt">'+addComma(amt.toFixed(2))+'</span></td>'+
			 //    		'</tr>'+
				// 	'');
			}
			ttl = ttl.toFixed(2);
			sub_total = ttl;
			$('#ttl').data('total', ttl);
			ttl = addComma(ttl);
			$('#ttl').html(ttl);
			//console.log('GetCart2 | cartParent : ' + sub_total);
			getCharges(token);
			getCartSize();
		}else if(data.statusCode == 2){
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
			$('#cartParent').addClass('d-none');
			$('#noItem').removeClass('d-none');
			$('#ttl').html("0.00");
			$('#checkOut').prop('disabled', true);
		}
		
	});
}
 
function addToCart(product){
	var token = checkToken();
	//console.log(product.partNo);
	var data = {
		partID 		: product.prodID,
		partDesc 	: product.description,
		partNo 		: product.partNo,
		qty 		: product.qty,
		price 		: product.price
	}; 
 
	ajaxWithHeader(api+"cart/add_to_cart",data,token,function(data){
		if(data.statusCode == 1){
			//console.log(data); 
			// window.location.href="shop.html";
			var token = checkToken();
			GetCart(token);
			$('#cartModal').modal('toggle');
		}else if(data.statusCode == 2){
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
		}else if( data.statusCode == 3){
				var dialog = bootbox.dialog({
								message: '<p class="fa-red lead gothic">Your order exceeds the allowable purchase limit.</p>',
								buttons: {
								    ok: {
								        label: "OK",
								        className: 'fa-red-bg text-light',
								        callback: function(){
								            //
								        }
								    }
								}
							});
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

function checkOut(){
	var token = checkToken(); 

	ajaxWithHeader(api+"cart/getCart",{},token,function(data){
		
		if(data.statusCode == 1){
			var items = data.data.items;
			var amt = 0;
			var pd = [];

			for(var i = 0; i <= data.data.count -1; i++){

				var obj = {};
				obj.prodID = items[i].partID;
				obj.status = "PENDING";
				obj.description = items[i].partDesc;
				obj.partNo = items[i].partNo;
				obj.qty = items[i].qty;
				obj.price = items[i].price;
				obj.amount = items[i].qty * items[i].price;
				//console.log(obj);
				pd.push(obj);

				amt = amt + (items[i].qty * items[i].price);
			}
			var data = { 
				checkout_type_selected : checkout_type_selected,
				amount 		: amt,
				details		: pd
			};
			//console.log(data);
			ajaxWithHeader(api+"order/add_new_order_request",data,token,function(data){
				if(data.statusCode == 1){
					$.notify({
						title: '<strong>Cart Updated.</strong>',
						message: 'Checkout Success'
					},{
						type: 'success',
						newest_on_top: true,
						offset: {
						x: 0,
						y: 20
					}
					});
					setTimeout(
						function(){
							window.location.href="shop.html";
						}, 1500);
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
		}else if(data.statusCode == 2){
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
		}else if( data.statusCode == 3){
				var dialog = bootbox.dialog({
								message: '<p class="fa-red lead gothic">Your order exceeds the allowable purchase limit.</p>',
								buttons: {
								    ok: {
								        label: "OK",
								        className: 'fa-red-bg text-light',
								        callback: function(){
								            //
								        }
								    }
								}
							});
		}
	});
}

function emptyCart(){
	var token = readCookie('token');
	ajaxWithHeader(api+"cart/deleteCart",{},token,function(data){
		if(data.statusCode == 1){
			$.notify({
				title: '<strong>Cart Emptied.</strong>',
				message: data.statusDescription
			},{
				type: 'success',
				newest_on_top: true,
				offset: {
						x: 0,
						y: 20
					}
			});
			setTimeout(
				function(){
					// window.location.href="shop.html";
					var token = checkToken();
					GetCart(token);
				}, 1500);
		}else if(data.statusCode == 2){
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

function removeItem(a,tprice){
	var token = readCookie('token');
	ajaxWithHeader(api+"cart/deleteFromCart",{"cartID": a},token,function(data){
		if(data.statusCode == 1){
			$.notify({
				title: '<strong>Cart Updated.</strong>',
				message: data.statusDescription
			},{
				type: 'success',
				newest_on_top: true,
				offset: {
						x: 0,
						y: 20
					}
			});

			//getCharges(token);
			//console.log('tprice: '+tprice);
			sub_total = sub_total - tprice;
			//console.log('sub_total: '+sub_total);
			setTimeout(
				function(){
					// window.location.href="shop.html";
					var token = checkToken();
					if($('#cart-TableMD').length == 0) {
						GetCart2(token);
					}else{
						GetCart(token);
					}
				}, 1500);
			// console.log('REMOVINE ITEM');
			getCharges(token);
		}else if(data.statusCode == 2){
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

function updateAmt(a,b,c){
	var str = '#'+c;
	$(str).find('span').html((a*b).toFixed(2));
	var token = readCookie('token');
	ajaxWithHeader(api+"cart/updateCart",{"cartID": c, "qty": a},token,function(data){
		if(data.statusCode == 1){
			$.notify({
				title: '<strong>Cart Updated.</strong>',
				message: data.statusDescription
			},{
				type: 'success',
				newest_on_top: true,
				offset: {
						x: 0,
						y: 20
					}
			});
			//console.log('updateAmt | ' + sub_total);
			setTimeout(
				function(){
					// window.location.href="shop.html";
					var token = checkToken();
					GetCart(token);
				}, 1500);
		}else if(data.statusCode == 2){
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

var sub_total = 0;
var delFee = 0;
var webFee = 0;
var oFee = 0;
var o2Fee = 0;
var grandTotal = 0;
var checkout_type_selected = null;

function getCharges(token) {

	getSelectedCheckoutAmount(); 
	//console.log('asd: ' + sub_total);
	// ajaxWithHeader(api+"customer/getCharges",{},token,function(data){

	// 	if(data.statusCode == 1){
	// 	   	var fees = data.data;
	//  	   	var subttl = $('#ttl').data('total');
	// // 	   	//console.log(fees);
		   	
	// 	   	var df = $('#subttl');
	// 	   	var df = $('#delFee');
	// 	   	var wf = $('#webFee');
	// 	   	var of = $('#otherFee');
	// 	   	var of2 = $('#otherFee2');
	// 	   	var gt = $('#gttl');

	// 	     delFee 	= nullToNum(fees.deliveryFee);
	// 	   	 webFee 	= nullToNum(fees.webFee);
	// 	   	 oFee 		= nullToNum(fees.otherCharges1);
	// 	   	 o2Fee 		= nullToNum(fees.otherCharges2);

	// 	   	//console.log('subttl:'+subttl);
	// 	   	//console.log(delFee);
	// 	   	//console.log(webFee);
	// 	   	//console.log(oFee);
	// 	   	//console.log(o2Fee);		
		   

	// 	   	grandTotal = Number(sub_total) + Number(delFee) + Number(webFee) + Number(oFee) + Number(o2Fee);
	// // 	   	//console.log('gt: ' + grandTotal);

	// 	   	df.html('');
	// 	   	wf.html('');
	// 	   	of.html('');
	// 	   	of2.html('');
	// 	   	gt.html('');

	// 		df.data('total', delFee);
	// 		delFee = addComma(parseFloat(delFee).toFixed(2));
	// 		df.html(delFee);

	// 		wf.data('total', webFee);
	// 		webFee = addComma(parseFloat(webFee).toFixed(2));
	// 		wf.html(webFee);

	// 		of.data('total', oFee);
	// 		oFee = addComma(parseFloat(oFee).toFixed(2));
	// 		of.html(oFee);

	// 		of2.data('total', o2Fee);
	// 		o2Fee = addComma(parseFloat(o2Fee).toFixed(2));
	// 		of2.html(o2Fee);

	// 		gt.data('total', grandTotal);
	// 		if(isNaN(grandTotal) ){ 
	// 			grandTotal = 0;
	// 		}
	// 		grandTotal = addComma(parseFloat(grandTotal).toFixed(2)); 
	// 		gt.html(grandTotal);


	// 	}else if(data.statusCode == 0){
	// 		$.notify({
	// 			title: '<strong>Something Went Wrong!</strong>',
	// 			message: data.statusDescription
	// 		},{
	// 			type: 'danger',
	// 			newest_on_top: true,
	// 			offset: {
	// 					x: 0,
	// 					y: 20
	// 				}
	// 		});
	// 	}
	// });
}

function ChargeDisplayer(){
	var df = $('#subttl');
		   	var df = $('#delFee');
		   	var wf = $('#webFee');
		   	var of = $('#otherFee');
		   	var of2 = $('#otherFee2');
		   	var gt = $('#gttl'); 

		   	grandTotal = Number(sub_total) + Number(delFee) + Number(webFee) + Number(oFee) + Number(o2Fee);
	// 	   	//console.log('gt: ' + grandTotal);

		   	df.html('');
		   	wf.html('');
		   	of.html('');
		   	of2.html('');
		   	gt.html('');

			df.data('total', delFee);
			delFee = addComma(parseFloat(delFee).toFixed(2));
			df.html(delFee);

			wf.data('total', webFee);
			webFee = addComma(parseFloat(webFee).toFixed(2));
			wf.html(webFee);

			of.data('total', oFee);
			oFee = addComma(parseFloat(oFee).toFixed(2));
			of.html(oFee);

			of2.data('total', o2Fee);
			o2Fee = addComma(parseFloat(o2Fee).toFixed(2));
			of2.html(o2Fee);

			gt.data('total', grandTotal);
			if(isNaN(grandTotal) ){ 
				grandTotal = 0;
			}
			grandTotal = addComma(parseFloat(grandTotal).toFixed(2)); 
			gt.html(grandTotal);
}

function rdbCheckoutChange(){
	var token = checkToken();
	$('#rdb1').on('click',function(){
		getCharges(token);
	});
	$('#rdb2').on('click',function(){
		getCharges(token);
	});
	$('#rdb3').on('click',function(){
		getCharges(token);
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
	        	//return response.data.checkout_type_amount;
    	        if(type == 'schedule_delivery'){
    	        	checkout_type_selected = 'schedule_delivery';
    	        	delFee 	= response.data.checkout_type_amount;
    				webFee 	= 0;
    				oFee 	= 0;
    				o2Fee 	= 0;
    	        	//console.log('1: ');
    	        	ChargeDisplayer();
    	        }
    	        if(type == 'pick_up'){
    	        	checkout_type_selected = 'pick_up';
    	        	delFee 	= 0;
    				webFee 	= 0;
    				oFee 	= 0;
    				o2Fee 	= 0;
    	        	//console.log('2: ');
    	        	ChargeDisplayer();
    	        }
    	        if(type == 'special_delivery'){
    	        	checkout_type_selected = 'special_delivery';
    	        	delFee 	= 0;
    				webFee 	= 0;
    				oFee 	= response.data.checkout_type_amount;
    				o2Fee 	= 0;
    	        	//console.log('3: ');
    	        	ChargeDisplayer();
    	        }
			});
	    }
	}
}

function getCustomerDetails(token){

	ajaxWithHeader(api+"customer/getCustomerDetails",{},token,function(data){
		//console.log(data);

		if(data.statusCode == 1){

			var info = data.data;

		   	var addr = $('#addr');
		   	var name = $('#name');
		   	var email = $('#email');
		   	var cnum = $('#cnum');

		   	addr.html('');
		   	name.html('');
		   	email.html('');
		   	cnum.html('');

		   	addr.html(nullToNA(info.address));
		   	name.html(nullToNA(info.customerName));
		   	email.html(nullToNA(info.emailAddress));
		   	cnum.html(nullToNA(info.mobile));

		}else if(data.statusCode == 0){
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
function nullToNum(num){
	if(num == null){
		return parseFloat("0.00");
	}else{
		return num;
	}
}

function nullToNA(str){
	if(str == "" || str.length == 0){
		return "N/A"
	}else{
		return str;
	}
}

function productSearching(){
	$('#txt_search').keyup(function(){ 
		setTimeout(function(){ 
			$('#productsDiv').empty();
			//console.log('you fucking pressed a key!');
			var input = $('#txt_search').val();
			input = input.trim();
			
			if(input == '' || input == null){
				redisplayProduct(true,product_master_list,input.toUpperCase());
			}else{
				redisplayProduct(false,product_master_list,input.toUpperCase());
			}
			
		}, 0);
	});
} 

function redisplayProduct(sresult,items,input){
	var product_new_list = [];
	$('#productsDiv').empty();
	if(sresult == false){ 
		items.forEach((item)=>{   
			item_name = item.desc.toUpperCase(); 
			if(item_name.substring(0, input.length) == input){ 
				product_new_list.push(item); 
			}
		});    
	}else{
		product_new_list = items;
	}

	product_new_list.forEach((item)=>{   
 		$('#productsDiv').append(''+
		'<div class="product fa-red-br" align="center">'+
			'<div class="product-link"><img src="'+item.img+'" class="product-image">'+
				'<div class="product-meta">'+
					'<div class="product-title">'+item.desc+'</div>'+
					'<div class="product-price fa-red" id="productPrice">&#8369;'+item.price+'</div>'+
					'<div class="product-button mb-3"><button class="btn btn-light fa-btn fa-red-br fa-red rounded-0" data-toggle="modal" data-target="#productModal" data-id="'+item.id+'" data-price="'+item.price+'" data-desc="'+item.desc+'" data-partno="'+item.partNo+'">ORDER</button></div>'+
				'</div>'+
			'</div>'+
		'</div>'
		);
	}); 
}