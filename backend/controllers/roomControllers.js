const db = require('../config/db');
const sendEmail = require('../config/emailSender');
const sendSMS = require('../config/smsSender');
const formatDateForMySQL = require('../config/formatDate');

const getAllSpecialFeatures = async (req, res, next) => {
    try {
        const [result] = await db.query("SELECT * FROM special_feature");
        res.status(200).json({ message: 'Success', features: result });
    } catch (err) {
        next(err);
    }
}

const createNewRoomType = async (req, res, next) => {
    const { name, bedType, regularPrice, fullPaymentDiscount, adultOccupation, childOccupation, description, view, bathroomType, televisionType, heatingAvailability, towelAvailability, commonFeaturePrice, specialFeatures, rooms, imageCount } = req.body;

    if (+imageCount !== 6) return res.status(400).json({ message: '6 images are required' });

    // validation check
    if (!name || !bedType || +regularPrice <= 0 || +adultOccupation < 0 || +childOccupation < 0 || !description || !view || !bathroomType || !televisionType || !heatingAvailability || !towelAvailability || +commonFeaturePrice <= 0) {
        return res.status(400).json({ message: 'Invalid Input Data' });
    }

    if (rooms.length <= 0) {
        return res.status(400).json({ message: 'At least one room number is required' });
    }

    // calculate neccesary fields
    const totalRooms = rooms.length;
    let totalPrice = regularPrice + commonFeaturePrice;
    if (specialFeatures.length > 0) {
        const specialFeatureTotalPrice = specialFeatures.reduce((acc, item) => (acc + item.price), 0)
        totalPrice += +specialFeatureTotalPrice.toFixed(2);
    }
    totalPrice = +totalPrice.toFixed(2);

    try {

        // create new room type record in database
        const [result] = await db.query(`INSERT INTO room_type (name, bedType, description, regularPrice, fullPaymentDiscount, adultOccupation, childOccupation, view, bathroomType, televisionType, heatingAvailability, towelAvailability, commonFeaturePrice, totalRooms, totalPrice) VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [name, bedType, description, +regularPrice, +fullPaymentDiscount, +adultOccupation, +childOccupation, view, bathroomType, televisionType, heatingAvailability, towelAvailability, +commonFeaturePrice, +totalRooms, +totalPrice]);

        const roomTypeId = result.insertId;

        if (specialFeatures.length > 0) {
            specialFeatures.forEach(async f => {
                await db.query("INSERT INTO room_type_feature (roomTypeId, featureId) VALUES (?, ?)", [roomTypeId, f.id]);
            })
        }

        // update room_type_room table as well
        rooms.forEach(async r => {
            await db.query("INSERT INTO room_type_room (roomTypeId, roomNo) VALUES (?, ?)", [roomTypeId, +r]);
        })

        res.status(201).json({ message: 'New Room type created', id: roomTypeId });

    } catch (err) {
        next(err)
    }

}

const updateRoomTypeImages = async (req, res, next) => {
    const { imageUrls, id } = req.body;

    if (imageUrls.length !== 6) {
        return res.status(400).json({ message: '6 images are requried' });
    }

    try {
        imageUrls.forEach(async item => {
            await db.query("INSERT INTO room_type_image (roomTypeId, imageUrl, fileName) VALUES (?, ?, ?)", [+id, item.url, item.fileName]);
        })

        res.status(200).json({ message: 'Room type images updated' });
    } catch (err) {
        next(err);
    }
}

const getAllRoomTypes = async (req, res, next) => {
    try {
        const [result] = await db.query("SELECT * FROM room_type");

        const roomsData = [];

        result.forEach(async roomType => {
            const [rooms] = await db.query("SELECT roomNo FROM room_type_room WHERE roomTypeId = ?", [roomType.id]);
            const [images] = await db.query("SELECT imageUrl, fileName FROM room_type_image WHERE roomTypeId = ?", [roomType.id]);
            const [features] = await db.query("SELECT * FROM special_feature WHERE id IN (SELECT featureId FROM room_type_feature WHERE roomTypeId = ?)", [roomType.id]);

            const proper = {
                ...roomType,
                images,
                rooms,
                specialFeatures: features
            }

            roomsData.push(proper);
            if (roomsData.length === result.length) {

                res.status(200).json({ message: 'Success', rooms: roomsData });
            }
        })


    } catch (err) {
        next(err);
    }
}


const getSingleRoomType = async (req, res, next) => {
    const id = req.params.id;

    try {
        const [result] = await db.query("SELECT * FROM room_type WHERE id = ?", [id]);

        if (result.length <= 0) {
            return res.status(404).json({ message: 'Room type not found' });
        }

        const [rooms] = await db.query("SELECT roomNo FROM room_type_room WHERE roomTypeId = ?", [id]);
        const [images] = await db.query("SELECT imageUrl, fileName FROM room_type_image WHERE roomTypeId = ?", [id]);
        const [features] = await db.query("SELECT id, name, price FROM special_feature WHERE id IN (SELECT featureId FROM room_type_feature WHERE roomTypeId = ?)", [id]);

        const proper = {
            ...result[0],
            images,
            rooms,
            specialFeatures: features
        }

        res.status(200).json({ message: 'Success', room: proper });

    } catch (err) {
        next(err);
    }
}

/* BOOKING SPECIFIC ROUTES */


const getAvailableRoomsForBooking = async (req, res, next) => {
    const { roomType, checkInDate, checkOutDate } = req.query;

    if (!roomType || !checkInDate || !checkOutDate) {
        return res.status(400).json({ message: 'Invalid Inputs' });
    }

    function formatDateForMySQL(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const formattedCheckInDate = formatDateForMySQL(checkInDate);
    const formattedCheckOutDate = formatDateForMySQL(checkOutDate);

    try {

        const [totalRoomOrders] = await db.query("SELECT IFNULL( (SELECT SUM(pb.quantity) FROM place_booking pb INNER JOIN booking b ON b.id = pb.bookingId WHERE pb.roomId = ? AND (b.checkOutDate < ? AND b.checkInDate > ?) GROUP BY pb.roomId, b.checkInDate, b.checkOutDate), 0) AS totalQuantity;", [roomType, formattedCheckOutDate, formattedCheckInDate])
        const [result] = await db.query("SELECT * FROM room_type WHERE id = ?", [roomType]);

        if (result.length <= 0) {
            return res.status(404).json({ message: 'Room type not found' });
        }
        const availableRoomCount = result[0].totalRooms - totalRoomOrders[0].totalQuantity

        if (availableRoomCount < 0) {
            availableRoomCount = 0;
        }

        result[0].totalRooms = availableRoomCount;

        const [rooms] = await db.query("SELECT roomNo FROM room_type_room WHERE roomTypeId = ?", [roomType]);
        const [images] = await db.query("SELECT imageUrl, fileName FROM room_type_image WHERE roomTypeId = ?", [roomType]);
        const [features] = await db.query("SELECT id, name, price FROM special_feature WHERE id IN (SELECT featureId FROM room_type_feature WHERE roomTypeId = ?)", [roomType]);

        const proper = {
            ...result[0],
            images,
            rooms,
            specialFeatures: features
        }

        res.status(200).json({ message: 'Success', room: proper });

    } catch (err) {
        next(err);
    }
}


const createNewBooking = async (req, res, next) => {
    const
        {
            checkInDate,
            checkOutDate,
            paymentType,
            totalNightsStay,
            paidTotalPrice,
            bookingTotalPrice,
            isPaid,
            remainingBalance,
            customerId,
            bookingType,
            rooms,
            events,
            vehicle,
            foods
        } = req.body;

    if (!bookingType || !isPaid || !customerId || !checkInDate || !checkOutDate || !paymentType || !totalNightsStay || paidTotalPrice <= 0 || bookingTotalPrice <= 0) {
        return res.status(400).json({ message: 'Invalid Inputs' });
    }

    const connection = await db.getConnection();

    try {
        // Start a transaction
        await connection.beginTransaction();

        // Insert booking
        const [result] = await connection.query(`
            INSERT INTO booking (checkInDate, checkOutDate, totalPrice, paymentType, isPaid, totalPaidPrice, remainBalance,  totalNightsStay, customerId, bookingType) 
            VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [formatDateForMySQL(checkInDate), formatDateForMySQL(checkOutDate), bookingTotalPrice, paymentType, isPaid, paidTotalPrice, remainingBalance, totalNightsStay, customerId, bookingType]);
        
        const bookingId = result.insertId;

        // Insert rooms
        for (const r of rooms) {
            await connection.query(`
                INSERT INTO place_booking (bookingId, roomId, vehicleId, eventId, foodId, quantity, price, bookingType, reserveDate, pickUpLocation) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [bookingId, r.id, 1, 1, 1, r.total_quantity, r.total_price, 'room', null, null]);
        }

        // Insert events
        for (const e of events) {
            await connection.query(`
                INSERT INTO place_booking (bookingId, roomId, vehicleId, eventId, foodId, quantity, price, bookingType, reserveDate, pickUpLocation) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [bookingId, 1, 1, e.id, 1, e.total_quantity, e.total_price, 'event', formatDateForMySQL(e.reserveDate), null]);                                                                                            
        }

        // Insert vehicles
        for (const v of vehicle) {
            await connection.query(`
                INSERT INTO place_booking (bookingId, roomId, vehicleId, eventId, foodId, quantity, price, bookingType, reserveDate, pickUpLocation) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [bookingId, 1, v.id, 1, 1, v.total_quantity, v.total_price, 'vehicle', null, v.pickUpLocation]);
        }

        // Insert foods
        for (const f of foods) {
            await connection.query(`
                INSERT INTO place_booking (bookingId, roomId, vehicleId, eventId, foodId, quantity, price, bookingType, reserveDate, pickUpLocation) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [bookingId, 1, 1, 1, f.id, f.total_quantity, f.total_price, 'food', formatDateForMySQL(f.reserveDate), pickUpLocation]);
        }

        // Commit the transaction
        await connection.commit();

        const [customerDetails] = await db.query('SELECT email, phone FROM user WHERE id = ?',[customerId]);
        const mobileNo = customerDetails[0].phone;
        const email = customerDetails[0].email;
        const subject_text = 'Thank you for your reservation';
        const message_text = `Your reservation ${bookingId} is confirmed and Enjoy your vacation`;

        await sendEmail(email,subject_text,message_text);
        await sendSMS(message_text,mobileNo);

        res.status(200).json({ message: 'Booking created' });

    } catch (err) {
        // Rollback the transaction in case of error
        await connection.rollback();
        next(err);
    }finally {
        // Release the connection back to the pool
        connection.release();
    }
}

