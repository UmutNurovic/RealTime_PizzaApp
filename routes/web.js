const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const cartController = require('../app/http/controllers/customers/cartController');
const orderContorller = require('../app/http/controllers/customers/orderController');
const AdminOrderContorller = require('../app/http/controllers/admin/orderControllers');
const guest = require('../app/http/middleware/guest');
const auth = require('../app/http/middleware/auth');
const admin = require('../app/http/middleware/admin');

function initRouts(app) {
   
    app.get("/",   homeController().index );

    
    app.get("/login",guest,authController().login);
    app.post("/login",authController().postLogin);
    app.get("/register",guest, authController().register);
    app.post("/register", authController().postregister);
    app.get("/cart", cartController().index );
    app.post("/update-cart",cartController().update);

    app.post("/logout",authController().logout);


    

    //Customer routes
    app.post('/orders',auth,orderContorller().store)
    app.get('/customers/orders',auth,orderContorller().index)

    // Admin routes
    app.get('/admin/orders',admin,AdminOrderContorller().index)
}

module.exports = {
    initRouts,

}