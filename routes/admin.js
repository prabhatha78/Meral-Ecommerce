var express = require('express');
var router = express.Router();
const adminController = require('../controllers/admin-controller')
const { uploadCategory, uploadProduct, uploadIngredient } = require('../middleware/image-upload')
const deleteImage = require('../controllers/delete-controller')


/* GET admin page. */
router.get('/', function (req, res, next) {
    if (req.session.adminloggedIn) {
        res.redirect('/admin/dashboard', { admin: true })
    } else {
        res.render('admin/admin-login', { erro: req.session.adminloginErr, admin: true })
        req.session.adminloginErr = false
    }
})



router.post('/login', function (req, res) {
    console.log("jhgjggjhgjh");
    adminController.adminLogin(req.body).then((response) => {
        if (response.status) {
            req.session.adminloggedIn = true
            req.session.admin = response.admin
            res.redirect('/admin/dashboard')
        } else {
            req.session.adminloginErr = true;
            res.redirect('/admin')

        }
    })
})

router.get('/dashboard', function (req, res) {
    if (req.session.adminloggedIn) {
        res.render('admin/dashboard', { admin: true })
    }
    else {
        res.redirect('/admin')
    }
})

router.get('/order-list', async (req, res) => {
    if (req.session.adminloggedIn) {
        console.log('lll');
        let order = await adminController.getOrder()
        console.log(order);
        res.render('admin/order-list', { admin: true,order});
    } else {
        res.redirect('/admin')
    }
})

router.get('/transaction', (req, res) => {
    if (req.session.adminloggedIn) {
        res.render('admin/transaction', { admin: true });
    } else {
        res.redirect('/admin')
    }
})



router.get('/category-list', function (req, res) {
    if (req.session.adminloggedIn) {
        adminController.getAllCategory().then((category) => {
            console.log(category)
            res.render('admin/category-list', { category, admin: true })
        })
    } else {
        res.redirect('/admin')
    }

})

router.post('/add-category', uploadCategory, function (req, res) {
    if (req.session.adminloggedIn) {
        req.body.image = req.files.image;
        adminController.addCategory(req.body).then((response) => {
            console.log(response);
            res.redirect('/admin/category-list');
        })
    } else {
        res.redirect('/admin')
    }
})

router.get('/edit-category/:id', async (req, res) => {
    if (req.session.adminloggedIn) {
        let category = await adminController.getAllCategory()
        adminController.getCategory(req.params.id).then((cat) => {
            res.render('admin/edit-category', { cat, category, admin: true })
        })
    } else {
        res.redirect('/admin')
    }
})


router.post('/edit-category/:id', uploadCategory, async (req, res) => {
    if (req.session.adminloggedIn) {
        if (req.files.image == null) {
            req.body.image = await adminController.fetchCategoryImage(req.params.id)
        } else {
            existImage = await adminController.fetchCategoryImage(req.params.id)
            req.body.image = req.files.image;
            console.log(existImage[0].path);
            deleteImage.deleteFile(existImage[0].path)
        }
        adminController.updateCategory(req.params.id, req.body).then(() => {
            res.redirect('/admin/category-list')
        })
    } else {
        res.redirect('/admin')
    }
})


router.get('/ingredient-list', function (req, res) {
    if (req.session.adminloggedIn) {
        adminController.getAllIngredient().then((ingredient) => {
            res.render('admin/ingredient-list', { ingredient, admin: true })
        })
    } else {
        res.redirect('/admin')
    }
})

router.post('/add-ingredient', uploadIngredient, function (req, res) {
    if (req.session.adminloggedIn) {
        req.body.image = req.files.image;
        adminController.addIngredient(req.body).then((response) => {
            console.log(response)
            res.redirect('/admin/ingredient-list')
        })
    } else {
        res.redirect('/admin')
    }
})

router.get('/edit-ingredient/:id', async function (req, res) {
    if (req.session.adminloggedIn) {
        let ingredient = await adminController.getAllIngredient()
        adminController.getIngredient(req.params.id).then((ingre) => {
            res.render('admin/edit-ingredient', { ingre, ingredient, admin: true })
        })
    } else {
        res.redirect('/admin')
    }
})

