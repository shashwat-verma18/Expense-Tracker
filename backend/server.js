const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const sequelize = require('./util/database');

const app = express();

const routes = require('./routes/userRoutes');

app.use(cors());
app.use(bodyParser.json({ extended: false }));

app.use('/users', routes);

sequelize
.sync()
.then(result => {
    app.listen(4000);
})
.catch(err => console.log(err));

