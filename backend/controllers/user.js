const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.addUser = async (req, res, next) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password,10);

    console.log(hashedPassword);

    try{
        const user = await User.create({name, email, password: hashedPassword});
        res.json({ "message": "User registered successfully !", check: true });
    }catch(err){
        res.json({ "message": "User already registered !", check: false })
    }

};

exports.loginUser = async (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    try{
        const user = await User.findOne({where : {email}});

        if(!user){
            res.status(404).json({message : "User not found!", display : "User is not registered !"});
        }else{
            
            if(await bcrypt.compare(password, user.password)){

                res.status(200).json({message : "User Login Successfully !", token: generateToken(user.id), premium: user.isPremium});
            }
            else{
                res.status(401).json({message: "User not authorized", display : "Incorrect email or password"});
            }
        }

    }catch(err){
        console.log(err);
    }

}

function generateToken(id){
    return jwt.sign({userId: id},  process.env.TOKEN_SECRET);
}