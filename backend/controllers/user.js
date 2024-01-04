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

};

exports.loginUser = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    User.findAll({where : {email: email}})
        .then(user => {

            if(Object.keys(user).length === 0){
                res.status(404).json({message : "User not found!", display : "User is not registered !"});
            }else{
                const passwordSaved = user[0].dataValues.password;

                if(password === passwordSaved){
                    res.status(200).json({message : "User Login Successfully !", display: ""});
                }
                else{
                    res.status(401).json({message: "User not authorized", display : "Incorrect email or password"});
                }
            }
        })
        .catch(err => console.log(err));



}