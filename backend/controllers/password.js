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

        console.log(req.body);

        const email = req.body.email;
        const name = req.body.name;

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
            subject: 'Reset Password',
            htmlContent: `
            <p>Hi ${name}, </p>
            <p>A password reset for your account was requested. </p>
            <p>Please click the button below to change your password.
            Note that this link is valid for limited time. After the time limit has expired, you will have to resubmit the request for a password reset.</p>
            <a href="https://www.google.com"><button style="background-color: #4caf50; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer;">Change your Password</button></a> 
            `
        });

        console.log(response);


        res.json({})

    } catch (err) {
        console.log(err);
    }
}

