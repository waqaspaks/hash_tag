$(document).ready(function () {
    setTimeout(function () {
        $("#js-loader").fadeOut();
    }, 3000);
    var validators = $('#login-form').validate({
        rules: {
            username: {
                required: true
            },
            password: {
                required: true
            }
        },
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function (error, element) {
            if (element.parent('.input-group').length) {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        },
        submitHandler: function (form) {
            $(".errMessage").html('');
            form.submit();
            var _username = $("#username").val();
            var _password = $("#password").val();
            var dataReqRaw = {
                username: _username,
                password: _password
            };
            var dataReq = JSON.stringify(dataReqRaw);
            //console.log(dataReq);
            /*$.ajax({
                type: "POST",
                url: "/api/loginUser",
                data: dataReq,
                contentType: 'application/json',
                success: function (res) {
                    console.log(res);
                    setToken(res.authToken);
                    setUserInfo(res.userEmail);

                    console.log(getToken());
                    console.log(getUserInfo());

                    window.location.href = "/casedesign";
                },
                error: function (err) {
                    console.log(err)
                }
            });*/
        }
    });

    var forgetValidator = $('#forget-passowrd-form').validate({
        rules: {
            emailAddress: {
                required: true,
                email: true
            }
        },
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        unhighlight: function (element) {
            $(element).closest('.form-group').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function (error, element) {
            if (element.parent('.input-group').length) {
                error.insertAfter(element.parent());
            } else {
                error.insertAfter(element);
            }
        },
        submitHandler: function (form) {
            $("#js-loader").fadeIn();
            $("#form-error-message").html('');
            var _emailAddress = $("#emailAddress").val();
            var dataReqRaw = {
                emailaddress: _emailAddress
            };
            var dataReq = JSON.stringify(dataReqRaw);
            console.log(dataReq);
            $.ajax({
                type: "POST",
                url: "/api/sendUserPasswordInformation",
                data: dataReq,
                contentType: 'application/json',
                success: function (res) {
                    console.log(res);
                    $("#form-error-message").html(mailRetRes);
                    $("#js-loader").fadeOut();
                },
                error: function (err) {
                    console.log(err);
                    $("#form-error-message").html(err.responseText);
                    $("#js-loader").fadeOut();
                }
            });
        }
    });

    $('#js-forget-passowrd').on('click', function () {
        $('#forget-password-popup').modal('show');
    });
});
