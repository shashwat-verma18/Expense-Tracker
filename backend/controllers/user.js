const User = require('../models/userModel');

exports.addUser = (req, res, next) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    User
        .create({
            name: name,
            email: email,
            password: password
        })
        .then(result => {
            res.json({ "message": "User registered successfully !", check: true });

        })
        .catch(err => {
            res.json({ "message": "User already registered !", check: false })
        });

    // User.findAll({where : {email: email}})
    //     .then(user => {

    //         if(Object.keys(user) === 0){ 
    //             res.json({ message: "User already registered !", check : false})
    //         }else{
    //             console.log('not found!!!!!!!!1');

    //         }
    //     })
    //     .catch(err => console.log(err));
};