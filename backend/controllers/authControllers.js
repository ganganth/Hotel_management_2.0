const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// @desc   register a new customer
// @route  POST /api/auth/register
// @access Public

const register = async (req, res, next) => {
    const { username, password, firstName, lastName, email, phone, address, street, city, gender, avatar = null } = req.body;

    if (!username || !password || !firstName || !lastName || !email || !phone || !address || !street || !city || !gender) {
        return res.status(400).json({ message: 'Invalid Inputs' });
    }

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [duplicate] = await connection.query("SELECT * FROM user WHERE username = ?", [username]);

        if (duplicate.length > 0) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({ message: 'Username is already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let avatarUrl = avatar ? avatar : (gender === 'male' ? 'https://firebasestorage.googleapis.com/v0/b/hotelmanagement-2553b.appspot.com/o/avatars%2Fcustomer-male.png?alt=media&token=6603a5b0-9677-40ad-8769-7f1dba94913f' : 'https://firebasestorage.googleapis.com/v0/b/hotelmanagement-2553b.appspot.com/o/avatars%2Fcustomer-female.jpg?alt=media&token=7c416675-791c-4f1b-b844-d9a0c5b59191');

        const query = `INSERT INTO user (username, password, role, firstName, lastName, address, street, city, email, phone, gender, avatar) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const result1 = await connection.query(query, [username, hashedPassword, 'Customer', firstName, lastName, address, street, city, email, phone, gender, avatarUrl]);

        const userId = result1[0].insertId;

        const query1 = `INSERT INTO customer (userId, isActive) VALUES (?, ?)`;
        await connection.query(query1, [userId, 1]);

        await connection.commit();
        connection.release();

        res.status(201).json({ message: 'Registration Success' });

    } catch (err) {
        if (connection) {
            await connection.rollback();
            connection.release();
        }
        next(err);
    } finally {
        if (connection) {
            connection.release();
        }
    }
};


// @desc   login all types of users (Customer, Employee, Admin)
// @route  POST /api/auth/login
// @access Public

const login = async (req, res, next) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    try {
        let userExist;

        // query user table to find the user by the username
        const [result] = await db.query("SELECT * FROM user WHERE username = ?", [username]);
        userExist = result[0];

        if (!userExist) {
            return res.status(404).json({ message: 'Invalid username or password' });
        }

        // check for the password
        const isMatch = await bcrypt.compare(password, userExist.password);

        if (!isMatch) {
            return res.status(404).json({ message: 'Invalid username or password' });
        }

        // sign jwt token (access token)
        const accessToken = jwt.sign({ id: userExist.id, role: userExist.role }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

        const refreshToken = jwt.sign({ id: userExist.id, role: userExist.role }, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

        // storing refresh token in a httpOnly 
        res.cookie('jwt',
            refreshToken,
            { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }
        )

        // store the refresh token in the db
        await db.query("UPDATE user SET refreshToken = ? WHERE username = ?", [refreshToken, username]);


        const user = {
            id: userExist.id,
            role: userExist.role,
            username: userExist.username,
            firstName: userExist.firstName,
            lastName: userExist.lastName,
            avatar: userExist.avatar
        }

        res.status(200).json({ message: 'Login success', accessToken, user });

    } catch (err) {
        next(err);
    }
}

// @desc get a new access token
// @route POST /api/auth/refresh
// @access Public 

const refresh = async (req, res, next) => {
    const cookie = req.cookies;

    if (!cookie?.jwt) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const refreshToken = cookie.jwt;


    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, async (err, decode) => {

        if (err) return res.status(403).json({ message: 'Forbidden' });

        if (!decode?.id || !decode?.role) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        let query;

        query = "SELECT * FROM user WHERE id = ? ";

        const [result] = await db.query(query, [decode.id]);
        const userExist = result[0];

        // generate a new access token and send
        const accessToken = jwt.sign({ id: decode.id, role: decode.role }, process.env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

        const user = {
            id: userExist.id,
            role: userExist.role,
            username: userExist.username,
            firstName: userExist.firstName,
            lastName: userExist.lastName,
            avatar: userExist.avatar
        }

        res.status(200).json({ message: 'Access token updated', accessToken, user });

    });

}

// @desc logout a customer, employee
// @route POST /api/auth/logout
// @access Public 

const logout = async (req, res, next) => {

    try {

        if (req.body.id && req.body.role) {
            const query = "UPDATE user SET refreshToken = null WHERE id = ? ";
            await db.query(query, [req.body.id]);
        }

        const cookie = req.cookies;

        if (!cookie?.jwt) return res.status(204).json({ message: 'Success' }); // 204 - success but no content

        // remove the cookie from the response headers
        res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' });

        res.status(200).json({ message: 'Logout Success' });

    } catch (err) {
        next(err);
    }

}

module.exports = {
    register,
    login,
    refresh,
    logout
}