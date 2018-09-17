$(document).ready(function(){

	getHistory();
	var cus_code = getCookie('customer_code');
	$('#customer_code').text(cus_code);
});

function historyCount(){
	var token = readCookie('token');
	ajaxWithHeader(api+"order/countReqHistory",{},token,function(data){
		if(data.statusCode == 1){
			
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
function getHistory(){
	var token = readCookie('token');
	ajaxWithHeader(api+"order/getReqHistory",{"page": 0, "limit": 0},token,function(data){	

		if(data.statusCode == 1){

			var order = data.data;
			console.log(data.data); 
			$('#historyParent').DataTable({
				responsive: true,
				processing: true,
				data: order,
				columns: [
					{data: 'REQUESTID',
						fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
			            	$(nTd).html('<button class="btn btn-link text-light" onclick="getOrder('+oData.REQUESTID+');">'+oData.REQUESTID+'</button>');
		        		}
					},
					{data: 'AMOUNT',
						fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {

							// if(oData.OTHERS_FEE == null || oData.OTHERS_FEE == undefined){
							// 	oData.OTHERS_FEE = 0;
							// }

							// console.log(oData.AMOUNT ,oData.OTHERS_FEE );
							var xx = parseFloat(oData.AMOUNT);
							//var total = parseFloat(oData.AMOUNT) +  parseFloat(oData.OTHERS_FEE) ;
			            	$(nTd).html(''+addComma( xx.toFixed(2) )+'');
		        		}
					},
					{data: 'DATE'},
					{data: 'STATUS'},
					{data: 'DELIVERYSTATUS'},
					{data: 'CHECKOUT_TYPE'}
				]
			});	

			// var order = data.data;
			// var tb = $('#history-Table');
			// for(var i = 0; i <= order.length - 1; i++){
			// 	tb.append('<tr>'+
			// 				'<td><button class="btn btn-link fa-red" onclick="getOrder('+order[i].REQUESTID+');">'+order[i].REQUESTID+'</button></td>'+
		 //    				'<td>Php '+order[i].AMOUNT+'</td>'+
		 //    				'<td>'+order[i].DATE+'</td>'+
		 //    				'<td>'+order[i].STATUS+'</td>'+
			//     		'</tr>');

			// }
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

function getOrder(a){
	var token = readCookie('token');
	$('#orID').html('#'+a);
	ajaxWithHeader(api+"order/getDetails",{"requestID" : a},token,function(data){
		console.log(data);
		if(data.statusCode == 1){
			$('#orderDiv').removeClass('d-none');
			$('#historyDiv').addClass('d-none');
			var order = data.data;
			console.log(order);
			$('#orderParent').DataTable({
				responsive: true,
				data: order,
				columns: [
					{data: 'desc'},
					{data: 'price',
						fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
			            	$(nTd).html(''+addComma(oData.price)+'');
		        		}
					},
					{data: 'qty'},
					{data: 'amount',
						fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
			            	$(nTd).html(''+addComma(oData.amount)+'');
		        		}
					},
					{data: 'partNo'}
				]
			});

			// adding others fee
			$('#others_fee').insertAfter('#orderParent');
			$('#delivery_fee').text(data.delivery_fee);
			//

			// var order = data.data;
			// var tb = $('#order-Table');
			
			// for(var i = 0; i <= order.length - 1; i++){
			// 	tb.append('<tr>'+
			// 				'<td>'+order[i].desc+'</td>'+
		 //    				'<td>Php '+order[i].price+'</td>'+
		 //    				'<td>'+order[i].qty+'</td>'+
		 //    				'<td>'+order[i].amount+'</td>'+
		 //    				'<td>'+order[i].partNo+'</td>'+
			//     		'</tr>');
			// }
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