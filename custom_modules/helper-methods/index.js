module.exports = {
    generateInvitationKey: function(strLength, cb){
        var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < strLength; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            cb(null, text);
    },
    anotherHelperFunction: function(){}/*If soem new helper function to be created create here*/
}
