$(document).ready(function () {
    $("#logout-user").on("click", function () {
        window.location.href = "/logout";
    });
    //code to delete the product from shopify
    $('body').on('click', '.btn-delete-prod', function(){
        $("#js-loader").fadeIn();
        $("body").append('<div class="custom-overlay">');
        var productCol = $(this);
        var _productId = $(this).data('productid');
        console.log(_productId);
        var prodRaw ={
            productId: _productId
        };
        prodPost = JSON.stringify(prodRaw);
        $.ajax({
            type: "POST",
            url: "/api/deleteShopifyProduct",
            data: prodPost,
            contentType: 'application/json',
            success: function (res) {
                console.log($(this).parents('.main-product-row'));
                productCol.parents('.main-product-row').find('.deleted-prod').html('<i class="glyphicon glyphicon-flag"></i>');
                productCol.parents('.main-product-row').find('.prod-Link').html('');
                productCol.parents('.main-product-row').find('.prod-delete').html('');

                $("#js-loader").fadeOut();
                $(".custom-overlay").remove();
            },
            error: function (err) {
                $("#js-loader").fadeOut();
                $(".custom-overlay").remove();
                console.log(err)
            }
        });
    });
    //Code for getting the products the product
    getAllProductsSales(function () {});
});

function getAllProductsSales(callback) {
    $("#js-loader").fadeIn();
    $.ajax({
        type: "POST",
        url: "/api/getShopifyOrders",
        data: {},
        contentType: 'application/json',
        success: function (res) {
            console.log(res.orders.orders);
            var totlaSale = 0;
            var todaysSale = 0;
            for (var i = 0; i < res.orders.orders.length; i++) {
                totlaSale = totlaSale + parseFloat(res.orders.orders[i].total_price_usd);

                var prodDate = new Date(res.orders.orders[i].created_at).toDateString();
                var todaysDate = new Date().toDateString();
                //pCA + ":::" + prodDate + "  ==  " + todaysDate
                console.log(prodDate + " ::: " + todaysDate);
                if (prodDate == todaysDate) {
                    todaysSale = todaysSale + parseFloat(res.orders.orders[i].total_price_usd);
                }
            }
            var commission = ((totlaSale / 100) * 20);
            $("#totalShopSale").html("$" + totlaSale.toFixed(2));
            $("#totalTodaysSale").html("$" + todaysSale.toFixed(2));

            var lineItems = [];
            //////////////////////////////////////////////////////////
            for (var j = 0; j < res.orders.orders.length; j++) {
                $.each(res.orders.orders[j].line_items, function (i, v) {
                    lineItems.push(v);
                });
            }

            //add the values in respected elements
            var prodSales = document.getElementsByClassName('product-sales'); //$('.product-sales');
            console.log("total elements = " + prodSales.length);
            for (var i = 0; i < prodSales.length; ++i) {
                var prodSaleRes = 0;
                var totalCommission = 0;
                var item = prodSales[i];
                var elementProductId = item.getAttribute('data-productId');
                console.log("element_Id: " + elementProductId);

                $.each(lineItems, function (i, v) {
                    if (elementProductId == v.product_id) {
                        prodSaleRes = prodSaleRes + (parseFloat(v.price) * parseInt(v.quantity));
                    }

                    console.log("product_id: " + v.product_id);
                });
                item.innerHTML = "$" + prodSaleRes.toFixed(2);
                totalCommission = ((prodSaleRes / 100) * 20);
                var CommElement = item.parentElement.children[4];
                CommElement.innerHTML = "$" + totalCommission.toFixed(2);
            }
            //console.log(lineItems);
            $("#js-loader").fadeOut();
        },
        error: function (err) {
            $("#js-loader").fadeOut();
            console.log(err)
        }
    });
};
