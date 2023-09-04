const contactUs = require("../landingpage/contactUs/contactUs");
const login = require("../landingpage/login/login");


function routerApi(app) {
    app.use('/api/landingpage', contactUs);
    app.use('/api/landingpage', login);
}

module.exports = routerApi;
