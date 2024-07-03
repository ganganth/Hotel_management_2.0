const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const orderControllers = require('../controllers/orderControllers');

router.use(auth);

router.route('/')
    .get(orderControllers.getAllOrderDetails)

router.route('/filterData')
    .get(orderControllers.getFilterOrderDetails)

router.route('/filterDataType')
    .get(orderControllers.getFilterOrderDetailsType)

router.route('/summary')
    .get(orderControllers.getSummary)

router.route('/foodWithDate')
    .get(orderControllers.getFilterFood)

router.route('/eventWithDate')
    .get(orderControllers.getFilterEvent)

router.route('/searchFilter')
    .get(orderControllers.getSearch)

module.exports = router;
