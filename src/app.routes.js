const express = require('express');
const router = express.Router();

router.use('/auth', require('./modules/auth/auth.routes'));
router.use('/users', require('./modules/users/user.routes'));
router.use('/products', require('./modules/products/product.routes'));
router.use('/categories', require('./modules/categories/category.routes'));
router.use('/orders', require('./modules/orders/order.routes'));
router.use('/reviews', require('./modules/reviews/review.routes'));

module.exports = router;
