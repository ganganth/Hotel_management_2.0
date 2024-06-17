import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import CustomerCartCard from './CustomerCartCard';
import { removeRoomItemFromCart,removeFoodItemFromCart,removeEventItemFromCart,removeVehicleItemFromCart } from '../../app/ordersCart/orderCartSlice';
import { toast } from 'react-toastify';

const CustomerCart = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [roomsOrder,setRoomsOrder] = useState([]);
    const [foodsOrder,setFoodsOrder] = useState([]);
    const [eventsOrder,setEventsOrder] = useState([]);
    const [vehiclesOrder,setVehiclesOrder] = useState([]);
    const { items } = useSelector(state => state.orderCart)

    const [roomT,setRoomT] = useState(0);
    const [foodT,setFoodT] = useState(0);
    const [eventT,setEventT] = useState(0);
    const [vehicleT,setVehicleT] = useState(0);
    const [total,setTotal] = useState(0);
    const [discount,setDiscount] = useState(0);
    const [tax,setTax] = useState(0);

    useEffect ( () =>{
        const roomsOrder = items.filter(i => i.reservationType === 'rooms');
        const foodsOrder = items.filter(i => i.reservationType  === 'foods');
        const eventsOrder = items.filter(i => i.reservationType === 'events');
        const vehiclesOrder = items.filter(i => i.reservationType  === 'vehicle');

        const TotalRoomPrice = roomsOrder.map(item => item.Total_price).reduce((acc, price) => acc + price, 0);
        const TotalFoodPrice = foodsOrder.map(item => item.Total_price).reduce((acc, price) => acc + price, 0);
        const TotalEventPrice = eventsOrder.map(item => item.Total_price).reduce((acc, price) => acc + price, 0);
        const TotalVehiclePrice = vehiclesOrder.map(item => item.Total_price).reduce((acc, price) => acc + price, 0);

        const Discount = (TotalRoomPrice + TotalFoodPrice + TotalEventPrice + TotalVehiclePrice ) * 0.1;
        const GovernmentTax = (TotalRoomPrice + TotalFoodPrice + TotalEventPrice + TotalVehiclePrice ) * 0.05;
        const Total = (TotalRoomPrice + TotalFoodPrice + TotalEventPrice + TotalVehiclePrice ) - (Discount + GovernmentTax)

        setRoomsOrder(roomsOrder);
        setFoodsOrder(foodsOrder);
        setEventsOrder(eventsOrder);
        setVehiclesOrder(vehiclesOrder);

        setRoomT(TotalRoomPrice);
        setFoodT(TotalFoodPrice)
        setEventT(TotalEventPrice)
        setVehicleT(TotalVehiclePrice)
        setTotal(Total)
        setDiscount(Discount)
        setTax(GovernmentTax)

    },[items]);

    const handleDelete = (d) => {
        
        if(d.reservationType === 'rooms'){
            dispatch(removeRoomItemFromCart(d));
        }
        if(d.reservationType === 'foods'){
            dispatch(removeFoodItemFromCart(d));
        }
        if(d.reservationType === 'events'){
            dispatch(removeEventItemFromCart(d));
        }
        if(d.reservationType === 'vehicle'){
            dispatch(removeVehicleItemFromCart(d));
        }
        toast.success(`${d.name} removed from cart`);
    }

    return (
        <div className="container-fluid">
            <p className="fs-4 fw-500" style={{ marginLeft: "20%" }}>Reservation cart</p>
            <button className='btn btn-primary' style={{ marginLeft: "20%" }} onClick={() => navigate(-1)}>Go Back</button>
            <hr></hr>
            <div className='d-flex position-fixed' style={{ width: "100%" }}>
                <div className='col-9' style={{ maxHeight: "600px", overflowY: "scroll" }}>

                    {items.length === 0 && <p className='text-center my-3 fs-1 fw-lighter'>No orders in the cart</p>}

                    {items.length > 0 && (
                        <>
                            { roomsOrder.length > 0 && (
                                <CustomerCartCard 
                                    title = {"Room Reservations"} 
                                    data = {roomsOrder} 
                                    handleDelete={handleDelete}
                                />
                            )}

                            { foodsOrder.length > 0 && (
                                <CustomerCartCard 
                                    title = {"Foods Reservations"} 
                                    data = {foodsOrder} 
                                    handleDelete = {handleDelete}
                                />
                            )}

                            { eventsOrder.length > 0 && (
                                <CustomerCartCard 
                                    title = {"Event Reservations"} 
                                    data = {eventsOrder} 
                                    handleDelete = {handleDelete}
                                />
                            )}

                            { vehiclesOrder.length > 0 && (
                                <CustomerCartCard 
                                    title = {"Vehicle Reservations"} 
                                    data = {vehiclesOrder} 
                                    handleDelete = {handleDelete}
                                />
                            )}
                        </>
                    )}

                </div>
                <div className='col-3 '>
                    <div class="card" style={{ width: "90%", marginLeft: "5%", height: "500px" }}>
                        <div className="card-body" >
                            <h5 className="card-title text-reset">Total Cost</h5>
                            <table className="table">
                                <tbody>
                                    <tr>
                                        <td>Total for rooms</td>
                                        <td>$ {roomT}</td>
                                    </tr>
                                    <tr>
                                        <td>Total for foods</td>
                                        <td>$ {foodT}</td>
                                    </tr>
                                    <tr>
                                        <td>Total for vehicle</td>
                                        <td>$ {vehicleT}</td>
                                    </tr>
                                    <tr>
                                        <td>Total for other events</td>
                                        <td>$ {eventT}</td>
                                    </tr>
                                    <tr>
                                        <td>Government  Tax</td>
                                        <td>$ {tax}</td>
                                    </tr>
                                    <tr>
                                        <td>Discount</td>
                                        <td>$ {discount}</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>$ {total}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <button type="button" class="btn btn-primary">Pay Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerCart;