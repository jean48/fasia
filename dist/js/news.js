$(document).ready(function(){
    btn_subscribed();
});

function btn_subscribed(){
  $('#sub').on('click',function(){
      console.log('moew');
      var email = $('#email').val();
      if(email != '' || email != null){
        //console.log('ready to send');
          var data = {
            email : email
          };
          ajax(api+"subscribe",data,function(response){
              if(response.success == false){
                showWarning(response.message);
                return;
              }

              showWarning(response.message);
          }); 
      }else{
        //console.log('failed to send');
      } 
  });
}
