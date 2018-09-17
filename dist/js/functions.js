$(document).ready(function(){
    yearNow();
});
 
// function ajax(url,callback){
//     Pace.track(function(){
//         $.ajax({
//             url: url,
//             type: "GET",
//             dataType: "json",
//             success: function(data){
//                 callback(data);
//             },
//             error: function(data){
                
//                 $('#alertDiv').append(''+
//                     '<div class="alert alert-danger alert-dismissible fade show" role="alert">'+
//                     '<strong>Something Went Wrong!</strong>'+
//                     '<button type="button" class="close" data-dismiss="alert" aria-label="Close">'+
//                     '<span aria-hidden="true">&times;</span>'+
//                     '</button>'+
//                     '</div>');

//                 goToByScroll('alertDiv');

//             }
//         });
//     }); 
// }

function ajax(url,request,callback){
   // Pace.track(function(){
       $.ajax({
           url: url,
           type: "POST",
           dataType: "json",
           data : request,
           success: function(data){
               callback(data);
           },
           error: function(data){
               console.log(data);
           }
       });
   // });
}

function ajaxWithHeader(url,request,token,callback){
   // Pace.track(function(){
       $.ajax({
           url: url,
           headers: {"token" : token},
           type: "POST",
           dataType: "json",
           data : request,
           success: function(data){
               callback(data);
           },
           error: function(data){
               console.log(data);
           }
       });
   // });
}
 
// var api ="http://localhost:8000/api/";
var api ="http://localhost:8000/api/";
var url ="http://localhost:8080/apps/foodasia-web/"; 

// Cookies
function getCookie(name){

    var cookie = document.cookie;
    var prefix = name + "=";
    var begin = cookie.indexOf("; " + prefix);
    if (begin == -1) {
        begin = cookie.indexOf(prefix);
        if (begin != 0) return null;
    }else {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
        end = cookie.length;
        }
    }
    return unescape(cookie.substring(begin + prefix.length, end));

} 

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";

    // var fixedName = '<%= Request["formName"] %>';
    // name = fixedName + name;

    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}


function eraseCookie(name) {
    createCookie(name, "", -1);
}
function isLogin(){
    if(readCookie('token')!=null){
        return true;
    }
    else{
        return false;
    }
}


function eraseAllCookie(){
    document.cookie.split(";").forEach(function(c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });

}

function forceLogin(statusDescription){

        $.growl.error({
            location: "tc",
            title: "Error",
            message: statusDescription
                      
        });


        setTimeout(function () {
                logout();
        }, 700);

                    

       eraseAllCookie();
}

function logout(){
    $('.LogoutBtn').on("click",function(){
        window.location.href =url;
       eraseAllCookie();

    }); 
}

function forceLogout(){

    var delay = 1000;
    setTimeout(function(){ 
        window.location.href =url;
        eraseAllCookie();
    }, delay);
}

function isFloat(val) {
    var floatRegex = /^-?\d+(?:[.,]\d*?)?$/;
    if (!floatRegex.test(val))
        return false;

    val = parseFloat(val);
    if (isNaN(val))
        return false;
    return true;
}

function isInt(val) {
    var intRegex = /^-?\d+$/;
    if (!intRegex.test(val))
        return false;

    var intVal = parseInt(val, 10);
    return parseFloat(val) == intVal && !isNaN(intVal);
}

function getRowID(selector){
    return selector.parent().parent().data("pid");
}

function validEmail(selector) {

     var val = $(selector).val();
     var atpos=val.indexOf("@");
     var dotpos=val.lastIndexOf(".");
     // console.log(val);
     if (atpos<1 || dotpos<atpos+2 || dotpos+2>=val.length)
      { 
        return false;
      }
      else{
        return true;
      }
    // return (v.match(r) == null) ? false : true;
}

function isNull(selector){
    
    if($(selector).val().length <=0){
        return true;
    }
    else{
        return false;
    }
}
function isNullString(string){

    if(string.length <=0){
        return true;
    }
    else{
        return false;
    }
}




function checkFile(changedSelector) {
   var filename = $(changedSelector).val();
   var ext = getExt(filename);
    if(ext == "gif" || ext == "jpg" || ext=="png"){
        return true;
    }

    else{
        $(changedSelector).val('');
        return false;
    }
   
}
function getExt(filename) {
   var dot_pos = filename.lastIndexOf(".");
   if(dot_pos == -1)
      return "";
   return filename.substr(dot_pos+1).toLowerCase();
}

function uploadImage(changedSelector,imgBoxSelector){
    $(changedSelector).on('change', function() {

        var file_data = $(changedSelector).prop('files')[0];   
        var form_data = new FormData();                  
        form_data.append('file', file_data);
        if(!checkFile(changedSelector)){
            $(imgBoxSelector).attr("src", "");
            $.growl.error({
              title: "Inserting image failed",
              message: 'Please put a valid image'
            });
        }
        else{
            Pace.track(function(){
                $.ajax({
                            url: url+'promotions/uploadImage',
                            dataType: 'json',
                            cache: false,
                            contentType: false,
                            processData: false,
                            data: form_data,                         
                            type: 'post',
                            success: function(response){
                                // console.log(response);
                                // $("#imgBox").
                                if(response.statusCode == 0){
                                    $(imgBoxSelector).attr("src", response.uploadedURL);
                                }
                                else{
                                    $(imgBoxSelector).attr("src", "");
                                    $.growl.error({
                                      title: "Inserting image failed",
                                      message: 'Please put a valid image'
                                    });
                                }
                            }
                 });
            });
        }
    });
}





