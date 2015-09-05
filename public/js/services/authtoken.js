'use strict'

var storage = localStorage;
var cachedToken;

function setToken(token) {
    cachedToken = token;
    storage.setItem('userToken', token);
};

function getToken() {
    if (!cachedToken)
        cachedToken = storage.getItem('userToken');

    return cachedToken;
};

function isAuthenticated() {
    return !!this.getToken(); //takes the result cast it into a bool and then inverse it :)
};
