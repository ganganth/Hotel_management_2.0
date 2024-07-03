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

    const { dateRange } = req.query;

    if (!dateRange) {
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

        res.status(200).json({ message: 'Success', booking: result, title: title });

    } catch (err) {
        next(err);
    }
}

const getFilterOrderDetailsType = async (req, res, next) => {

    const { date, reservationType } = req.query;

    if (!date || !reservationType) {
        return res.status(400).json({ message: 'Invalid Inputs' });
    }

    try {
        let result = [];
        let title = ''

        if (reservationType == 1) {

            [result] = await db.query("SELECT p.bookingType, b.paymentType, p.quantity  AS booking_quantity, r.*, p.price As booking_price FROM place_booking p INNER JOIN room_type r ON r.id = p.roomId INNER JOIN booking b ON b.id = p.bookingId  WHERE b.CheckInDate = ? AND p.bookingType =  ?", [formatDateForMySQL(date), 'room']);
            title = `${formatDateForMySQL(date)} Reserve Rooms Details`

        } else if (reservationType == 2) {

            [result] = await db.query("SELECT p.bookingType, p.quantity  AS booking_quantity, p.reserveDate, r.*, p.price As booking_price FROM place_booking p INNER JOIN event r ON r.id = p.eventId WHERE p.reserveDate = ? AND p.bookingType =  ?", [formatDateForMySQL(date), 'event']);
            title = `${formatDateForMySQL(date)} Reserve Events Details`

        } else if (reservationType == 3) {

            [result] = await db.query("SELECT p.bookingType, m.name, mc.categoryName, p.quantity AS booking_quantity, p.reserveDate, r.*, p.price As booking_price FROM place_booking p INNER JOIN menu_category_meal r ON r.id = p.foodId INNER JOIN menu m ON m.id = r.menuId INNER JOIN menu_category mc ON mc.id = r.categoryId WHERE p.reserveDate = ? AND p.bookingType =  ?", [formatDateForMySQL(date), 'food']);
            title = `${formatDateForMySQL(date)} Reserve Foods Details`

        } else if (reservationType == 4) {

            [result] = await db.query("SELECT p.bookingType, p.quantity  AS booking_quantity, r.*, p.price As booking_price  FROM place_booking p INNER JOIN vehicle r ON r.id = p.vehicleId INNER JOIN booking b ON b.id = p.bookingId WHERE b.CheckInDate = ? AND p.bookingType =  ?", [formatDateForMySQL(date), 'vehicle']);
            title = `${formatDateForMySQL(date)} Reserve Vehicles Details`

        }

        res.status(200).json({ message: 'Success', booking: result, title: title });

    } catch (err) {
        next(err);
    }
}

const getSummary = async (req, res, next) => {

    try {

        const [result] = await db.query("SELECT COALESCE(SUM(totalPrice), 0) AS totalPrice, COALESCE(COUNT(id), 0) AS totalBooking, COALESCE(SUM(remainBalance), 0) AS totalRemain FROM booking WHERE DATE(checkInDate) = CURDATE()");
        const [result1] = await db.query("SELECT r.mealName AS meal, COALESCE(SUM(p.quantity), 0) AS TotalQuantity FROM place_booking p INNER JOIN menu_category_meal r ON r.id = p.foodId GROUP BY p.foodId, r.mealName ORDER BY TotalQuantity DESC LIMIT 5;");
        const [result2] = await db.query("SELECT r.name As event, COALESCE(SUM(quantity), 0) AS TotalQuantity FROM place_booking p INNER JOIN event r ON r.id = p.eventId GROUP BY p.eventId,r.name ORDER BY TotalQuantity DESC LIMIT 5");

        const COLORS = ['#2F4858', '#488A87', '#7EB693', '#5FA18F', '#335E6C'];
        let concat1 = [];
        let concat2 = [];

        if (result1.length > 0) {
            concat1 = result1.map((item, index) => ({
                title: item.meal,
                value: Number(item.TotalQuantity),
                color: COLORS[index % COLORS.length]
            }));
        }

        if (result2.length > 0) {
            concat2 = result2.map((item, index) => ({
                title: item.event,
                value: Number(item.TotalQuantity),
                color: COLORS[index % COLORS.length]
            }));
            
        }

        res.status(200).json({ message: 'Success', booking: result, char1: concat1, char2: concat2 });

    } catch (err) {
        next(err);
    }
}

