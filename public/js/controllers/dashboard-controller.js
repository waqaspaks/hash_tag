$(document).ready(function(){
$("#logout-user").on("click", function() {
    window.location.href = "/logout";
    /*$.ajax({
            type: "POST",
            url: "/api/logout",
            data: dataReq,
            contentType: 'application/json',
            success: function (res) {
                window.location.href = "/login";
            },
            error: function (err) {
                console.log(err)
            }
        });*/
  });
});
