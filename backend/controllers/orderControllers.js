const db = require('../config/db');
const formatDateForMySQL = require('../config/formatDate');

const getAllOrderDetails = async (req, res, next) => {
    try {
        const [result] = await db.query("SELECT * FROM booking ORDER BY id DESC");

        if (result.length <= 0) return res.status(404).json({ message: 'Booking not found' });

        res.status(200).json({ message: 'Success', booking: result });

    } catch (err) {
        next(err);
    }
}

const getFilterOrderDetails = async (req, res, next) => {

    const {dateRange} = req.query;

    if (!dateRange ) {
        return res.status(400).json({ message: 'Invalid Inputs' });
    }

    try {
        let result = [];
        let title = ''
        
        if (dateRange == 0) {
           
            [result] = await db.query("SELECT * FROM booking WHERE DATE(checkInDate) = CURDATE()  ORDER BY id DESC");
            title = 'Today Booking Details.'

        } else if (dateRange == 1) {
            
            [result] = await db.query("SELECT * FROM booking WHERE DATE(checkInDate) >= CURDATE() - INTERVAL 7 DAY  ORDER BY id DESC");
            title = 'Last 7 Days Booking Details.'

        } else if (dateRange == 2) {
            
            [result] = await db.query("SELECT * FROM booking WHERE DATE(checkInDate) >= CURDATE() - INTERVAL 30 DAY  ORDER BY id DESC");
            title = 'Last 30 Days Booking Details.'

        } else if (dateRange == 3) {
            
            [result] = await db.query("SELECT * FROM booking ORDER BY id DESC");
            title = 'All Booking Details.'

        }

        res.status(200).json({ message: 'Success', booking: result, title :title });

    } catch (err) {
        next(err);
    }
}

const getFilterOrderDetailsType = async (req, res, next) => {

    const {currentDate,reservationType} = req.query;

    if (!currentDate || !reservationType ) {
        return res.status(400).json({ message: 'Invalid Inputs' });
    }

    try {
        let result = [];
        let title = ''
        
        if (reservationType == 1) {
           
            [result] = await db.query("");
            title = `${formatDateForMySQL(currentDate)} reserve rooms details`

        } else if (reservationType == 2) {
            
            [result] = await db.query("");
            title = `${formatDateForMySQL(currentDate)} reserve events details`

        } else if (reservationType == 3) {
            
            [result] = await db.query("");
            title = `${formatDateForMySQL(currentDate)} reserve foods details`

        } else if (reservationType == 4) {
            
            [result] = await db.query("");
            title = `${formatDateForMySQL(currentDate)} reserve vehicles details`

        }

        res.status(200).json({ message: 'Success', booking: result, title :title });

    } catch (err) {
        next(err);
    }
}


module.exports = {
    getAllOrderDetails,
    getFilterOrderDetails,
    getFilterOrderDetailsType
}