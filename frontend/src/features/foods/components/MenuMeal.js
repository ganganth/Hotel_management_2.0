import {useState} from 'react';
import {toast} from 'react-toastify';
import {MdOutlineAddCircleOutline} from 'react-icons/md';
import { addItemToCart } from '../../../app/ordersCart/orderCartSlice';
import { useDispatch,useSelector } from 'react-redux';

const MenuMeal = (props) => {

    const dispatch = useDispatch();
    const [qty, setQty] = useState(1);
    const { items } = useSelector(state => state.orderCart)
    
    const decreaseQty = () => {
        if(qty === 1) return;
        setQty(prev => prev-1);
    }

    const increaseQty = (name) => {
      
        if(qty > 9){
            toast.warning(`Your are added maximum number of ${name} in the cart`)
        }
        else{
            setQty(prev => prev+1);
        }
    }

    const handleFoodBooking = (m) =>{

        const isFound = items.find(i => 
            i.reservationType === 'foods' 
            && i.menuId === props.menu.id 
            && i.categoryId === props.categoryId 
            && i.name.toLowerCase() === props.meal.mealName.toLowerCase() 
            && new Date(i.reservedDate).getTime() === new Date(props.reservedDate).getTime() 
            && i.mealId === props.meal.id
            && (i.quantity +qty) >= props.meal.maxCountPerDay
        );
        
        if(isFound){
            toast.warning(`Your are added maximum number of ${props.meal.mealName} in the cart`)
        }
        else{
            const f = {
                mealId: m.id,
                menuId:props.menu.id,
                image: props.menuImage,
                categoryId:props.categoryId,
                quantity: qty,
                name: m.mealName,
                price: m.price,
                reservationType: 'foods',
                reservedDate: props.reservedDate,
                Total_price: qty * m.price,
                description: `This is ${props.menuName} with ${m.mealName} Added for the ${props.reservedDate}.`
            }
    
            dispatch(addItemToCart(f));
            toast.success(`${m.mealName} added to the cart`);

        }
        
    }
    return (
        <>
            <div className="w-100 d-flex align-items-center justify-content-between gap-3">
                <span style={{flex: 1, fontSize: '14px'}}>{props.meal.mealName}</span>
                <span style={{flex: 1, fontSize: '14px'}}>${props.meal.price}</span>
                <div style={{flex: 1, fontSize: '14px'}} className="d-flex align-items-center" >
                    <button style={{padding: '5px 10px', border: '1px solid #333'}} onClick={() => decreaseQty()} disabled={qty===1} >-</button>
                    <span style={{padding: '5px 10px', borderTop: '1px solid #333', borderBottom: '1px solid #333'}}>{qty}</span>
                    <button style={{padding: '5px 10px', border: '1px solid #333'}} onClick={() => increaseQty(props.meal.mealName)}>+</button>
                </div>
                <button 
                    className="btn btn-primary btn-sm" 
                    style={{flex: 1, fontSize: '14px'}}
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