const getFilterFood = async (req, res, next) => {

    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ message: 'Invalid Inputs' });
    }

    try {

        let result = [];
      
        if (date == 1) {
            [result] = await db.query("SELECT r.mealName AS meal, COALESCE(SUM(p.quantity), 0) AS TotalQuantity FROM place_booking p INNER JOIN menu_category_meal r ON r.id = p.foodId GROUP BY p.foodId, r.mealName ORDER BY TotalQuantity DESC LIMIT 5;");
        } else if (date == 2) {
            [result] = await db.query("SELECT r.mealName AS meal, COALESCE(SUM(p.quantity), 0) AS TotalQuantity FROM place_booking p INNER JOIN menu_category_meal r ON r.id = p.foodId WHERE DATE(p.reserveDate) = CURDATE() GROUP BY p.foodId, r.mealName ORDER BY TotalQuantity DESC LIMIT 5;");
        } else if (date == 3) {
            [result] = await db.query("SELECT r.mealName AS meal, COALESCE(SUM(p.quantity), 0) AS TotalQuantity FROM place_booking p INNER JOIN menu_category_meal r ON r.id = p.foodId WHERE DATE(p.reserveDate) >= CURDATE() - INTERVAL 7 DAY GROUP BY p.foodId, r.mealName ORDER BY TotalQuantity DESC LIMIT 5;");
        } else if (date == 4) {
            [result] = await db.query("SELECT r.mealName AS meal, COALESCE(SUM(p.quantity), 0) AS TotalQuantity FROM place_booking p INNER JOIN menu_category_meal r ON r.id = p.foodId WHERE DATE(p.reserveDate) >= CURDATE() - INTERVAL 30 DAY GROUP BY p.foodId, r.mealName ORDER BY TotalQuantity DESC LIMIT 5;");
        }

        const COLORS = ['#2F4858', '#488A87', '#7EB693', '#5FA18F', '#335E6C'];
        let concat1 = [];
        if (result.length > 0) {
            concat1 = result.map((item, index) => ({
                title: item.meal,
                value: Number(item.TotalQuantity),
                color: COLORS[index % COLORS.length]
            }));
        }

        res.status(200).json({ message: 'Success', booking: concat1 });

    } catch (err) {
        next(err);
    }
}

const getFilterEvent = async (req, res, next) => {

    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ message: 'Invalid Inputs' });
    }

    try {
        
        let result = [];
      
        if (date == 1) {
            [result] = await db.query("SELECT r.name As event, COALESCE(SUM(p.quantity), 0) AS TotalQuantity FROM place_booking p INNER JOIN event r ON r.id = p.eventId GROUP BY p.eventId,r.name ORDER BY TotalQuantity DESC LIMIT 5;");
        } else if (date == 2) {
            [result] = await db.query("SELECT r.name As event, COALESCE(SUM(p.quantity), 0) AS TotalQuantity FROM place_booking p INNER JOIN event r ON r.id = p.eventId WHERE DATE(p.reserveDate) = CURDATE() GROUP BY p.eventId,r.name ORDER BY TotalQuantity DESC LIMIT 5;");
        } else if (date == 3) {
            [result] = await db.query("SELECT r.name As event, COALESCE(SUM(p.quantity), 0) AS TotalQuantity FROM place_booking p INNER JOIN event r ON r.id = p.eventId WHERE DATE(p.reserveDate) >= CURDATE() - INTERVAL 7 DAY GROUP BY p.eventId,r.name ORDER BY TotalQuantity DESC LIMIT 5;");
        } else if (date == 4) {
            [result] = await db.query("SELECT r.name As event, COALESCE(SUM(p.quantity), 0) AS TotalQuantity FROM place_booking p INNER JOIN event r ON r.id = p.eventId WHERE DATE(p.reserveDate) >= CURDATE() - INTERVAL 30 DAY GROUP BY p.eventId,r.name ORDER BY TotalQuantity DESC LIMIT 5;");
        }

        const COLORS = ['#2F4858', '#488A87', '#7EB693', '#5FA18F', '#335E6C'];
        let concat1 = [];
        if (result.length > 0) {
            concat1 = result.map((item, index) => ({
                title: item.event,
                value: Number(item.TotalQuantity),
                color: COLORS[index % COLORS.length]
            }));
        }

        res.status(200).json({ message: 'Success', booking: concat1 });

    } catch (err) {
        next(err);
    }
}

const getSearch = async (req, res, next) => {

    const { reservationType,month,customer,payment } = req.query;

    if (!reservationType || !month || !customer || !payment) {
        return res.status(400).json({ message: 'Invalid Inputs' });
    }

    try {

        const [result] = await db.query("SELECT * FROM booking WHERE paymentType = ? AND isPaid = ? AND month(checkInDate) = ? AND bookingType = ?",[payment, customer, month, reservationType]);

        res.status(200).json({ message: 'Success', booking: result });

    } catch (err) {
        next(err);
    }
}


module.exports = {
    getAllOrderDetails,
    getFilterOrderDetails,
    getFilterOrderDetailsType,
    getSummary,
    getFilterFood,
    getFilterEvent,
    getSearch
}