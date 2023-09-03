const contactUs = require("../landingpage/contactUs/contactUs");


function routerApi(app) {
    app.use('/api/landingpage', contactUs);
}

module.exports = routerApi;
