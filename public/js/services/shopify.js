'use strict'

var sessionAccess = localStorage;
var cachedShopifyAccess;

function setShopifyAccessInfo(shopifyAccessInfo) {
    cachedShopifyAccess = shopifyAccessInfo;
    sessionAccess.setItem('shopify_access', JSON.stringify(shopifyAccessInfo));
};

function getShopifyAccessInfo() {
    if (!cachedShopifyAccess)
        cachedShopifyAccess = sessionAccess.getItem('shopify_access');
    return cachedShopifyAccess;
};
