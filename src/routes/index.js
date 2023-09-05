const contactUs = require("../landingpage/contactUs/contactUs");
const login = require("../landingpage/login/login");
const user = require("../landingpage/user/user");



function routerApi(app) {
    app.use('/api/landingpage', contactUs);
    app.use('/api/landingpage', login);
    app.use('/api/landingpage', user);
}

module.exports = routerApi;
