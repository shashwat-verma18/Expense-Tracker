const Expense = require('../models/expenseModel');
const User = require('../models/userModel');
const sequelize = require('../util/database');

exports.addExpense = async (req, res, next) => {

    const t = await sequelize.transaction();

    const amount = req.body.amount;
    const description = req.body.des;
    const category = req.body.cat;
    const userId = req.user.id;
    

    try {
        const expense = await Expense.create({ amount, description, category, userId }, { transaction: t });

        const user = await User.findOne({ where: { id: userId } });

        var total = user.total_amount || 0;
        total = +total + +amount;

        await User.update({
            total_amount: total
        }, {
            where: { id: userId  },
            transaction: t
        });

        await t.commit();

        res.status(200).json({ expense, success: true });
    } catch (err) {
        await t.rollback();
        console.log(err.toString());
        res.status(500).json({ error: err, success: false });
    }

};

exports.getExpenses = async (req, res, next) => {

    try {
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });
        res.status(200).json({ expenses, success: true });
    } catch (err) {
        res.status(500).json({ error: err, success: false });
    }

}

exports.deleteExpense = async (req, res, next) => {

    const t = await sequelize.transaction();

    const id = req.params.id;
    const userId = req.user.id;

    try {

        const user = await User.findOne({ where: { id: userId } });

        var amt = await Expense.findOne({ where: { id: id, userId: userId }, attributes: ['amount'] });

        console.log(user.total_amount);
        console.log(amt.amount);

        var total = user.total_amount - +amt.amount;

        await user.update({ total_amount: total }, { transaction: t });

        const exp = await Expense.destroy({
            where: {
                id: id,
                userId: userId
            },
            transaction: t
        });

        await t.commit();

        res.status(200).json({ success: true });

    } catch (err) {
        await t.rollback();
        console.log(err);
    }
}