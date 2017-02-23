$(document).ready(function () {

    $('#searchBar').on('search', function () {
        // search logic here
        // this function will be executed on click of X (clear button)
        var text = $("#searchBar").val();
        console.log(text);
        if(text)
            window.location.href = './lookup.html?q=' + text;
    });

    $('#searchBar_Close').click(function() {
        $("#searchBar").val("");
    });

    //-----Button Verify OnClick-------------------------------------------------------
    $('#btn_verify').click(function() {
        var phone = $('#phone').val();
        if (phone) {
            $(this).attr("disabled", true);

            phone = $('#Country_Code').val() + phone.trim();

            $.ajax({
                type: "POST",
                url: ServiceBaseUrl + "/api/Verify",
                data: {
                    phone: phone
                },
                success: function(data, status, jqXHR) {
                    BeginCountDown(30);
                },
                error: function(xhr, status, error) {
                    MakeToast("Error");
                    $('#btn_verify').html("Send Verification Code");
                    $('#btn_verify').attr("disabled", false);
                }
            });

        } else {
            MakeToast("Phone enter a phone number");
        }
    });
    //-----Button Verify OnClick END-------------------------------------------------------

    $('#btn_SignUp').click(function() {
        var data = {
            Email: $('#sign_email').val().trim(),
            Password: $('#sign_password').val().trim(),
            ConfirmPassword: $('#cpassword').val().trim(),
            Phone: $('#Country_Code').val() + $('#phone').val().trim(),
            VerificationCode: $('#vcode').val().trim()
        };

        console.log(data);

        $.ajax({
            type: "POST",
            url: ServiceBaseUrl + "/api/Account/Register",
            data: data,
            success: function (data, status, jqXHR) {
                MakeToast("Success");
                onSignUpSuccess();
            },
            error: function (xhr, status, error) {
                console.log("ServerResponse:",xhr);
                
                if (xhr.status == 400) {
                    var response = xhr.responseJSON;
                    MakeToast(response.Message);
                    console.log(response.ModelState);

                    $.each(response.ModelState,
                        function(index, value) {

                            $.each(value,
                                function(ix, va) {
                                    MakeToast(va);
                                });
                        });
                } else {
                    MakeToast("Unexpected Error.");
                    MakeToast("Please check Internet Connection..");
                }
            }
        });//END of AJAX


    });

    $('#btn_Login').click(function() {
        var data = {
            Username: $('#email').val().trim(),
            Password: $('#password').val().trim(),
            grant_type: 'password'
        };
        console.log(data);
        $.ajax({
            type: "POST",
            url: ServiceBaseUrl + "/Token",
            data: data,
            success: function (data, status, jqXHR) {
                MakeToast("Success");
                console.log(data);
                onLoginSuccess(data);
            },
            error: function (xhr, status, error) {
                console.log("ServerResponse:", xhr);
                MakeToast("Login Failed");
            }
        });//END of AJAX

    });//END of Login

});//END of Ready

//------------------------ Counter -------------------------//
var CTR;
function BeginCountDown(count) {
    CTR = count;
    Tick();
}

function Tick() {
    
    if (CTR <= 0) {
        $('#btn_verify').html("Send Verification Code");
        $('#btn_verify').attr("disabled", false);
    } else {
        $('#btn_verify').html("Please wait... " + CTR + " seconds");
        CTR--;
        setTimeout(Tick, 1000);
    }
    
}
//------------------------ Counter END-------------------------//

function onSignUpSuccess() {
    $('#sign_email').val("");
    $('#sign_password').val("");
    $('#cpassword').val("");
    $('#phone').val("");
    $('#vcode').val("");

    $('#SignUpModal').modal('close');
}

function onLoginSuccess(data) {
    var accessToken = data.access_token;
    var username = data.userName;

    sessionStorage.apiAccessToken = accessToken;
    sessionStorage.userName = username;

    location.href = './address.html';
}