// @desc get all bookings of a customer
// @route GET /api/rooms/bookings/customer/:id
// @access protected (Customer, Employee, Admin)

const getAllBookings = async (req, res, next) => {

    try {
        const [result] = await db.query("SELECT * FROM booking");

        res.status(200).json({ message: 'Success', bookings: result });
    } catch (err) {
        next(err);
    }
}


// @desc get all bookings of a customer
// @route GET /api/rooms/bookings/customer/:id
// @access protected (Customer, Employee, Admin)

const getAllBookingsOfACustomer = async (req, res, next) => {
    const customerId = req.params.id;
    const role = req.query.role === 'Customer' ? 'Customer' : 'Employee';

    try {
        const [result] = await db.query("SELECT * FROM booking WHERE customerId = ?", [customerId]);

        if (result.length === 0) return res.status(200).json({ message: 'No Bookings Available', bookings: [] });

        res.status(200).json({ message: 'Success', bookings: result });

    } catch (err) {
        next(err);
    }
}


// @desc get details about single booking
// @route GET /api/rooms/bookings/:id 
// @access protected (Customer, Employee, Admin)

const getSingleBookingInSingleCustomer = async (req, res, next) => {
    const bookingId = req.params.id;

    try {
        const [result] = await db.query("SELECT * FROM place_booking WHERE bookingId = ? AND bookingType = ?", [bookingId , 'room']);
        
        if (result.length <= 0) return res.status(404).json({ message: 'Booking not found' });
       
        const [roomDetails] = await db.query("SELECT  b.paymentType, p.quantity  AS booking_quantity, r.*, p.price As booking_price FROM place_booking p INNER JOIN room_type r ON r.id = p.roomId INNER JOIN booking b ON b.id = p.bookingId  WHERE p.bookingId = ? AND p.bookingType =  ?",[bookingId ,'room']);
        const [vehicleDetails] = await db.query("SELECT  p.quantity  AS booking_quantity, r.*, p.price As booking_price  FROM place_booking p INNER JOIN vehicle r ON r.id = p.vehicleId WHERE p.bookingId = ? AND p.bookingType =  ?",[bookingId ,'vehicle']);
        const [eventDetails] = await db.query("SELECT  p.quantity  AS booking_quantity, p.reserveDate, r.*, p.price As booking_price FROM place_booking p INNER JOIN event r ON r.id = p.eventId WHERE p.bookingId = ? AND p.bookingType =  ?",[bookingId ,'event']);
        const [foodDetails] = await db.query("SELECT m.name, mc.categoryName, p.quantity AS booking_quantity, p.reserveDate, r.*, p.price As booking_price FROM place_booking p INNER JOIN menu_category_meal r ON r.id = p.foodId INNER JOIN menu m ON m.id = r.menuId INNER JOIN menu_category mc ON mc.id = r.categoryId WHERE p.bookingId = ? AND p.bookingType =  ?",[bookingId ,'food']);
        const [customerDetails] = await db.query("SELECT u.* FROM user u INNER JOIN booking b ON b.customerId = u.Id  WHERE b.id = ? ", [bookingId])

        const booking = {
            bookedRooms: roomDetails,
            bookedEvent: eventDetails,
            bookedVehicle: vehicleDetails,
            bookedFood: foodDetails,
            customerDetails : customerDetails
        }

        res.status(200).json({ message: 'Success', booking });

    } catch (err) {
        next(err);
    }
}


