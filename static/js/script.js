$(document).ready(function() {

    var btnLogin = $(".button#login");
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
                data: { username: emailinput.val(), password: passwordinput.val() },
                type: "POST",
                success: function (result) {
                    $('.alertbox').remove();
                    if (result.status == 'login-successful'){
                      window.location = "/";
                    }
                    else {
                      if($('.alertbox').length == 0){
                          showMessage(result.message, "danger");
                      }
                    }
                },
                error: function (err, status, thrown) {
                }
            });
        }
        inputsVisible = true;
    });


    var btnLogout = $(".button#logout");
    btnLogout.on("click", function() {
            $.ajax({
                url: "/logout",
                data: { "id": 1 },
                type: "POST",
                success: function (result) {
                    window.location = "/";
                }
            });

    });


    var btnAddArticle = $("#add--article");
    btnAddArticle.on("click", function() {
      tinyMCE.triggerSave(false, true);


      var tags = $('input[name=tags]').val();

      $.ajax({
          url: "/article/add",
          data: {
            "title": $('input[name=title]').val(),
            "subtitle": $('input[name=subtitle]').val(),
            "content": tinyMCE.activeEditor.getContent(),
            "tags": tags
          },
          type: "POST",
          success: function (result) {
            if (result == "article-added"){
                if($('.alertbox').length == 0) {
                    showMessage("Article succesful added.", "success");
                }
                window.setTimeout(function() {
                    window.location = "/";
                }, 5000);
            }
            else if (result == "not-loggedin") {
              if($('.alertbox').length == 0){
                  showMessage("You cannot add articles as a guest. Please log in.", "danger");
              }
            }
            else {
                if($('.alertbox').length == 0){
                    showMessage("Something went wrong! Check the logs.", "danger");
                }
            }
          },
          error: function (err, status, thrown) {
          }
      });

    });


    var btnSaveArticle = $("#save--article");
    btnSaveArticle.click(function() {
      console.log(window.location);
      tinyMCE.triggerSave(false, true);
      $.ajax({
          url: "/article/save",
          data: {
            "title": $('input[name=title]').val(),
            "subtitle": $('input[name=subtitle]').val(),
            "content": tinyMCE.activeEditor.getContent(),
            "tags": $('input[name=tags]').val(),
            "id": $('input[name=id]').val()
          },
          type: "POST",
          success: function (result) {
            if (result == "article-saved"){
                if($('.alertbox').length == 0) {
                    showMessage("Article succesful saved. You will be redirected to the last page.", "success");
                }
                window.setTimeout(function() {
                    window.location = document.referrer;
                }, 5000);
            }
            else if (result == "not-loggedin") {
              if($('.alertbox').length == 0){
                  showMessage("You cannot save articles as a guest. Please log in.", "danger");
              }
            }
            else {
                if($('.alertbox').length == 0){
                    showMessage("Something went wrong! Check the logs.", "danger");
                }
            }
          },
          error: function (err, status, thrown) {
          }
      });

    });

    var btnDeleteArticle = $("#delete--article");
    btnDeleteArticle.on("click", function() {

        $.ajax({
            url: "/article/delete",
            data: {
                "id": btnDeleteArticle.data("id")
            },
            type: "POST",
            success: function (result) {
                if (result == "article-deleted"){
                    if($('.alertbox').length == 0) {
                        showMessage("Article succesful deleted.", "success");
                    }
                    window.setTimeout(function() {
                        window.location = "/";
                    }, 5000);
                }
                else if (result == "not-loggedin") {
                    if($('.alertbox').length == 0){
                        showMessage("You cannot delete articles as a guest. Please log in.", "danger");
                    }
                }
                else {
                    if($('.alertbox').length == 0){
                        showMessage("Something went wrong! Check the logs.", "danger");
                    }
                }
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
  var element = '<div class="alertbox"><div class="alert alert-' + type + '" id="' + id + '"><button type="button" class="close" data-dismiss="alert">x</button>' + status + '</div></div>';
  $(element).insertBefore(".container.content");
  $("#"+id).fadeTo(2000, 500).slideUp(500, function(){
    $("#"+id).slideUp(500);
  });
}
