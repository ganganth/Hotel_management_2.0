const db = require('../config/db');

const createNewMenu = async (req, res, next) => {

    const { menuName, categoryName, mealName, price, quantity } = req.body;

    if (!menuName || !categoryName || !mealName || !price || !quantity) return res.status(400).json({ message: 'Invalid input data' });

    try {
  
    const [result] = await db.query("SELECT id,menuId FROM menu_category WHERE categoryName = ?",[categoryName])
    const menuId = result[0].menuId;
    const catId = result[0].id;

    await db.query("INSERT INTO menu_category_meal(menuId, categoryId, mealName, price, maxCountPerDay) VALUES(?, ?, ?, ?, ?)", [menuId, catId, mealName, price, quantity]);

    } catch (err) {
        next(err);
    }

}

// GET ALL MENU DATA
const getAllMenus = async (req, res, next) => {
    try {
        const [menus] = await db.query("SELECT * FROM menu");

        let menusData = [];

        const result = await Promise.all(menus.map(m => db.query("SELECT id, categoryName FROM menu_category WHERE menuId=?", [m.id])));

        menus.forEach((m, i) => {
            menusData.push({
                ...m,
                categories: result[i][0]
            });
        })

        let updatedMenusData = [];

        menusData.forEach(async (menu) => {

            let updatedCategories = [];
            for (let i = 0; i < menu.categories.length; i++) {
                const [result] = await db.query("SELECT COUNT(*) AS total_meals FROM menu_category_meal WHERE menuId=? AND categoryId=?", [menu.id, menu.categories[i].id]);
                updatedCategories.push({ ...menu.categories[i], totalMeals: result[0].total_meals });
            }

            updatedMenusData.push({
                ...menu,
                categories: updatedCategories
            });

            if (updatedMenusData.length === menusData.length) {
                res.status(200).json({ message: 'success', menus: updatedMenusData });
            }
        });


    } catch (err) {
        next(err);
    }
}

// GET selected MENU DATA
const getSelectedMenus = async (req, res, next) => {
    try {
        const menuType = req.params.menuType;

        let menus;
        if (menuType == 1) {
            menus = await db.query("SELECT * FROM menu where name IN ('BreakFast' ,'Brunch')");
        }
        else if (menuType == 2) {
            menus = await db.query("SELECT * FROM menu where name IN ('Lunch')");
        }
        else {
            menus = await db.query("SELECT * FROM menu where name IN ('Tea' , 'Dinner')");
        }

        let menusData = [];

        const result = await Promise.all(menus[0].map(m => db.query("SELECT id, categoryName FROM menu_category WHERE menuId=?", [m.id])));

        menus[0].forEach((m, i) => {
            menusData.push({
                ...m,
                categories: result[i][0]
            });
        })

        let updatedMenusData = [];

        menusData.forEach(async (menu) => {

            let updatedCategories = [];
            for (let i = 0; i < menu.categories.length; i++) {
                const [result] = await db.query("SELECT COUNT(*) AS total_meals FROM menu_category_meal WHERE menuId=? AND categoryId=?", [menu.id, menu.categories[i].id]);
                updatedCategories.push({ ...menu.categories[i], totalMeals: result[0].total_meals });
            }

            updatedMenusData.push({
                ...menu,
                categories: updatedCategories
            });
            if (updatedMenusData.length === menusData.length) {
                res.status(200).json({ message: 'success', menus: updatedMenusData });
            }
        });


    } catch (err) {
        next(err);
    }
}

// DELETE A MENU COMPLETELY

const deleteMenu = async (req, res, next) => {
    const { menuId } = req.params;

    try {
        const [result] = await db.query("SELECT * FROM menu WHERE id=?", [+menuId]);

        if (result.length === 0) return res.status(400).json({ message: 'Invalid menu id' });

        // delete the menu data completely
        await db.query("DELETE FROM menu WHERE id=?", [+menuId]);

        res.status(200).json({ message: 'Menu deleted successfully' });
    } catch (err) {
        next(err);
    }
}

// GET SINGLE MENU DATA

const getSingleMenu = async (req, res, next) => {
    const { menuId } = req.params;

    try {
        const [result] = await db.query("SELECT * FROM menu WHERE id=?", [+menuId]);

        if (result.length === 0) return res.status(404).json({ message: 'Menu not found with the given id' });

        let menuData = { ...result[0] };

        // populate categories and meals for each category
        const [categories] = await db.query("SELECT id, categoryName FROM menu_category WHERE menuId=?", [+menuData.id]);

        menuData.categories = categories;

        const categoriesResult = await Promise.all(categories.map(c => db.query("SELECT * FROM menu_category_meal WHERE menuId=? AND categoryId=?", [+menuData.id, +c.id])));

        const meals = {};

        categories.forEach((c, i) => {
            meals[c.categoryName] = categoriesResult[i][0];
        })

        menuData.meals = meals;

        res.status(200).json({ message: 'success', menu: menuData });

    } catch (err) {
        next(err);
    }

}

