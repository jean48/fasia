$(document).ready(function(){
	auth();

});

//global variables
var ps 		= null;
var sort 	= null;
var limit 	= null;
var dFrom 	= null;
var dTo 	= null;


function auth(){
	if(ps == null){
		showLogin();
		$('#content').remove();
	}else{
		showContent();
		$('#login').remove(); 
	}
}

function login(){
	$('#btn_submit').on('click',function(){
		var pass = $('#txt_password').val().trim();
		
		limit = 10;
		var data = {
			password : pass,
			sort 	 : sort,
			limit    : limit,
			date_from: dFrom,
			date_to  : dTo
		};
		console.log(data);
		ajax(api+'subscribe/index',data,function(response){
			console.log(response);
			if(response.success == false){
				showWarning('Message',response.message);
				return;
			}
			ps = pass; 
			auth();
			
			// emailDisplayer(response.data);
			showTblSubs(response.data);
			
		});

	});
}

function showLogin(){
	// $('#app').append( 
	// 	'<div class="container-fluid d-flex" style="min-height: 80vh;" id="login">'+
	// 		'<div class="container align-self-center">'+
	// 			'<div class="row">'+
	// 				'<div class="col-md-8 col-lg-8 offset-lg-2 col-sm-8 offset-sm-2 border p-5">'+
	// 					'<div>'+
	// 					  '<div class="form-group row">'+
	// 					    '<div class="col-sm-12">'+
	// 					    	'<input type="password" id="txt_password" class="form-control rounded-0 fa-red-br transparent-bg gothic" placeholder="Enter Password">'+
	// 					    '</div>'+
	// 					  '</div>'+
	// 					  '<div class="form-group row">'+
	// 					  	'<div class="col ">'+
	// 					  		'<button id="btn_submit" class="btn btn-link fa-red-bg rounded-0 align-content-end text-light gothic">LOGIN</button>'+
	// 					  	'</div>'+
	// 					  '</div>'+
	// 					'</div>'+
	// 				'</div>'+
	// 			'</div>'+
	// 		'</div>'+
	//  	'</div>'
	// );
	$('#app').append(
		'<div class="container-fluid d-flex" style="min-height: 80vh; " id="login">'+
			'<div class="container align-self-center">'+
				'<div class="row">'+
					'<div class="col-md-8 col-lg-7 offset-lg-3 col-sm-8 offset-sm-2 px-5">'+
						'<div class="py-3 border border-opaque" >'+
						    '<h4 class="text-center w-100 text-light" > LOGIN </h4>'+
						'</div>'+

					    '<div class="px-5 pt-4 pb-3 border border-top-0 border-opaque">'+
					        '<div class="form-group row">'+
					            '<div class="col-sm-12">'+
					                '<input type="password" id="txt_password" class="form-control rounded-0 fa-red-br transparent-bg gothic" placeholder="Enter Password">'+
					            '</div>'+
					        '</div>'+
					        '<div class="form-group row">'+
					            '<div class="col ">'+
					                '<button id="btn_submit" class="btn btn-link fa-red-bg rounded-0 align-content-end text-light gothic">LOGIN</button>'+
					            '</div>'+
					        '</div>'+
					    '</div>'+
					'</div>'+
				'</div>'+
			'</div>'+
		'</div>'
	);
	login();
	LoginEnter();
}

