const User = require('../models/userModel');
const Sib = require('sib-api-v3-sdk');




exports.getUser = async (req, res) => {

    const email = req.body.email;

    const user = await User.findOne({ where: { email: email } });

    if (user) {
        return res.status(200).json({ user, status: true });
    } else {
        return res.status(404).json({ message: "Email id is not registered !", status: false });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const email = req.body.email;

        const client = Sib.ApiClient.instance;

        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;

        const tranEmailApi = new Sib.TransactionalEmailsApi();

        const sender = {
            email: 'shashwatv18@gmail.com',
            name: 'Expense Tracker'
        }

        const receivers = [
            {
                email: `${email}`
            },
        ]

        const response = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: ' Forget Password Link',
            textContent: `Hi, the forget password link is !`
        });

        console.log(response);

    } catch (err) {
        console.log(err);
    }
}

