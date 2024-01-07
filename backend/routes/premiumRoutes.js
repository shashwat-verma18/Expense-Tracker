const express = require('express');

const premiumController = require('../controllers/premium.js');
const auth = require('../middleware/auth.js');

const router = express.Router();

router.get('/premiumMembership', auth.authenticate, premiumController.purchasePremium);

router.post('/updateTransactionStatus', auth.authenticate, premiumController.updatePrmium);

module.exports = router;