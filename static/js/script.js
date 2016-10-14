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

      /*  if(inputsVisible) {
            var request = $.ajax({
               url: "/login",
                method: "POST",
                data: { username: emailinput.val(), password: passwordinput.val()},
                dataType: "json"
            });

            request.done(function() {
                window.location = "/";
            });
        }*/

        if(inputsVisible) {
            $.ajax({
                url: "/login",
                data: {username: emailinput.val(), password: passwordinput.val()},
                type: "POST",
                success: function (result) {
                    window.location = "/";
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
