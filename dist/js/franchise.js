$(document).ready(function(){

	$('#btn_submit').on('click',function(){
		//alert('test');
		
		var locality 			= $('#locality').val();
		var brand				= $('#brand').val();
		var proposed_location 	= $('#proposed_location').val();
		var first_name 			= $('#first_name').val();
		var last_name 			= $('#last_name').val();
		var email_address 		= $('#email_address').val();
		var contact_number 		= $('#contact_number').val();
		var home_address 		= $('#home_address').val();
		var remarks 			= $('#remarks').val();

		if(locality == ''){
			 showWarning('Required.','Please select Locality');
			 return;
		}
 
		if(brand == ''){
			showWarning('Required.','Please select Brand');
			return;
		}

		if(proposed_location == ''){
			showWarning('Required.','Proposed Location is required');
			return;
		}

		if(first_name == ''){
			showWarning('Required.','First name is required');
			return;
		}
		
		if(last_name == ''){
			showWarning('Required.','Last name is required');
			return;
		}

		if(email_address == ''){
			showWarning('Required.','Email address is required');
			return;
		}

		if (validateEmail(email_address) == false) {
			showWarning('Invalid','Please provide a valid email address');
			return;
		}

		if(contact_number == ''){
			showWarning('Required.','Contact is required');
			return;
		}

		if (validateMobile(contact_number) == false) {
			showWarning("Invalid.", "Please provide a valid contact number");
			return;
		}


		if(home_address == ''){
			showWarning('Required.','Home address is required');
			return;
		}

		// if(remarks == ''){
		// 	showWarning('Required.','Remarks is required');
		// 	return;
		// }

		//POST 
		var data = { 
			locality 			: locality,
			brand				: brand,
			proposed_location 	: proposed_location,
			first_name 			: first_name,
			last_name 			: last_name,
			email_address 		: email_address,
			contact_number 		: contact_number,
			home_address 		: home_address,
			remarks 			: remarks
		};
		ajax(api+"mail/franchise_inquiry",data,function(data){

			if(data.success == false){
				showWarning('Server message',data.message);
			}

			showSuccess('Message',data.message);
			setTimeout(function () {
				location.reload();
			}, 500);


		});
		//END
	});

});

