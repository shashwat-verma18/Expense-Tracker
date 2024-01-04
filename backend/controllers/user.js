const User = require('../models/userModel');

exports.addUser = (req,res,next) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;


    User.findAll({where : {email: email}})
        .then(user => {
            if(user){
                res.json({ message: "User already registered !", check : false})
            }else{
                User
                    .create({
                        name: name,
                        email: email,
                        password: password
                    })
                    .then(result => {
                        res.json({"message": "User registered successfully !", check : true});

                    })
                    .catch(err => console.log(err));
            }
        })
        .catch(err => console.log(err));
};