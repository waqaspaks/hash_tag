$(document).ready(function () {
    $("#case-loader").fadeIn();
    $(".case-container").fadeOut();
    if (GetURLParameter('pid') != null) {
        var productId = GetURLParameter('pid');
        console.log(productId);
        if (typeof productId !== 'undefined') {
            var dataReqRaw = {
                productId: productId
            };
            var dataReq = JSON.stringify(dataReqRaw);

            $.ajax({
                type: "POST",
                url: "/api/getProductbyProductId",
                data: dataReq,
                contentType: 'application/json',
                success: function (res) {
                    console.log(res);
                    $("#case-body").attr('src', res.product.image.src);
                    $('#case-heading').html(res.product.title);
                    $('#case-description').html(res.product.body_html);

                    $("#goto-product-page").data('productid', res.product.id);
                    $("#goto-product-page").data('shop_name', res.shop_name);
                    $("#goto-product-page").data('collection', res.collection.handle);
                    $("#goto-product-page").data('product', res.product.handle);
                    $(".home-container-1").css("background-color", res.prodcolor);
                    $("#case-loader").fadeOut();
                    $(".case-container").fadeIn();
                },
                error: function (err) {
                    console.log(err)
                }
            });
        } else {

        }
    }
    getProducts();

    $('body').on('click', '.js-goto-product', function (e) {
        var prodId = $(this).data('product');
        var shopname = $(this).data('shop_name');
        var collectionname = $(this).data('collection');
        console.log(prodId + "         " + shopname + "        " +
            collectionname);
        window.location.href = 'http://' + shopname + '/collections/' +
            collectionname + '/products/' + prodId;
        //http: //lp-test-store.myshopify.com/collections/frontpage/products/product-0001
    });

    $(document).on("click", ".share-facebook", function () {
        var shareURL = $(this).data('href');
        console.log($(this).data('href'));
        FB.ui({
            method: 'share',
            href: shareURL
        }, function (response) {});
    });


});

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
            history.replaceState("", "", "?valsum=" + res + "&pid=" + productId);
        }
    });
}

function getProducts() {
    $("#random-case-loader").fadeIn();
    $("#js-random-products").fadeOut();
    $.ajax({
        type: "POST",
        url: "/api/getShopifyProduct",
        contentType: 'application/json',
        success: function (res) {
            // console.log(res.products);
            var prodLength = (res.products.length > 6 ? 6 : res.products.length);
            console.log(res);
            $("#js-random-products").html('');
            for (i = 0; i < prodLength; i++) {
                var item = res.products.splice(Math.floor(Math.random() * res.products
                    .length), 1)[0];

                $("#js-random-products").append(
                    '\n\
<div class="col-sm-4" data-productid="' + item.id +
                    '">\n\
                    <div class="product">\n\
                        <div class="product-thumbnail">\n\
                            <img src="' +
                    item.image.src +
                    '" width="150" height="303" alt="Case" class="img-responsive" />\n\
                        </div>\n\
                        <div class="product-share">\n\
                            <button type="button" class="add-cart js-goto-product" data-productid="' +
                    item.id + '" data-product="' + item.handle +
                    '" data-collection="' + res.collection.handle +
                    '" data-shop_name="' + res.shop_name +
                    '">#addtocart</button>\n\
            <div class="btn-group" role="group" aria-label="Share Product">\n\
<a href="javascript:void(0)" class="btn btn-default share-facebook" data-href="http://' + res.shop_name + '/collections/' + res.collection.handle + '/products/' + item.handle + '"><img src="/images/fb-cart.png" width="13" height="26" alt="Share on Facebook" class="img-responsive" /></a>\n\
<a href="https://twitter.com/share" class="btn btn-default twitter-share-button" data-url="http://' + res.shop_name + '/collections/' + res.collection.handle + '/products/' + item.handle + '"><img src="/images/twitter-cart.png" width="32" height="26" alt="Share on Twitter" class="img-responsive" data-count="none"/></a>\n\
</div>\n\
<span class="friend-share">share with friends</span>\n\
                        </div>\n\
                    </div>\n\
                </div>'
                );
                twttr.widgets.load();
            }
            $("#random-case-loader").fadeOut();
            $("#js-random-products").fadeIn();
        },
        error: function (err) {
            console.log(err)
        }
    });
}
//'http://' + shopname + '/collections/' + collectionname + '/products/' + prodId
/*<div class="btn-group" role="group" aria-label="Share Product">
                                <a href="#!" class="btn btn-default"><img src="assets/images/fb-cart.png" width="13" height="26" alt="Share on Facebook" class="img-responsive" /></a>
                                <a href="#!" class="btn btn-default"><img src="assets/images/twitter-cart.png" width="32" height="26" alt="Share on Twitter" class="img-responsive" /></a>
                                <a href="#!" class="btn btn-default"><img src="assets/images/instagram-cart.png" width="26" height="26" alt="Share on Instagram" class="img-responsive" /></a>
                            </div>
                            <a href="#!" class="friend-share">share with friends</a>*/
