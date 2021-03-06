$(document).ready(function () {
    setTimeout(function () {
        $("#js-loader").fadeOut();
    }, 3000);

    localStorage.removeItem('logos');
    var username = $("#hdn-username").val();

    if (GetURLParameter('st') !== null) {
        var shopifyToken = GetURLParameter('st');
        console.log(shopifyToken);
        if (typeof shopifyToken !== 'undefined') {
            //var shopName = "lp-test-store.myshopify.com";

            var dataReqRaw = {
                shopifyToken: shopifyToken
            };
            var dataReq = JSON.stringify(dataReqRaw);
            $.ajax({
                type: "POST",
                url: "/api/saveshopifyToken",
                data: dataReq,
                contentType: 'application/json',
                success: function (res) {
                    console.log(res);
                    setShopifyAccessInfo(res);
                    console.log(getShopifyAccessInfo());
                },
                error: function (err) {
                    console.log(err)
                }
            });
        }
    }

    $("#logout-user").on("click", function () {
        window.location.href = "/logout";
    });

    //add the color picker
    $('#bg-color-picker').colorpicker({
        inline: false,
        format: 'hex',
        //container: "#bg-color-picker",
        //customClass: 'colorpicker-2x',
    }).on('changeColor', function (ev) {
        $('#bg-color-value').val(ev.color.toHex());
        $("#case-style").css('background-color', ev.color.toHex());
        $("#bg-color-display").css('background-color', ev.color.toHex());
    });

    //hashtag field functionality
    $("#hashtagfield").on('keyup', function (e) {

        if ($(this).val() == "") {
            $(".hashsign").hide();
            $("#hashtagtext").html("#typeyour<br>hashtag<br>here");
            $("#original_text").val("");
        } else {
            if ($('#plain-text').is(':checked')) {
                $(".hashsign").show();
                $("#hashtagtext").html($(this).val().replace(/\r?\n/g, '<br/>'));
            } else {
                $(".hashsign").hide();
                $("#hashtagtext").html("#" + $(this).val().replace(/\r?\n/g,
                    '<br/>').replace(/\s+/g, ''));
            }
            $("#original_text").val($(this).val().replace(/\r?\n/g, '<br/>'));
        }
    });

    //text conversion to plain and hashtag
    $(".convert-text").click(function () {

        var original_text = $("#original_text").val();

        if ($('#plain-text').is(':checked')) {
            if (original_text == "" || original_text == null) {
                $(".hashsign").hide();
                $("#hashtagtext").html("#typeyour<br>hashtag<br>here");
            } else {
                $(".hashsign").show();
                $("#hashtagtext").html("");
                $("#hashtagtext").html(original_text);
            }
        } else {
            if (original_text == "" || original_text == null) {
                $(".hashsign").hide();
                $("#hashtagtext").html("#typeyour<br>hashtag<br>here");
            } else {
                $(".hashsign").hide();
                $("#hashtagtext").html("");
                $("#hashtagtext").html("#" + original_text.replace(/\s+/g, ''));
            }
        }
    });

    //make the text dragable
    $('#hashtagtext').draggable({
        containment: "#containment",
        scroll: false,
        cursor: "move"
    }).resizable({
        containment: "#containment"
    });

    //Validation for the Product Creation form
    var validators = $('#product-creation-form').validate({
        rules: {
            fieldHashTag: {
                required: true
            },
            converttext: {
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
            $("#js-loader").fadeIn();
            $("body").append('<div class="custom-overlay">');
            var _hashtag = $("#hashtagfield").val();
            var _color = $("#bg-color-value").val();
            var _tagType = $("input:radio[name=converttext]:checked").data(
                'converttext');
            var _logo = "";
            var _design_image = ""; // $("").val();
            var _shop_info = getShopifyAccessInfo()

            var canDiv = $('#containment');
            createimagefromdiv(canDiv, function (err, res) {
                //return;
                _design_image = res.savingURL;
                var shopifyProductRaw = {
                    //shopify_access_token: _shop_info.accessToken,
                    //shop_name: _shop_info.shopName,
                    product_name: "mobile case",
                    product_detail: "<p>" + _hashtag + "<\/p>",
                    product_type: "mobile_case",
                    vandor: "hashtag",
                    color: _color,
                    tag_type: _tagType,
                    logo: _logo,
                    design_image: _design_image,
                    user_email: username

                };
                console.log(shopifyProductRaw);
                var shopifyProduct = JSON.stringify(shopifyProductRaw);
                $.ajax({
                    type: "POST",
                    url: "/api/uploadShopifyProduct",
                    data: shopifyProduct,
                    contentType: 'application/json',
                    success: function (res) {
                        console.log(res);
                        addparamentertoUrl(res.data.product.id);
                        $("#first-panel").hide();
                        $("#second-panel").fadeIn();
                        $("#js-loader").fadeOut();
                        $(".custom-overlay").remove();
                    },
                    error: function (err) {
                        console.log(err);

                        $("#js-loader").fadeOut();
                        $(".custom-overlay").remove();
                    }
                });
                // getToken();
            });
        }
    });




    /* $('#js-create-case').on("click", function () {

     });*/

    //attach the event file upload to the the 'fileuplaod'
    document.getElementById('fileupload').addEventListener('change',
        handleFileSelect, false);

    //make image dragable
    $('#hashtagimgdiv').draggable({
        containment: "#containment",
        scroll: false,
        cursor: "move"
    });
    /*.resizable({
            containment: "#containment"
        })*/
    //On click image add the image to the case
    $('body').on('click', '.img-cloneable', function () {
        var img_src = $(this).find('img').attr('src');
        console.log(img_src);
        $('#hashtagimg').attr('src', img_src);
        $('#hashtagimgdiv').show();
    });

    //file upload
    $('#pagefileupload').fileupload({
        dataType: 'json',
        enctype: "multipart/form-data",
        url: '/api/fileupload',
        done: function (e, data) {
            console.log(data);
            //            $(".uploaded-logos-container").html("");
            //            $(".uploaded-logos-container").append("<div class='img-cloneable'>\n\
            //                                                  <img id='img-uploaded' src='" + data.filepath + "' \n\
            //                                                   title='" + data.fileName + "' style='width:85px'/>\n\
            //                                                  </div>");
        }
    });

    //second panel
    $('#bg-page-color-picker').colorpicker({
        inline: false,
        format: 'hex',
        //container: "#bg-color-picker",
        //customClass: 'colorpicker-2x',
    }).on('changeColor', function (ev) {
        $('#bg-page-color-value').val(ev.color.toHex());
        $('.group-container-2').css('background-color', ev.color.toHex());
        //$("#page-case-style").css('background-color', ev.color.toHex());
        //$("#bg-page-color-display").css('background-color', ev.color.toHex());
    });
    ////////////////////////////////////////////////////////////////////////////////////////////
    /////////Landing page heading change
    $("#landing-page-heading").on('keyup', function () {
        if ($(this).val() == "") {
            $("#brower-text-heading-dispaly").html('[Campaign Heading]');
        } else {
            var textVal = $(this).val();
            $("#brower-text-heading-dispaly").html(textVal);
        }
    });
    $("#landing-page-details").on('keyup', function () {
        if ($(this).val() == "") {
            $("#brower-text-details-dispaly").html('[Landing page details]');
        } else {
            var textVal = $(this).val();
            $("#brower-text-details-dispaly").html(textVal);
        }
    });
    /////////Langing page details change
    /////////Landing page validation and submission to store in store
    var LangingValidator = $('#landing-page-form').validate({
        rules: {
            campaignName: {
                required: true
            },
            campaignDetails: {
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
            $("#js-loader").fadeIn();
            $("body").append('<div class="custom-overlay">');
            var _shop_info = getShopifyAccessInfo();


            var _landingPageProductId = GetURLParameter('pid'),
                _langingPageHeading = $("#landing-page-heading").val(),
                _landingPagedetails = $("#landing-page-details").val(),
                _landingPageLogoUrl = "",
                _langingPageBgColor = $("#bg-page-color-value").val();

            var landingPageInfoRaw = {
                //shopify_access_token: _shop_info.accessToken,
                //shop_name: _shop_info.shopName,
                landingPageProductId: _landingPageProductId,
                langingPageHeading: _langingPageHeading,
                landingPagedetails: _landingPagedetails,
                landingPageLogoUrl: _landingPageLogoUrl,
                langingPageBgColor: _langingPageBgColor
            };
            var landingPageInfo = JSON.stringify(landingPageInfoRaw);
            $.ajax({
                type: "POST",
                url: "/api/saveLandingPage",
                data: landingPageInfo,
                contentType: 'application/json',
                success: function (res) {
                    $("#js-loader").fadeOut();
                    $(".custom-overlay").remove();
                    console.log(res);
                    createComplexString(30, function (strErr, strRes) {
                        window.location.href = "/affiliate?pid=" +
                            _landingPageProductId;
                    });
                },
                error: function (err) {
                    $("#js-loader").fadeOut();
                    $(".custom-overlay").remove();
                    console.log(err)
                }
            });
        }
    });
    ///////////////////////////////////////////////////////////////////////////////////////////
    /*$("#create-landing-page").on("click", function () {


    });*/
    var $image = $('#hashtagimg');
    var $body = $('body');
    //Image Edit panel
    $body.on('click', '[data-method]', function () {

        if ($image == null) {
            alert("please select an image");
            return;
        }
        var data = $(this).data();
        if (data.method) {
            data = $.extend({}, data); // Clone a new one
            console.log(data);
        }
        switch (data.method) {
            case 'zoom':
                var $width = ($image.parents('#hashtagimgdiv').width());
                var $addition = data.option;
                var totalWidth = $width + ($addition);
                console.log($width + ' + ' + $addition + ' = ' + totalWidth);
                $image.parents('#hashtagimgdiv').width(totalWidth);
                //$image.parents('.img-container').css('width', totalWidth + 'px;');
                break;
            case 'rotate':
                var $angle = getRotationDegrees($image);
                console.log($angle);
                var rotation = $angle + data.option;
                $image.css('transform', 'rotate(' + rotation + 'deg)');
                break;
            case 'delete':
                $('#hashtagimgdiv').hide();
                $('#logo-edit-panel').fadeOut();
                var $imgParent = $('#hashtagimgdiv');
                $imgParent.css('width', '50px');
                $imgParent.css('height', '50px');
                $image.attr('src', '');
                $image.css('transform', '');
                break;
        };
    });
});

function getRotationDegrees(obj) {
    var matrix = obj.css("-webkit-transform") ||
        obj.css("-moz-transform") ||
        obj.css("-ms-transform") ||
        obj.css("-o-transform") ||
        obj.css("transform");
    if (matrix !== 'none') {
        var values = matrix.split('(')[1].split(')')[0].split(',');
        var a = values[0];
        var b = values[1];
        var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    } else {
        var angle = 0;
    }
    return (angle < 0) ? angle += 360 : angle;
}


function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = (function (theFile) {

            return function (e) {
                // Render thumbnail.
                /*$(".uploaded-logos-container").append("<div class='img-cloneable'>\n\
                                                  <img id='img-" + i + "' src='" + e.target.result + "' \n\
                                                   title='" + escape(theFile.name) + "' style='width:85px'/>\n\
                                                  </div>");*/
                $('#hashtagimg').attr('src', e.target.result);
                $('#hashtagimgdiv').fadeIn();
                $('#logo-edit-panel').fadeIn();
                localStorage.setItem('logos', e.target.result);
            };
        })(f);

        // Read in the image file as a data URL.
        reader.readAsDataURL(f);
    }
}

function getToken() {
    window.location.href = "/api/getShopifyAccessToken";
};

function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

function addparamentertoUrl(productId) {
    // e.preventDefault();
    //var curList = $(this).attr("href").substring(1);

    createComplexString(30, function (err, res) {
        if (window.history && history.pushState) {
            // NOTE: doesn't take into account existing params
            history.replaceState("", "", "?pid=" + productId);
        }
    });
}

function createimagefromdiv(div, cbf) {
    var canvasVal = {
        savingURL: "",
        displayingURL: ""
    };

    html2canvas(div, {
        onrendered: function (canvas) {
            // canvas is the final rendered <canvas> element
            canvasVal.savingURL = canvas.toDataURL("image/png");
            canvasVal.displayingURL = canvasVal.savingURL;
            //window.open(canvasVal);
            //console.log(canvasVal);
            $("#landing-case-body").attr("src", canvasVal.displayingURL);
            canvasVal.savingURL = canvasVal.savingURL.replace(
                /^data:image\/(png|jpg);base64,/, "");
            cbf(null, canvasVal);
        }
    });
}

function createComplexString(strLength, cb) {
    var text = "";
    var possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < strLength; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    cb(null, text);
}
