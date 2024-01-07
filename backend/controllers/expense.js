const Expense = require('../models/expenseModel');

exports.addExpense = async (req, res, next) => {

    const amount = req.body.amount;
    const description = req.body.des;
    const category = req.body.cat;
    const userId = req.user.id;

    console.log(userId);

    try{
        const expense = await Expense.create({amount, description, category, userId});
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

    try{
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