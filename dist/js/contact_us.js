$(document).ready(function(){

	$('#btn_submit').on('click',function(){
		var first_name 		= $('#first_name').val();
		var last_name 		= $('#last_name').val();
		var email_address 	= $('#email_address').val();
		var contact_number 	= $('#contact_number').val();
		var subject 		= $('#subject').val();
		var message 		= $('#message').val();

		if(first_name == ''){
			showWarning('Required.','First name is required.');
			return;
		}

		if(last_name == ''){
			showWarning('Required.','Last name is required.');
			return;
		}

		if(email_address == ''){
			showWarning('Required.','Email address is required.');
			return;
		}

		if (validateEmail(email_address) == false) {
			showWarning('Invalid','Please provide a valid email address');
			return;
		}

		
		if(contact_number == ''){
			showWarning('Required.','Contact number is required.');
			return;
		}

		if (validateMobile(contact_number) == false) {
			showWarning("Invalid.", "Please provide a valid contact number");
			return; 
		}

		if(subject == ''){
			showWarning('Required.','Subject is required.');
			return;
		}

		if(message == ''){
			showWarning('Required.','Message is required.');
			return;
		}

		//POST
		var data = {
			first_name 		: first_name,
			last_name 		: last_name,
			email_address 	: email_address,
			contact_number 	: contact_number,
			subject 		: subject,
			message 		: message
		};
		ajax(api+'mail/contact_inquiry',data,function(data){

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