const db = require('../config/db');



const getAllCustomers = async (req, res, next) => {
    try {
        const [result] = await db.query("SELECT u.id, u.username, u.role, u.firstName, u.lastName, u.address, u.street, u.city, u.email, u.phone, u.gender, u.avatar FROM user u INNER JOIN customer c ON u.id = c.userId WHERE role = ? AND c.isActive = ? ",['Customer','yes']);
        res.status(200).json({message: 'Success', customers: result});
        
    } catch (err) {
        next(err);
    }
}


const deleteCustomer = async (req, res, next) => {
    const id = req.params.id;

    try {
        const [result] = await db.query("SELECT * FROM user WHERE id = ?", [id]);

        if(result.length === 0) return res.status(404).json({message: 'Customer not found'});

        // delete customer
        await db.query("UPDATE customer SET isActive = ? WHERE userId = ?", ['no',id]);

        res.status(200).json({message: 'Customer Removed'});
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllCustomers,
    deleteCustomer
}