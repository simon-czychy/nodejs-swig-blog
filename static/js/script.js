$(document).ready(function() {

    var btnLogin = $(".btn-login");
    var emailinput = $("input.username");
    var passwordinput = $("input.password");
    var inputsVisible = false;

    btnLogin.on("click", function() {
        fadeInInvisibleElement(emailinput, 100);
        fadeInInvisibleElement(passwordinput, 100);
        scaleElement(emailinput);
        scaleElement(passwordinput);

        if(inputsVisible) {
            $.ajax({
                url: "/login",
                data: {username: emailinput.val(), password: passwordinput.val()},
                type: "POST",
                success: function (result) {
                    $('.alertbox').remove();
                    if (result == 'login-successful'){
                      window.location = "/";
                    }
                    else if(result == 'user-not-found') {
                      //$('.alertbox').remove();
                      if($('.alertbox').length == 0){
                          showMessage(status, "danger");
                      }

                    }
                    else if(result == 'bad-pass') {
                    //  $('.alertbox').remove();
                      if($('.alertbox').length == 0){
                          showMessage(status, "danger");
                      }

                    }
                },
                error: function (err, status, thrown) {
                }
            });
        }

        inputsVisible = true;
    });


    var btnLogout = $(".btn-logout");
    btnLogout.on("click", function() {
            $.ajax({
                url: "/logout",
                data: {username: emailinput.val(), password: passwordinput.val()},
                type: "POST",
                success: function (result) {
                    window.location = "/";
                },
                error: function (err, status, thrown) {

                }
            });

    });
});

function fadeInInvisibleElement(element, time) {
    element.removeClass("hidden").animate({
        opacity: 1
    }, time, function () {
        //animation finished
    });
}

function scaleElement(element) {
    element.css("animation", "scaleToOrigin 0.35s")
    element.css("display", "flex");
}


function showMessage(status, type) {
  var id = type + '-alert';
  var element = '<div class="alertbox"><div class="alert alert-' + type + '" id="' + id + '"><button type="button" class="close" data-dismiss="alert">x</button><strong>Oops! </strong>User not found. Try again.</div></div>';
  $(element).insertBefore(".body");
  $("#"+id).fadeTo(2000, 500).slideUp(500, function(){
    $("#"+id).slideUp(500);
  });
}
