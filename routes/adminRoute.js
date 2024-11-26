const express = require("express");
const router = express.Router();
const adminController = require('../controller/Admin/adminController');
const userController = require('../controller/Admin/userController')
const categoryController = require('../controller/Admin/categoryController');
const productController = require('../controller/Admin/productController')
const orderController = require('../controller/Admin/orderController');
const offerController = require('../controller/Admin/offerController')
const couponController = require('../controller/Admin/couponController')
const salesController = require('../controller/Admin/salesController')
const bannerController = require('../controller/Admin/bannerController')

//MIddleware for admin authorization...
const verifyAdmin = require('../middleware/adminAuth')

//Admin login and Signup route..
router.post('/signup', adminController.registerAdmin);
router.post('/login', adminController.AdminLogin);
router.post('/logout', adminController.AdminLogout);

//Category related routes..
router.post('/add_category', verifyAdmin, categoryController.addCategory);
router.put('/edit-category/:id', verifyAdmin, categoryController.updateCategory);
router.get('/categories', verifyAdmin, categoryController.getCategories);
router.get('/categories/edit/:categoryId', verifyAdmin, categoryController.fetchCategoryById);
router.patch('/categories/:id', verifyAdmin, categoryController.updateCategoryStatus);

//Product related routes..                                                  
router.post('/add_product', verifyAdmin, productController.addProduct);
router.get('/get_product', verifyAdmin, productController.getProduct);
router.patch('/get_product/:id', verifyAdmin, productController.updateProductStatus);
router.put('/update_product/:id', verifyAdmin, productController.updateProduct);
router.get('/product/edit/:id', verifyAdmin, productController.fetchProductById);

//USER related details for display the uses and block and unblock the user..
router.get('/coustmers', verifyAdmin, userController.getCoutomers);
router.patch('/coustmers/:id', verifyAdmin, userController.updateCoustomerStatus);
router.get('/data', userController.getOrderStatistics);

//ORDER related routes..
router.get('/orders', verifyAdmin, orderController.getAllOrders);
router.patch('/orders/:orderId/status', verifyAdmin, orderController.updateOrderStatus);
router.get('/order/:orderId', verifyAdmin, orderController.getOrderById);
router.post('/orders/:orderId/return-response', orderController.responseToReturnRequest);

//OFFER related API end points...
router.get('/offers', verifyAdmin, offerController.getOffers);
router.post('/addoffer', verifyAdmin, offerController.addOffer);
router.delete('/offer', verifyAdmin, offerController.deleteOffer);
router.get('/products', verifyAdmin, productController.get_product_offer);
router.get('/getCategories', verifyAdmin, offerController.getCategoriesForOffer);

//COUPEN related routes
router.post('/coupon', verifyAdmin, couponController.addCoupon);
router.delete('/deleteCoupon/:id', verifyAdmin, couponController.deleteCoupon);
router.get('/getCoupon', verifyAdmin, couponController.getAllCoupons);
router.get('/coupen/:id', verifyAdmin, couponController.getCouponById);
router.put('/coupen/:id', verifyAdmin, couponController.editCoupon);

//SALES based routes
router.get('/report', verifyAdmin, salesController.getSalesReport)
router.get('/download/report/pdf', verifyAdmin, salesController.download_sales_report_pdf)
router.get('/download/report/xl', verifyAdmin, salesController.download_sales_report_xl)
router.get('/topselling', salesController.getTopSelling)

//BANNER Related routes
router.post('/banner', verifyAdmin, bannerController.addBanner);
router.get('/banner', verifyAdmin, bannerController.getAllBanners);
router.delete('/banner/:id', verifyAdmin, bannerController.deleteBanner);






module.exports = router;