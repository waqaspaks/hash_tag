$(document).ready(function() {
  var formValidate = $('#register-form').validate({
    rules: {
      username: {
        email: true,
        required: true
      },
      password: {
        required: true,
        minlength: 6
      },
      'confirm-password': {
        required: true,
        equalTo: password
      },
      agreement: {
        required: true
      }
    },
    highlight: function(element) {
      $(element).closest('.form-group').addClass('has-error');
    },
    unhighlight: function(element) {
      $(element).closest('.form-group').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) {
      if (element.parent('.input-group').length) {
        error.insertAfter(element.parent());
      } else {
        error.insertAfter(element);
      }
    },
    submitHandler: function(form) {
      form.submit();
      /*var emailAddress = $("#email-address").val();
      var password = $("#password").val();
      var dataReqRaw = {
        emailAddress: emailAddress,
        password: password
      };
      var dataReq = JSON.stringify(dataReqRaw);
      console.log(dataReq);
      $.ajax({
        type: "POST",
        url: "/registerUser",
        data: dataReq,
        contentType: 'application/json',
        success: function(res) {
          console.log(res);
          setToken(res.authToken);
          setUserInfo(res.userEmail);

          console.log(getToken());
          console.log(getUserInfo());
        },
        error: function(err) {
          console.log(err)
        }
      });*/
    }
  });
});