function LoginEnter(){
	$('#txt_password').on('keydown', function (e) {
	    if (e.keyCode === 13) {
	        $('#btn_submit').trigger('click');
	    }
	});

}
function showContent(){
	$('#app').append( 
		'<div class="container mt-3" id="content" style="margin-top: 10%!important;" >'+
			'<div class="row d-flex justify-content-center">'+
				'<div class="col text-right">'+
					'<button class="btn btn-primary btn-sm" id="nani">Export to Excel</button>'+
				'</div>'+
			'</div>'+
			'<div class="row pt-1 pb-2 mt-3" >'+
				'<div class="col-md-4">'+
					'<div class="form-group">'+
						'<label for="" class="col-form-label text-light">Sort</label>'+
						'<select name="" id="function" class="form-control form-control-sm">'+
							'<option value="s">Subscribers</option>'+
							'<option value="ci">Contact Inquiry</option>'+
							'<option value="fi">Franchise Inquiry</option>'+
						'</select>'+
					'</div>'+
				'</div>'+
				'<div class="col-md-2">'+
					'<div class="form-group">'+
						'<label for="" class="col-form-label text-light">Sort</label>'+
							'<select name="" id="sort" class="form-control form-control-sm">'+
								'<option value="asc">ASC (date)</option>'+
								'<option value="desc">DESC (date)</option>'+
						'</select>'+
					'</div>'+
				'</div>'+
				'<div class="col-md-2">'+
					'<div class="form-group">'+
						'<label for="" class="col-form-label text-light">Limit</label>'+
						'<select name="" id="limit" class="form-control form-control-sm">'+
								'<option value="10">10</option>'+
								'<option value="25">25</option>'+
								'<option value="50">50</option>'+
								'<option value="100">100</option>'+
						'</select>'+
					'</div>'+
				'</div>'+
				'<div class="col-md-2">'+
					'<div class="form-group">'+
						'<label for="" class="col-form-label text-light">Date From</label>'+
						'<input type="text" id="datepicker_from" class="form-control form-control-sm">'+
					'</div>'+
				'</div>'+
				'<div class="col-md-2">'+
					'<div class="form-group">'+
						'<label for="" class="col-form-label text-light">Date To</label>'+
						'<input type="text" id="datepicker_to" class="form-control form-control-sm">'+
					'</div>'+
				'</div>'+
			'</div>'+
			
			'<div class="">'+
				'<div class="container px-4">'+
					'<table class="table table-striped table-responsive-lg table-sm w-100 table-dark" id="tblData">'+
						'<thead class="fa-red" >'+
							// '<th width="5%">#</th>'+
							// '<th width="75%">Email</th>'+
							// '<th width="20%">Date Subscribed</th>'+
						'</thead>'+
						'<tbody id="tbl-content">'+

						'</tbody>'+
					'</table>'+
				'</div>'+
			'</div>'+
		'</div>'
	);

	$( "#datepicker_from" ).datepicker();
	$( "#datepicker_to" ).datepicker();

	fromChange();
	toChange();
	sortChange();
	limitChange();
	functionChange();
	btnExport();
}

function sortChange(){
	$('#sort').on('change',function(){
		sort = this.value;
		// showEmails();
		/*-----------------*/
		var filter = $('#function').val();		
		getSelectedFilter(filter);
	});
}

function limitChange(){
	$('#limit').on('change',function(){
		limit = this.value;
		// showEmails();
		/*-----------------*/
		var filter = $('#function').val();		
		getSelectedFilter(filter);
	});
}

function fromChange(){
	$('#datepicker_from').on('change',function(){
		var result = isValidDate(this.value); 
		
		/*-----------------*/
		var filter = $('#function').val();	
		/*-----------------*/
		
		if(!result){
			showWarning('Message','You enter invalid date');
			dFrom = null;
			this.value = '';
			this.focus();

			//showEmails(); 
			getSelectedFilter(filter); 
			return;
		}
		dFrom = this.value; 
		// showEmails();
		/*-----------------*/
		getSelectedFilter(filter);
	});
}

function toChange(){
	$('#datepicker_to').on('change',function(){
		var result = isValidDate(this.value);

		/*-----------------*/
		var filter = $('#function').val();	
		/*-----------------*/
		
		if(!result){
			showWarning('Message','You enter invalid date');
			dTo = null;
			this.value = '';
			this.focus();
 
			//showEmails(); 
			// showEmails();
			getSelectedFilter(filter); 
			return;
		}
		dTo = this.value + " 23:59:59";
		// showEmails();
		/*-----------------*/
				
		getSelectedFilter(filter);
	});
}

// function showEmails(){ 
// 	var data = {
// 		password : ps,
// 		sort 	 : sort,
// 		limit    : limit,
// 		date_from: dFrom,
// 		date_to  : dTo
// 	};
// 	console.log(data);
// 	ajax(api+'mail/franchise_inquiry/index',data,function(response){
// 		console.log(response);
// 		if(response.success == false){
// 			if(response.status == 401){
// 				showWarning('Message',response.message);
// 				ps = null;
// 				auth();
// 				return;
// 			}
// 			showWarning(response.message);
// 			return;
// 		}

