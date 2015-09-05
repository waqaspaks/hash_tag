'use strict'

var sessionUser = window.localStorage;
var cachedUser;

function setUserInfo(userinfo) {
    cachedUser = userinfo;
    sessionUser.setItem('users', JSON.stringify(userinfo));
};

function getUserInfo() {
    if (!cachedUser)
        cachedUser = sessionUser.getItem('users');
    return cachedUser;
};
