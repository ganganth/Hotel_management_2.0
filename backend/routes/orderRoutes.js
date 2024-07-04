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

router.route('/AddReview')
    .post(orderControllers.AddReview)

router.route('/tax')
    .get(orderControllers.getRates)

router.route('/taxDetails')
    .get(orderControllers.getRatesDetails)

router.route('/taxUpdate')
    .put(orderControllers.getRatesUpdate)

router.route('/taxDelete')
    .delete(orderControllers.getRatesDelete)

module.exports = router;
