var db = require('../config/connection')
var collection = require('../config/collection')
const bcrypt = require('bcrypt')
const ObjectId = require('mongodb').ObjectId


module.exports = {
    adminLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {

            console.log(adminData);
            let loginStatus = false;
            let response = {};
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ username: adminData.username })
            if (admin) {
                bcrypt.compare(adminData.password, admin.password).then((status) => {
                    if (status) {
                        console.log('login successful');
                        response.status = true;
                        resolve(response)
                    } else {
                        console.log('login failed');
                        resolve({ status: false })
                    }

                })
            } else {
                console.log('login failed');
                resolve({ status: false });

            }
        })
    },

    addCategory: (category) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).insertOne(category).then((data) => {
                resolve(data._id)
            })
            console.log(category)
        })
    },

    getAllCategory: () => {
        return new Promise(async (resolve, reject) => {
            let category = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            resolve(category)
        })
    },

    getCategory: (catId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).findOne({ _id: ObjectId(catId) }).then((response) => {
                resolve(response)
            })
        })
    },

    updateCategory: (catId, category) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION)
                .updateOne({ _id: ObjectId(catId) }, {
                    $set: {
                        category_name: category.category_name,
                        cat_descrypt: category.cat_descrypt,
                        image: category.image
                    }
                }).then((response) => {
                    resolve(response)
                })
        })
    },

    fetchCategoryImage: (catId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).findOne({ _id: ObjectId(catId) }).then((response) => {
                resolve(response.image)
            })
        })
    },

    addIngredient: (ingredient) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.INGREDIENT_COLLECTION).insertOne(ingredient).then((data) => {
                resolve(data._id)
            })
            console.log(ingredient)
        })
    },

    getAllIngredient: () => {
        return new Promise(async (resolve, reject) => {
            let ingredient = await db.get().collection(collection.INGREDIENT_COLLECTION).find().toArray()
            resolve(ingredient)
        })
    },

    getIngredient: (ingreId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.INGREDIENT_COLLECTION).findOne({ _id: ObjectId(ingreId) }).then((response) => {
                console.log(response);
                resolve(response)
            })
        })
    },

    updateIngredient: (ingId, ingredient) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.INGREDIENT_COLLECTION)
                .updateOne({ _id: ObjectId(ingId) }, {
                    $set: {
                        ingredient_name: ingredient.ingredient_name,
                        ingre_descrypt: ingredient.ingre_descrypt,
                        image: ingredient.image
                    }
                }).then((response) => {
                    resolve(response)
                })
        })
    },

    fetchIngredientImage: (ingreId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.INGREDIENT_COLLECTION).findOne({ _id: ObjectId(ingreId) }).then((response) => {
                resolve(response.image)
            })
        })
    },

    addProduct: (product) => {
        let quantity = parseInt(product.quantity)
        product.quantity = quantity
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data) => {
                console.log(data)
                resolve()
            })

        })
    },

    getAllProduct: () => {
        return new Promise(async (resolve, reject) => {
            let product = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(product)
        })
    },

    getProduct: (productId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: ObjectId(productId) }).then((response) => {
                resolve(response)
            })
        })
    },


    deleteProduct: (productId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION)
                .updateOne({ _id: ObjectId(productId) }, { $set: { status: false } }).then((response) => {
                    resolve()
                })
        })
    },


    updateProduct: (proId, proDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION)
                .updateOne({ _id: ObjectId(proId) }, {
                    $set: {
                        product_name: proDetails.product_name,
                        product_description: proDetails.product_description,
                        reg_price: proDetails.reg_price,
                        promo_price: proDetails.promo_price,
                        quantity: parseInt(proDetails.quantity),
                        volume: proDetails.volume,
                        category_id: proDetails.category_id,
                        ingredient: proDetails.ingredient,
                        images: proDetails.images
                    }
                }).then((response) => {
                    resolve(response)
                })
        })
    },

    getProductImage: (proId, imgno) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: ObjectId(proId) }).then((response) => {
                console.log(response.images[imgno])
                resolve(response.images[imgno])

            })
        })
    },


    getAllUsers: () => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).find().toArray().then((user) => {
                resolve(user)
            })
        })
    },

    blockUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION)
                .updateOne({ _id: ObjectId(userId) }, { $set: { status: false } }).then((response) => {
                    resolve()
                })
        })
    },

    unblockUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION)
                .updateOne({ _id: ObjectId(userId) }, { $set: { status: true } }).then((response) => {
                    resolve()
                })
        })
    },

    addCoupon: (coupon) => {
        return new Promise(async (resolve, reject) => {
            coupon.status = true
            coupon.code = coupon.code.toUpperCase()
            coupon.discount = parseInt(coupon.discount)
            coupon.min_purchase = parseInt(coupon.min_purchase)
            coupon.max_purchase = parseInt(coupon.max_purchase)
            db.get().collection(collection.COUPON_COLLECTION).insertOne(coupon).then((data) => {
                resolve(data._id)
            })
        })
    },


    getAllCoupon: () => {
        return new Promise(async (resolve, reject) => {
            let coupons = await db.get().collection(collection.COUPON_COLLECTION).find().toArray()
            resolve(coupons)
        })
    },


    getCoupon:(couponId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.COUPON_COLLECTION).findOne({ _id: ObjectId(couponId) }).then((response) => {
                resolve(response)
            })
        })
    },


    updateCoupon: (couponId, coupon) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.COUPON_COLLECTION)
                .updateOne({ _id: ObjectId(couponId) }, {
                    $set: {
                        code: coupon.code,
                        discount:coupon.discount,
                        expiry_date: coupon.expiry_date,
                        min_purchase: coupon.min_purchase,
                    }
                }).then((response) => {
                    resolve(response)
                })
        })
    },

    deleteCoupon: (couponId) => {
        return new Promise(async (resolve, reject) => {
            console.log('hjgjhgjhgjg');

            db.get().collection(collection.COUPON_COLLECTION)
                .updateOne({ _id: ObjectId(couponId) }, { $set: { status: false } }).then((response) => {
                    resolve()
                })
        })
    },


}