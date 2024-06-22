const db = require('../config/db');

const createNewEvent = async (req, res, next) => {
    const {name, type, image, price} = req.body;

    if(!name || !type || !image || !price) return res.status(422).json({message: 'Invalid inputs'});

    try {
        await db.query("INSERT INTO event (name, type, price, image) VALUES (?, ?, ?, ?)", [name, type, +price, image]);

        res.status(201).json({message: 'Event added successfully'});

    } catch (err) {
        next(err);   
         
    }
}

const getAllEvents = async (req, res, next) => {

    try {
        const [result] = await db.query("SELECT * FROM event");
    
        res.status(200).json({message: 'success', events: result});
    } catch (err) {
        next(err);
    }
}

const deleteEvent = async (req, res, next) => {
    const {eventId} = req.params;

    try {
        await  db.query("DELETE FROM event WHERE id=?", [+eventId]);

        res.status(200).json({message: 'Event removed successfully'});
    } catch (err) {
        next(err);
    }
}

const getAllCommonEvents = async (req, res, next) => {

    try {
        const [result] = await db.query("SELECT * FROM event WHERE type=?", ['common']);

        res.status(200).json({message: 'success', events: result});
    } catch (err) {
        next(err);
    }

}

const getAllSpecialEvents = async (req, res, next) => {

    try {
        const [result] = await db.query("SELECT * FROM event WHERE type=?", ['special']);
        
        res.status(200).json({message: 'success', events: result});
    } catch (err) {
        next(err);
    }
}

const getOverallEventsData = async (req, res, next) => {

    try {
        const [commonResult] = await db.query("SELECT COUNT(*) AS total_common_events FROM event WHERE type=?", ['common']);
        const [specialResult] = await db.query("SELECT COUNT(*) AS total_special_events FROM event WHERE type=?", ['special']);

        res.status(200).json({message: 'success', data: {common: commonResult[0].total_common_events, special: specialResult[0].total_special_events}});

    } catch (err) {
        next(err);
    }
}

// create a new event order 
const createEventOrder = async (req, res, next) => {
    const {events, total} = req.body;

    try {
        
        const [result] = await db.query("INSERT INTO event_order (total, totalNumOfEvents, isPaid, customerId) VALUES(?,?,?,?)", [+total, +events.length, 'yes', +req.user.id]);

        console.log(result.insertId);

        // add events under the order
        await Promise.all(events.map(e => {
            return db.query("INSERT INTO event_order_item(orderId, eventId, totalPeople, price, totalPrice) VALUES (?,?,?,?,?)", [result.insertId, +e.id, +e.people, +e.price, (+e.price * +e.people)]);
        }))

        res.status(201).json({message: 'Event order created successfully'});

    } catch (err) {
        next(err);
    }
}

// get a customer ordered events

const getAllEventOrdersOfCustomer = async (req, res, next) => {

    try {
        const [eventOrders] = await db.query("SELECT * FROM event_order WHERE customerId=?", [+req.user.id]);

        // for each event order we have to populate event items
        for(let i = 0; i < eventOrders.length; i++) {
            const order = eventOrders[i]; // current order
            const [items] = await db.query("SELECT orderId, eventId, totalPeople, price, totalPrice, (SELECT name FROM event WHERE id=eventId) AS name, (SELECT type FROM event WHERE id=eventId) AS type, (SELECT image FROM event WHERE id=eventId) AS image FROM event_order_item WHERE orderId=?", [+order.id]);
        
            // add those items into each event order
            eventOrders[i].items = items;
        }

        res.status(200).json({message: 'success', orders: eventOrders});
    } catch (err) {
        next(err);
    }
}

const getAllEventOrders = async (req,res, next) => {
    try {
        const [eventOrders] = await db.query("SELECT * FROM event_order");

        // for each event order we have to populate event items
        for(let i = 0; i < eventOrders.length; i++) {
            const order = eventOrders[i]; // current order
            const [items] = await db.query("SELECT orderId, eventId, totalPeople, price, totalPrice, (SELECT name FROM event WHERE id=eventId) AS name, (SELECT type FROM event WHERE id=eventId) AS type, (SELECT image FROM event WHERE id=eventId) AS image FROM event_order_item WHERE orderId=?", [+order.id]);
        
            // add those items into each event order
            eventOrders[i].items = items;
        }

        if(req.user.role === 'Admin' || req.user.role === 'Employee') {
            // populate customer details
            for(let i = 0; i < eventOrders.length; i++) {
                const order = eventOrders[i]; // current order
                const [customer] = await db.query("SELECT id, username, email, firstName, lastName, avatar, phone FROM customer WHERE id=?", [+order.customerId]);
            
                // add those items into each event order
                eventOrders[i].customerDetails = customer[0];
            }
        }

        res.status(200).json({message: 'success', orders: eventOrders});
    } catch (err) {
        
    }
}

const deleteCorder = async (req, res, next) => {
    const id = req.params.id;

    try {
        const [result] = await db.query("SELECT * FROM event_order WHERE id = ?", [id]);

        if(result.length === 0) return res.status(404).json({message: 'Order not found'});

        // delete customer
        await db.query("DELETE FROM event_order WHERE id = ?", [id]);

        res.status(200).json({message: 'order Removed'});
    } catch (err) {
        next(err);
        console.log(next(err))
    }
}

const getAvailableEventCount = async (req, res, next) => {
    const { eventId, reservedDate } = req.query;

    if (!eventId || !reservedDate) {
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

    const formattedReservedDate = formatDateForMySQL(reservedDate);


    try {
        const [totalEventOrders] = await db.query("SELECT IFNULL((SELECT sum(quantity) FROM place_booking WHERE eventId = ? AND reserveDate = ? GROUP BY eventId,reserveDate),0) AS totalQuantity ", [eventId, formattedReservedDate])
        const [totalStandardEventOrders] = await db.query("SELECT maxQuantity FROM event WHERE id = ?;", [eventId]);

        const availableEventCount = totalStandardEventOrders[0].maxQuantity - totalEventOrders[0].totalQuantity
        if (availableEventCount < 0) {
            availableEventCount = 0;
        }

        res.status(200).json({ message: 'Success', count: availableEventCount });

    } catch (err) {
        next(err);
    }

}


module.exports = {
    createNewEvent,
    getAllEvents,
    deleteEvent,
    getAllCommonEvents,
    getAllSpecialEvents,
    getOverallEventsData,

    createEventOrder,
    getAllEventOrdersOfCustomer,
    getAllEventOrders,
    deleteCorder,

    getAvailableEventCount
}