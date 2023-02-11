const fs = require('fs')

function getInvoice(order, invoiceDetails) {
    return new Promise(async (resolve, reject) => {
        const data = {
            images: {
                logo: fs.readFileSync('public/images/log.png', 'base64')
            },
            // Your own data
            sender: {
                company: "Meral Ecom",
                address: "Meral Ecom Calicut",
                zip: "673016",
                city: "Kozhikode",
                country: "India"
            },
            // Your recipient
            client: {
                company: order.deliveryDetails.address.fname + " " + order.deliveryDetails.address.lname,
                address: order.deliveryDetails.address.line1 + "," +
                    order.deliveryDetails.address.line2 + "," +
                    order.deliveryDetails.address.landmark + "," +
                    order.deliveryDetails.address.citystate + "-" +
                    order.deliveryDetails.address.zip + ",",
                country: "INDIA"
            },
            information: {
                // Invoice number
                number: invoiceDetails._id,
                // Invoice data
                date: order.orderDate,
                duedate: order.expectedDeliveryDate
            },
            products: invoiceDetails.products,

            // Settings to customize your invoice
            settings: {
                currency: "INR",
            },
        };

        resolve(data);
        console.log(data);
    })
}


module.exports = getInvoice