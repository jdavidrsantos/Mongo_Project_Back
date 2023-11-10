const products = require("../landingpage/products/products");
function routerApi(app) {
    app.use('/api/', products);
}
module.exports = routerApi;