const getSingleMenuUser = async (req, res, next) => {

    const { menuId } = req.params;

    try {
        const [menuResult] = await db.query("SELECT id, name, image FROM menu WHERE id=?", [+menuId]);

        // find all the categories of that menu
        const [categoryResult] = await db.query("SELECT id, categoryName FROM menu_category WHERE menuId=?", [+menuId]);

        // populate each category with meals
        const results = await Promise.all(categoryResult.map(cat => db.query("SELECT * FROM menu_category_meal WHERE menuId=? AND categoryId=?", [+menuId, +cat.id])));

        let menu = {
            ...menuResult[0],
            categories: categoryResult.map((cat, i) => ({
                id: cat.id,
                categoryName: cat.categoryName,
                meals: results[i][0]
            }))
        }

        res.status(200).json({ message: 'success', menu });

    } catch (err) {
        next(err);
    }
}


// UPDATE SINGLE MEAL INFO
const updateSingleMeal = async (req, res, next) => {
    const { menuId, categoryId, mealName, type } = req.body;

    let message = "";
    let status;
    // delete a meal from a menu
    if (type === 'delete') {
        if (!menuId || !categoryId || !mealName || !type) return res.status(400).json({ message: 'Invalid Input Data' });
        await db.query("DELETE FROM menu_category_meal WHERE menuId=? AND categoryId=? AND mealName=?", [+menuId, +categoryId, mealName])
        message = "Meal deleted successfully";
        status = 200;
    }

    // create new meal for the menu, under a category
    if (type === 'create') {
        if (!menuId || !categoryId || !mealName || !price || !type) return res.status(400).json({ message: 'Invalid Input Data' });
        await db.query("INSERT INTO menu_category_meal(menuId, categoryId, mealName, price) VALUES(?, ?, ?, ?)", [+menuId, +categoryId, mealName, +price]);
        message = "New meal added successfully";
        status = 201;
    }

    res.status(status).json({ message });
}


// create a new food order

const createNewOrder = async (req, res, next) => {
    const { totalPrice, totalItems, orderItems } = req.body;
    const customerId = req.user.id;

    try {
        const [result] = await db.query("INSERT INTO food_order (customerId, totalPrice, totalItems) VALUES(?,?,?)", [+customerId, +totalPrice, +totalItems]);

        const orderId = result.insertId;

        // add order items to food_order_item table
        for (let i = 0; i < orderItems.length; i++) {
            await db.query("INSERT INTO food_order_item (orderId, menuId, categoryId, mealName, price, totalPrice, quantity) VALUES (?,?,?,?,?,?,?)", [orderId, orderItems[i].menuId, orderItems[i].categoryId, orderItems[i].mealName, orderItems[i].price, orderItems[i].totalPrice, orderItems[i].quantity]);
        }

        res.status(201).json({ message: 'Order created successfully' });

    } catch (err) {
        next(err);
    }
}

const getAllOrdersOfACustomer = async (req, res, next) => {
    const customerId = req.params.customerId;

    try {
        const [result] = await db.query("SELECT * FROM food_order WHERE customerId=?", [customerId]);



        res.status(200).json({ message: 'Success', orders: result });

    } catch (err) {
        next(err);
    }
}

const getAllFoodOrders = async (req, res, next) => {

    try {
        const [result] = await db.query("SELECT * FROM food_order");

        res.status(200).json({ message: 'Success', orders: result });
    } catch (err) {
        next(err);
    }
}

const getSingleOrderDetails = async (req, res, next) => {
    const orderId = req.params.id;

    try {
        const [result] = await db.query("SELECT * FROM food_order WHERE id=?", [+orderId]);

        const [orderItems] = await db.query("SELECT * FROM food_order_item WHERE orderId=?", [+orderId]);

        const order = {
            ...result[0],
            orderItems,
        }

        if (req.user.role !== 'Customer') {
            // populate customer details
            const [customerDetails] = await db.query("SELECT * FROM customer WHERE id=?", [+result[0].customerId]);
            order.customerDetails = {
                id: customerDetails[0].id,
                username: customerDetails[0].username,
                email: customerDetails[0].email,
                phone: customerDetails[0].phone,
                name: `${customerDetails[0].firstName} ${customerDetails[0].lastName}`,
                avatar: customerDetails[0].avatar
            }
        }

        res.status(200).json({ message: 'Success', order });


    } catch (err) {
        next(err);
    }
}

