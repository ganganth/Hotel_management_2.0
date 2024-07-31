import { useState } from 'react';
import { toast } from 'react-toastify';
import { MdOutlineAddCircleOutline } from 'react-icons/md';
import { addItemToCart } from '../../../app/ordersCart/orderCartSlice';
import { useDispatch, useSelector } from 'react-redux';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import moment from 'moment';

const MenuMeal = (props) => {

    const dispatch = useDispatch();
    const [qty, setQty] = useState(1);
    const { items } = useSelector(state => state.orderCart)
    const axiosPrivate = useAxiosPrivate();

    const decreaseQty = () => {
        if (qty === 1) return;
        setQty(prev => prev - 1);
    }

    const increaseQty = (name) => {

        if (qty > props.meal.maxCountPerDay) {
            toast.warning(`Your are added maximum number of ${name} in the cart`)
        }
        else {
            setQty(prev => prev + 1);
        }
    }

    const getAvailableFoodCount = async (meal) => {
        try {
            const response = await axiosPrivate.get(`/api/foods/booking/foodItemOrder/?foodId=${meal.id}&reservedDate=${props.reservedDate}`);

            if (response && response.data) {
                return response.data.count;
            } else {
                console.error('API response is missing data.');
                return null;
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            return null;
        }
    }

    const handleFoodBooking = async (m) => {
        const availableCount = await getAvailableFoodCount(m);
        if (availableCount === null) {
            toast.error('Failed to fetch available food count');
            return;
        }
     
        const isFound = items.find(i =>
            i.reservationType === 'foods'
            && i.menuId === props.menu.id
            && i.categoryId === props.categoryId
            && i.name.toLowerCase() === props.meal.mealName.toLowerCase()
            && new Date(i.reservedDate).getTime() === new Date(props.reservedDate).getTime()
            && i.mealId === props.meal.id
            && (i.quantity + qty) > availableCount
        );

        if (isFound) {
            toast.warning(`Maximum number of ${props.meal.mealName} Orders reserved In ${moment(props.reservedDate).utc().format('YYYY-MM-DD')}`)
        }
        else {
            const f = {
                mealId: m.id,
                menuId: props.menu.id,
                image: props.menuImage,
                categoryId: props.categoryId,
                quantity: qty,
                name: m.mealName,
                price: m.price,
                reservationType: 'foods',
                reservedDate: props.reservedDate,
                Total_price: qty * m.price,
                description: `This is ${props.menuName} with ${m.mealName} Added for the ${moment(props.reservedDate).utc().format('YYYY-MM-DD')}.`
            }
            props.setCreateFoodOrder(true);
            dispatch(addItemToCart(f));
            toast.success(`${m.mealName} added to the cart`);
        }
    }


    return (
        <>
            <div className="w-100 d-flex align-items-center justify-content-between gap-3">
                <span style={{ flex: 1, fontSize: '14px' }}>{props.meal.mealName}</span>
                <span style={{ flex: 1, fontSize: '14px' }}>${props.meal.price}</span>
                <div style={{ flex: 1, fontSize: '14px' }} className="d-flex align-items-center" >
                    <button style={{ padding: '5px 10px', border: '1px solid #333' }} onClick={() => decreaseQty()} disabled={qty === 1} >-</button>
                    <span style={{ padding: '5px 10px', borderTop: '1px solid #333', borderBottom: '1px solid #333' }}>{qty}</span>
                    <button style={{ padding: '5px 10px', border: '1px solid #333' }} onClick={() => increaseQty(props.meal.mealName)}>+</button>
                </div>
                <button
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1, fontSize: '14px' }}
                    onClick={() => handleFoodBooking(props.meal)}
                >
                    <MdOutlineAddCircleOutline size={20} />
                </button>
            </div>
            <hr></hr>
        </>
    );
}

export default MenuMeal;