(function($){
  $(function(){

    $('.button-collapse').sideNav();
    $('.scrollspy').scrollSpy();
    $('.modal').modal();
    $('select').material_select();
    $('ul.tabs').tabs({swipeable: true});
  }); // end of document ready
})(jQuery); // end of jQuery name space

function MakeToast(data) {
    Materialize.toast(data, 4000);
}

$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    else {
        return results[1] || 0;
    }
}




//App Settings
var ServiceBaseUrl = "http://addrservice.akashpavate.in";
//http://addrservice.akashpavate.in
//http://localhost:54704