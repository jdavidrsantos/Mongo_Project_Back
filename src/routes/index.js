const contactUs = require("../landingpage/contactUs/contactUs");
const login = require("../landingpage/login/login");
const user = require("../landingpage/user/user");
const recoverPassword = require("../landingpage/recover/recover");



function routerApi(app) {
    app.use('/api/landingpage', contactUs);
    app.use('/api/landingpage', login);
    app.use('/api/landingpage', user);
    app.use('/api/landingpage', recoverPassword);
}

module.exports = routerApi;