router.post('/edit-ingredient/:id', uploadIngredient, async (req, res) => {
    if (req.files.image == null) {
        req.body.image = await adminController.fetchIngredientImage(req.params.id)
    } else {
        existImage = await adminController.fetchIngredientImage(req.params.id)
        req.body.image = req.files.image;
        deleteImage.deleteFile(existImage[0].path)
    }

    adminController.updateIngredient(req.params.id, req.body).then(() => {
        res.redirect('/admin/ingredient-list')
    })
})

router.get('/product-list', (req, res) => {
    adminController.getAllProduct().then((product) => {
        console.log(product)
        res.render('admin/product-list', { product, admin: true })
    })
})


router.get('/add-product', async (req, res) => {
    if (req.session.adminloggedIn) {
        let category = await adminController.getAllCategory()
        let ingredient = await adminController.getAllIngredient()
        res.render('admin/add-product', { category, ingredient, admin: true })
    } else {
        res.redirect('/admin')
    }
})

router.post('/add-product', uploadProduct, function (req, res) {
    req.body.status = true
    req.body.images = [req.files.image1[0], req.files.image2[0], req.files.image3[0]]
    adminController.addProduct(req.body).then((response) => {
        console.log(response);
        res.redirect('/admin/product-list');
    })
})

router.get('/delete-product/:id', function (req, res) {
    let productId = req.params.id
    adminController.deleteProduct(productId).then((response) => {
        res.redirect('/admin/product-list')
    })
})

router.get('/edit-product/:id', async (req, res) => {
    console.log(req.params.id)
    let product = await adminController.getProduct(req.params.id)
    let category = await adminController.getAllCategory()
    let ingredient = await adminController.getAllIngredient()
    res.render('admin/edit-product', { product, category, ingredient, admin: true })
})


router.post('/edit-product/:id', uploadProduct, async function (req, res) {
    console.log(req.files);
    if (req.files.image1 == null) {
        image1 = await adminController.getProductImage(req.params.id, 0)
    } else {
        exist = await adminController.getProductImage(req.params.id, 0)
        image1 = req.files.image1
    }

    if (req.files.image2 == null) {
        image2 = await adminController.getProductImage(req.params.id, 1)
    } else {
        exist = await adminController.getProductImage(req.params.id, 1)
        image2 = req.files.image2
    }

    if (req.files.image3 == null) {
        image3 = await adminController.getProductImage(req.params.id, 2)
    } else {
        exist = await adminController.getProductImage(req.params.id, 2)
        image3 = req.files.image3
    }

    req.body.images = [image1, image2, image3]

    adminController.updateProduct(req.params.id, req.body).then(() => {
        res.redirect('/admin/product-list')
    })
})


router.get('/user-list', async function (req, res) {
    let user = await adminController.getAllUsers()
    res.render('admin/user-list', { user, admin: true })
})

router.get('/delete-user/:id', function (req, res) {
    let userId = req.params.id
    adminController.blockUser(userId).then((response) => {
        res.redirect('/admin/user-list')
    })
})

router.get('/unblock-user/:id', function (req, res) {
    let userId = req.params.id
    adminController.unblockUser(userId).then((response) => {
        res.redirect('/admin/user-list')
    })
})

router.get('/coupon-list', async function (req, res) {
    let coupons = await adminController.getAllCoupon()
    res.render('admin/coupons', { coupons, admin: true })
})


router.post('/add-coupon', function (req, res) {
    if (req.session.adminloggedIn) {
        adminController.addCoupon(req.body).then((response) => {
            console.log(response)
            res.redirect('/admin/coupon-list')
        })
    } else {
        res.redirect('/admin')
    }
})

router.get('/edit-coupon/:id', async function (req, res) {
    if (req.session.adminloggedIn) {
        let allCoupons = await adminController.getAllCoupon()
        adminController.getCoupon(req.params.id).then((coupon) => {
            coupon.expiry_date = coupon.expiry_date.toString()
            res.render('admin/edit-coupon', { coupon, allCoupons, admin: true })
        })
    } else {
        res.redirect('/admin')
    }
})

router.post('/edit-coupon/:id', async (req, res) => {
    adminController.updateCoupon(req.params.id, req.body).then(() => {
        res.redirect('/admin/coupon-list')
    })
})

router.get('/delete-coupon/:id', function (req, res) {
    console.log('xxxxxxx');

    let couponId = req.params.id
    adminController.deleteCoupon(couponId).then((response) => {
        res.redirect('/admin/coupon-list')
    })
})



module.exports = router;