const updateBookingPaymentStatus = async (req, res, next) => {
    const bookingId = req.params.id;
    console.log(bookingId, req.body.amount);
    try {
        const q1 = "UPDATE booking SET paymentType=?,isPaid=?, totalPaidPrice=?, remainBalance=? WHERE id=?";

        await db.query(q1, ['full', 'yes', +req.body.amount, 0, +bookingId]);

        const [result] = await db.query("SELECT * FROM booking WHERE id = ?", [+bookingId]);

        const [rooms] = await db.query("SELECT roomTypeId, roomNo FROM booking_room WHERE bookingId = ?", [+bookingId]);

        const [roomTypeDetails] = await db.query("SELECT id, name FROM room_type WHERE id = ?", [+rooms[0].roomTypeId]);

        const booking = {
            ...result[0],
            bookedRooms: rooms,
            bookedRoomType: roomTypeDetails[0]
        }

        res.status(201).json({ message: 'success', booking });
        // res.status(201).json({message: 'success'});

    } catch (err) {
        next(err);
    }
}


const getMonthlyBookingsReport = async (req, res, next) => {
    try {
        const [result] = await db.query("SELECT month_names.month_name,MONTH(checkInDate) AS month,COUNT(*) AS total_bookings,SUM(totalPrice) AS revenue FROM booking JOIN month_names ON MONTH(checkInDate) = month_names.month_number GROUP BY month_names.month_name, MONTH(checkInDate)");

        let months = [
            { num: 1, name: 'Jan' },
            { num: 2, name: 'Feb' },
            { num: 3, name: 'March' },
            { num: 4, name: 'April' },
            { num: 5, name: 'May' },
            { num: 6, name: 'June' },
            { num: 7, name: 'July' },
            { num: 8, name: 'Aug' },
            { num: 9, name: 'Sep' },
            { num: 10, name: 'Oct' },
            { num: 11, name: 'Nov' },
            { num: 12, name: 'Dec' },
        ];
        let report = [];

        months.forEach(month => {
            const found = result.find(item => item.month === month.num);

            if (found) {
                report.push({
                    month: found.month,
                    monthName: month.name,
                    revenue: found.revenue,
                    totalBookings: found.total_bookings
                });
            } else {
                report.push({
                    month: month.num,
                    monthName: month.name,
                    revenue: 0,
                    totalBookings: 0
                });
            }
        });

        res.status(200).json({ message: 'success', data: report });
    } catch (err) {
        next(err);
    }
}