function displayPlaces(regionSelector,provinceSelector,citySelector){
    $(regionSelector).html("");
    var regionurl = url + "json/regions.json";
    // var url = "json/regions.json"
    ajax(regionurl,{},function(data){
        for(var i =0; i<data.length;i++){
            $(regionSelector).append("<option value="+data[i].key+">"+data[i].long+"</option>");
        }
        $(provinceSelector).html("");
        setProvince($(regionSelector).val(),provinceSelector,citySelector);
    });

    $(regionSelector).change(function(){
        $(provinceSelector).html("");
        var region = $(regionSelector).val();
        setProvince(region,provinceSelector,citySelector);
        
    });




    $(provinceSelector).change(function(){
        var province = $(provinceSelector).val();
        setCity(province,citySelector);
    });

   

}

function setProvince(region,provinceSelector,citySelector){

    var provinceurl = url + "json/provinces.json";
    ajax(provinceurl,{},function(data){
        $(citySelector).html("");
        for(var i =0 ; i<data.length ;i++){
            if(region==data[i].region){
                $(provinceSelector).append("<option value="+data[i].key+">"+data[i].name+"</option>");
            }
        }

        var province = $(provinceSelector).val();
        setCity(province,citySelector);
    });

    $(provinceSelector).change(function(){
        var province = $(provinceSelector).val();
        setCity(province);
    });
}

function setCity(province,citySelector){
    var cityurl = url + "json/cities.json";
    ajax(cityurl,{},function(data){
        // console.log(data);
        $(citySelector).html("");
        for(var i =0 ; i<data.length ;i++){
            if(province==data[i].province){
                $(citySelector).append("<option>"+data[i].name+"</option>");
            }
        }
    });

}


function setAddressFromAjax(region,provinceData,cityData,provinceSelector,citySelector){
    $(provinceSelector).html("");
    var url = "replaceCard/displayAllProvinces";
    ajax(url,{},function(data){
        $(citySelector).html("");
        // console.log(region);
        for(var i =0 ; i<data.data.length ;i++){
            if(region==data.data[i].RegionID){
                $(provinceSelector).append("<option value="+data.data[i].ProvinceID+">"+data.data[i].ProvinceName+"</option>");
            }
        }

        var province = $(provinceSelector).val(provinceData);
        setCityFromAjax(provinceData,cityData,citySelector);
    });

    $(provinceSelector).change(function(){
        var province = $(provinceSelector).val();
        setCityFromAjax(provinceData,cityData,citySelector);
    });
}

    function setCityFromAjax(province,cityData,citySelector){
        var url = "replaceCard/displayAllCities";
        ajax(url,{},function(data){
            $(citySelector).html("");
            for(var i =0 ; i<data.data.length ;i++){
                if(province==data.data[i].ProvinceID){
                    $(citySelector).append("<option value="+data.data[i].CityID+">"+data.data[i].CityName+"</option>");
                }
            }
             $(citySelector).val(cityData);
        });
    }

function setBrandModelFromAPI(brandID, modelID, modelSelector){
    $(modelSelector).html("");
    var url = "replaceCard/displayAllBrandModels";
    ajax(url,{},function(data){
        for(var i =0 ; i<data.data.length ;i++){
            if(brandID==data.data[i].LoyaltyMotorBrandID){
                console.log(modelSelector);
                $(modelSelector).append("<option value="+data.data[i].LoyaltyMotorBrandModelID+">"+data.data[i].LoyaltyMotorBrandModelName+"</option>");
            }
        }
        $(modelSelector).val(modelID);
    });

    // var province = $(modelSelector).val(modelID);
}

function goToByScroll(id){
      // Remove "link" from the ID
    id = id.replace("link", "");
      // Scroll
    $('html,body').animate({
        scrollTop: $("#"+id).offset().top},
        'slow');
}
function yearNow(){
    var dt = new Date();
    $('#yearSpan').html(dt.getFullYear());
}



function compareProduct(a, b) {
  // Use toUpperCase() to ignore character casing 
  const productA = a.desc.toUpperCase();
  const productB = b.desc.toUpperCase(); 
  var comparison = 0;
  if (productA > productB) {
    comparison = 1;
  } else if (productA < productB) {
    comparison = -1;
  }
  return comparison;
}



function showSuccess(title,message){
  $.notify({
      title: '<strong>'+title+'</strong>',
      message: message
    },{
      type: 'success',
      newest_on_top: true,
      offset: {
      x: 0,
      y: 20
    }
  });
}

function showWarning(title,message){
  $.notify({
      title: '<strong>'+title+'</strong>',
      message: message
    },{
      type: 'warning',
      newest_on_top: true,
      offset: {
      x: 0,
      y: 20
    }
  });
}

function showSuccessSub(title,message){
  $.notify({
      title: '<strong>'+title+'</strong>',
      message: message
    },{
      type: 'success',
      newest_on_top: true,
      offset: {
      x: 0,
      y: 20
    }
    ,
    delay:0
  });
}

function showWarningSub(title,message){
  $.notify({
      title: '<strong>'+title+'</strong>',
      message: message
    },{
      type: 'warning',
      newest_on_top: true,
      offset: {
      x: 0,
      y: 20
    }
    ,
    delay:0
  });
}

function validateEmail(email){
  var regEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // return re.test(email); //  code nila james
  if(!email.match(regEx)) return false;
}
 

function validateMobile(mobileString){
  //var regEx = /^(09|\+639)\d{9}$/;  
  var regEx = /^([ 0-9\(\)\+\-]{8,})*$/;
  if (!mobileString.match(regEx)) return false      
}