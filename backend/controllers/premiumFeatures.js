const User = require('../models/userModel');
const Expense = require('../models/expenseModel');
const sequelize = require('../util/database');

exports.showLeaderboard = async (req, res) => {

    try {

        const userLeaderboard = await User.findAll({
            attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'total_cost']],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['users.id'],
            order: [['total_cost', 'DESC']]
        });


        res.status(200).json({ userLeaderboard });

    } catch (err) {
        console.log(err);
    }
}