const deleteCorder = async (req, res, next) => {
    const id = req.params.id;

    try {
        const [result] = await db.query("SELECT * FROM booking WHERE id = ?", [id]);

        if (result.length === 0) return res.status(404).json({ message: 'Order not found' });

        // delete customer
        await db.query("DELETE FROM booking WHERE id = ?", [id]);

        res.status(200).json({ message: 'order Removed' });
    } catch (err) {
        next(err);

    }
}

const getRoomDetails = async (req, res, next) => {
    const {id} = req.query;;

    try {
        const [result] = await db.query("SELECT totalPrice AS price, totalRooms AS quantity FROM room_type WHERE id = ?", [id])

        res.status(200).json({ message: 'success', details : result });
    } catch (err) {
        next(err);

    }
}

const updateRoomDetails = async (req, res, next) => {
    const {id, quantity, price} = req.query;

    if(!id || !quantity || !price){
        res.status(400).json({message:'Invalid Inputs'})
    }

    try {
        await db.query("UPDATE room_type SET totalPrice = ?, totalRooms = ? WHERE id = ? ", [price,quantity,id]);
        res.status(200).json({ message: 'updated' });
    } catch (err) {
        next(err);
    }
}

const deleteRoomDetails = async (req, res, next) => {
    const {id} = req.query;

    try {
        await db.query("DELETE FROM room_type WHERE id = ?", [id]);
        res.status(200).json({ message: 'Removed' });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllSpecialFeatures,
    createNewRoomType,
    updateRoomTypeImages,
    getAllRoomTypes,
    getSingleRoomType,

    getAvailableRoomsForBooking,
    createNewBooking,
    getAllBookingsOfACustomer,
    getSingleBookingInSingleCustomer,
    getAllBookings,
    updateBookingPaymentStatus,

    getMonthlyBookingsReport,
    deleteCorder,

    deleteRoomDetails,
    updateRoomDetails,
    getRoomDetails
}