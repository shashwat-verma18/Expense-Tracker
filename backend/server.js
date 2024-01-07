const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const app = express();

dotenv.config();

const User = require('./models/userModel');
const Expense = require('./models/expenseModel');

const userRoute = require('./routes/userRoutes');
const expenseRoute = require('./routes/expenseRoutes');

app.use(cors());
app.use(bodyParser.json({ extended: false }));

app.use('/users', userRoute);
app.use('/expense', expenseRoute);


User.hasMany(Expense);
Expense.belongsTo(User, { constraints: true, onDelete: 'CASCADE', foreignKey: 'userId' });


sequelize
.sync({})
.then(result => {
    app.listen(4000);
})
.catch(err => console.log(err));