// 		if(dFrom == null || dTo == null){
// 			showWarning('Message','Email list result was not filterd by Dates. Make sure you fill the two dates with valid date');
// 		}
		
// 		emailDisplayer(response.data);
// 	});
// }	

// function emailDisplayer(lists){

// 	//showSubsHeader();
// 	var ctr = 1;
// 	$('#tbl-content').empty();
// 	console.log(lists);
// 	// console.log(Object.keys(lists[0]).length);
// 	lists.forEach((item)=>{ 
// 		console.log(item);
// 		var date = moment(item.created_at).format('L');
// 		$('#tbl-content').append( 
// 			'<tr>'+
// 			'<td>'+ctr+'</td>'+
// 			'<td>'+item.email+'</td>'+
// 			'<td>'+date+'</td>'+
// 			'</tr>'
// 		);
// 		ctr++;
// 	});
// }

function isValidDate(str) {
  var d = moment(str,'M/D/YYYY');
  if(d == null || !d.isValid()) return false;

  return str.indexOf(d.format('M/D/YYYY')) >= 0 
      || str.indexOf(d.format('MM/DD/YYYY')) >= 0
      || str.indexOf(d.format('M/D/YY')) >= 0 
      || str.indexOf(d.format('MM/DD/YY')) >= 0;
}

function btnExport(){
	$('#nani').on('click',function(){
		var now = moment().format('MMMM Do YYYY, h:mm:ss a');
		var filename = 'Email List as of ' + now; 
		exportTableToExcel('tblData', filename);
	});
}

function exportTableToExcel(tableID, filename = ''){
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    filename = filename?filename+'.xls':'excel_data.xls';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
}

/*-------------new---------------*/

function functionChange(){
	$('#function').on('change', function(){
		var selected = $(this).val();
		getSelectedFilter(selected);
	});
}

// function sortChange(){
// 	$('#sort').on('change',function(){
// 		console.log("sort changed");
// 		sort = this.value;
// 		var filter = $('#function').val();
// 		console.log(filter);
// 		getSelectedFilter(filter);
// 	});
// }



// gets the selected filter (eg. subscribers, contact inquiry, )
function getSelectedFilter(selected){
	if (selected == 's') {
		showSubscribers();
	}else if (selected == 'ci') {
		showContactInq();
	}else if (selected == 'fi' ) {
		showFranchiseInq();
	}else{
		return;
	}
}

function showSubscribers(){
	sort = $('#sort').val();
	var data = {
		password : ps,
		sort 	 : sort,
		limit    : limit,
		date_from: dFrom,
		date_to  : dTo
	};
	console.log(data);
	ajax(api+'subscribe/index',data,function(response){
		console.log(response);
		if(response.success == false){
			if(response.status == 401){
				showWarning('Message',response.message);
				ps = null;
				auth();
				return;
			}
			showWarning(response.message);
			return;
		}

		if(dFrom == null || dTo == null){
			showWarning('Message','Email list result was not filterd by Dates. Make sure you fill the two dates with valid date');
		}
		
		showTblSubs(response.data);
	});	
}

function showTblSubs(lists){
	
	showSubsHeader();
	var ctr = 1;
	$('#tbl-content').empty();
	console.log(lists);
	// console.log(Object.keys(lists[0]).length);
	lists.forEach((item)=>{ 
		console.log(item);
		var date = moment(item.created_at).format('L');
		$('#tbl-content').append( 
			'<tr>'+
			'<td>'+ctr+'</td>'+
			'<td>'+item.email+'</td>'+
			'<td>'+date+'</td>'+
			'</tr>'
		);
		ctr++;
	});
}

function showSubsHeader(){
	
	$('#tblData > thead').empty();
	$('#tblData > thead').append(
		'<tr>'+
			'<th scope="col" width="5%">#</th>'+
			'<th scope="col" class="w-75">Email</th>'+
			'<th scope="col" width="w-25">Date Subscribed</th>'+
		'</tr>'

	);
}

