const Expense = require('../models/expenseModel');
const User = require('../models/userModel');

exports.addExpense = async (req, res, next) => {

    const amount = req.body.amount;
    const description = req.body.des;
    const category = req.body.cat;
    const userId = req.user.id;

    console.log(userId);

    try{
        const expense = await Expense.create({amount, description, category, userId});

        const user = await User.findOne({where: {id: userId}});

        var total = user.total_amount || 0;
        total = +total + +amount; 

        await user.update({total_amount : total});
        res.status(200).json({ expense, success: true });
    }catch(err){
        console.log(err.toString());
        res.status(500).json({ error: err, success: false });
    }

};

exports.getExpenses = async(req, res, next) => {

    try{
        const expenses = await Expense.findAll({where: {userId : req.user.id}});
        res.status(200).json({ expenses, success: true });
    }catch(err){
        res.status(500).json({ error: err, success: false });
    }

}

exports.deleteExpense = async(req, res, next) => {
    const id = req.params.id;
    const userId = req.user.id;

    console.log(id+" : "+userId);

    try{

        const user = await User.findOne({where: {id: userId}});

        var amt = await Expense.findOne({where :{id: id, userId: userId}, attributes:['amount']});
        
        console.log(user.total_amount);
        console.log(amt.amount);

        var total = user.total_amount - +amt.amount; 

        await user.update({total_amount : total});

        const exp = await Expense.destroy({
            where:{
                id: id,
                userId: userId
            }
        });

        res.status(200).json({success:true});

    }catch(err){
        console.log(err);
    }
}