const getPopularCategories = async (req, res, next) => {

    try {
        // SELECT menuId, categoryId, (SELECT name FROM menu WHERE id=menuId) AS menu, (SELECT categoryName FROM menu_category WHERE menuId=menuId AND id=categoryId) AS category, COUNT(*) AS total_times_ordered FROM food_order_item GROUP BY menuId, categoryId ORDER BY total_times_ordered DESC LIMIT 5;
        const [result] = await db.query("SELECT menuId, categoryId, (SELECT name FROM menu WHERE id=menuId) AS menu, (SELECT categoryName FROM menu_category WHERE menuId=menuId AND id=categoryId) AS category, COUNT(*) AS total_times_ordered FROM food_order_item GROUP BY menuId, categoryId ORDER BY total_times_ordered DESC LIMIT 5");

        res.status(200).json({ message: 'success', data: result });

    } catch (err) {
        console.log(err);
        next(err);
    }
}

const deleteCorder = async (req, res, next) => {
    const id = req.params.id;

    try {
        const [result] = await db.query("SELECT * FROM food_order WHERE id = ?", [id]);

        if (result.length === 0) return res.status(404).json({ message: 'Order not found' });

        // delete customer
        await db.query("DELETE FROM food_order WHERE id = ?", [id]);

        res.status(200).json({ message: 'order Removed' });
    } catch (err) {
        next(err);
        console.log(next(err))
    }
}

const getAvailableFoodCount = async (req, res, next) => {
    const { foodId, reservedDate } = req.query;

    if (!foodId || !reservedDate) {
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
        const [totalFoodOrders] = await db.query("SELECT IFNULL((SELECT sum(quantity) FROM place_booking WHERE foodId = ? AND reserveDate = ? GROUP BY foodId,reserveDate),0) AS totalQuantity ", [foodId, formattedReservedDate])
        const [totalStandardFoodOrders] = await db.query("SELECT maxCountPerDay FROM menu_category_meal WHERE id = ?;", [foodId]);

        const availableFoodCount = totalStandardFoodOrders[0].maxCountPerDay - totalFoodOrders[0].totalQuantity
        if (availableFoodCount < 0) {
            availableFoodCount = 0;
        }

        res.status(200).json({ message: 'Success', count: availableFoodCount });

    } catch (err) {
        next(err);
    }

}

const getAllCategory = async (req, res, next) => {
    const { id } = req.query;;
    try {
        const [result] = await db.query("SELECT categoryName AS name FROM menu_category WHERE menuId = ?", [id]);
        res.status(200).json({ message: 'Success', details: result });

    } catch (err) {
        next(err);
    }
}

const getFoodDetails = async (req, res, next) => {
    const {id} = req.query;;

    try {
        const [result] = await db.query("SELECT price, maxCountPerDay AS quantity FROM menu_category_meal WHERE id = ?", [id])
        res.status(200).json({ message: 'success', details : result });
    } catch (err) {
        next(err);

    }
}

const updateFoodDetails = async (req, res, next) => {
    const {id, quantity, price} = req.query;

    if(!id || !quantity || !price){
        res.status(400).json({message:'Invalid Inputs'})
    }

    try {
        await db.query("UPDATE menu_category_meal; SET price = ?, maxCountPerDay = ? WHERE id = ? ", [price,quantity,id]);
        res.status(200).json({ message: 'updated' });
    } catch (err) {
        next(err);
    }
}

const deleteFoodDetails = async (req, res, next) => {
    const {id} = req.query;

    try {
        await db.query("DELETE FROM menu_category_meal WHERE id = ?", [id]);
        res.status(200).json({ message: 'Removed' });
    } catch (err) {
        next(err);
    }
}



module.exports = {
    createNewMenu,
    getAllMenus,
    deleteMenu,
    getSingleMenu,
    getSingleMenuUser,

    updateSingleMeal, // add new meal to a menu or remove a meal from a menu
    createNewOrder,
    getAllOrdersOfACustomer,
    getAllFoodOrders,
    getSingleOrderDetails,

    getPopularCategories,
    deleteCorder,
    getSelectedMenus,

    getAvailableFoodCount,
    getAllCategory,
    deleteFoodDetails,
    updateFoodDetails,
    getFoodDetails
}