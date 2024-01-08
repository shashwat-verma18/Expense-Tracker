const Order = require('../models/orderModel');
const Razorpay = require('razorpay');

exports.purchasePremium = async (req, res) => {

    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const amount = 2500;

        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err)
                throw new Error(JSON.stringify(err));

            req.user.createOrder({ orderid: order.id, status: "PENDING" }).then(() => {
                return res.status(201).json({ order, key_id: rzp.key_id });
            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: "Something went wrong", error: err })
    }
}

exports.updatePrmium = async (req, res) => {

    try {
        const { payment_id, order_id, check } = req.body;


        const order = await Order.findOne({ where: { orderid: order_id } });

        if (check) {

            const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESSFUL' });
            const promise2 = req.user.update({ isPremium: true });

            Promise.all([promise1, promise2]).then(() => {
                return res.status(202).json({ success: true, message: 'Transaction Successful' });
            })
                .catch((err) => {
                    throw new Error(err);
                });
        }
        else {
            order.update({ paymentid: payment_id, status: 'FAILED' }).then(() => {
                return res.status(202).json({ success: false, message: 'Transaction Failed' });
            }).catch((err) => {
                throw new Error(err);
            })
        }
    } catch (err) {
        throw new Error(err);
    }
}