function showFranchiseInq(){

	sort = $('#sort').val();

	var data = {
		password : ps,
		sort 	 : sort,
		limit    : limit,
		date_from: dFrom,
		date_to  : dTo
	};

	ajax(api+'mail/franchise_inquiry/index',data,function(response){
		console.log('showFranchiseInq');
		console.log(response);
		if(response.success == false){
			if(response.status == 401){
				showWarning('Message',response.message);
				ps = null;
				auth();
				return;
			}
			showWarning(response.message);
			return;
		}

		if(dFrom == null || dTo == null){
			showWarning('Message','Email list result was not filterd by Dates. Make sure you fill the two dates with valid date');
		}
		
		showTblFranchInq(response.data);
	});	
}

function showFranchiseHeader(){
	
	$('#tblData > thead').empty();
	$('#tblData > thead').append(
		'<tr>'+
		'<th scope="col">#</th>'+
		'<th scope="col">First name</th>'+
		'<th scope="col">Last name</th>'+
		'<th scope="col">Locality</th>'+
		'<th scope="col">Brand</th>'+
		'<th scope="col">Location</th>'+
		'<th scope="col">Email</th>'+
		'<th scope="col">Contact Number</th>'+
		'<th scope="col">Home Address</th>'+
		'<th scope="col">Remarks</th>'+
		'<th scope="col">Date Sent</th>'+
		'</tr>'
	);
}

function showTblFranchInq(lists){
	showFranchiseHeader();
	var ctr = 1;
	$('#tbl-content').empty();
	console.log(lists);
	// console.log(Object.keys(lists[0]).length);
	lists.forEach((item)=>{ 
		console.log(item);
		var date = moment(item.created_at).format('L');
		$('#tbl-content').append( 
			'<tr>'+
				'<td>'+ctr+'</td>'+
				'<td>'+item.first_name+'</td>'+
				'<td>'+item.last_name+'</td>'+
				'<td>'+item.locality+'</td>'+
				'<td>'+item.brand+'</td>'+
				'<td>'+item.proposed_location+'</td>'+
				'<td>'+item.email+'</td>'+
				'<td>'+item.contact_number+'</td>'+
				'<td>'+item.home_address+'</td>'+
				'<td>'+item.remarks+'</td>'+
				'<td>'+date+'</td>'+
			'</tr>'
		);
		ctr++;
	});
}

function showContactInq(){

	sort = $('#sort').val();

	var data = {
		password : ps,
		sort 	 : sort,
		limit    : limit,
		date_from: dFrom,
		date_to  : dTo
	};


	ajax(api+'mail/contact_inquiry/index',data,function(response){
		console.log('showContactInq');
		console.log(response);
		if(response.success == false){
			if(response.status == 401){
				showWarning('Message',response.message);
				ps = null;
				auth();
				return;
			}
			showWarning(response.message);
			return;
		}

		if(dFrom == null || dTo == null){
			showWarning('Message','Email list result was not filterd by Dates. Make sure you fill the two dates with valid date');
		}
		
		showTblContactInq(response.data);
	});	
}

function showContactInqHeader(){

	$('#tblData > thead').empty();
	$('#tblData > thead').append(
		'<tr>'+
		'<th scope="col">#</th>'+
		'<th scope="col">First name</th>'+
		'<th scope="col">Last name</th>'+
		'<th scope="col">Email</th>'+
		'<th scope="col">Contact Number</th>'+
		'<th scope="col">Subject</th>'+
		'<th scope="col" class="w-25">Message</th>'+
		'<th scope="col">Date Sent</th>'+
		'</tr>'
	);
}

function showTblContactInq(lists){
	showContactInqHeader();
	var ctr = 1;
	$('#tbl-content').empty();
	console.log(lists);
	// console.log(Object.keys(lists[0]).length);
	lists.forEach((item)=>{ 
		console.log(item);
		var date = moment(item.created_at).format('L');
		$('#tbl-content').append( 
			'<tr>'+
				'<td>'+ctr+'</td>'+
				'<td>'+item.first_name+'</td>'+
				'<td>'+item.last_name+'</td>'+
				'<td>'+item.email+'</td>'+
				'<td>'+item.contact_number+'</td>'+	
				'<td>'+item.subject+'</td>'+
				'<td>'+item.message+'</td>'+
				'<td>'+date+'</td>'+
			'</tr>'
		);
		ctr++;
	});
}