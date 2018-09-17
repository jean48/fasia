
var url_modal = url+'/brands_modal.html';
console.log(url_modal);
var mod_container = $(".modal-cont");

$.get(url_modal, function(data){
  mod_container.append(data);
});



