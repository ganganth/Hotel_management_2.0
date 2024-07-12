import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import CustomerCartCard from './CustomerCartCard';
import { removeRoomItemFromCart, removeFoodItemFromCart, removeEventItemFromCart, removeVehicleItemFromCart } from '../../app/ordersCart/orderCartSlice';
import { toast } from 'react-toastify';
import Payment from './Payment';
import Reviews from './Reviews';
import Ebill from './Ebill';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';


const CustomerCart = () => {

    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [roomsOrder, setRoomsOrder] = useState([]);
    const [foodsOrder, setFoodsOrder] = useState([]);
    const [eventsOrder, setEventsOrder] = useState([]);
    const [vehiclesOrder, setVehiclesOrder] = useState([]);
    const { items } = useSelector(state => state.orderCart)

    const [roomT, setRoomT] = useState(0);
    const [foodT, setFoodT] = useState(0);
    const [eventT, setEventT] = useState(0);
    const [vehicleT, setVehicleT] = useState(0);
    const [total, setTotal] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [taxRate, setTaxRate] = useState();
    const [discountRate, setDiscountRate] = useState();

    const [paymentPopup, setPaymentPopup] = useState(false);
    const [ratePopup, setRatePopup] = useState(false);
    const [billData, SetBillData] = useState([]);
    const [billPrint, setBillPrint] = useState(false)
    const [bookingType, setBookingType] = useState('');

    useEffect(() => {
        const getTaxRates = async () => {
            try {
                const response = await axiosPrivate.get('/api/order/tax');
                setTaxRate(response.data.tax);
                setDiscountRate(response.data.discount);
            } catch (err) {
                console.log(err);
            }
        }
        getTaxRates();
    },[axiosPrivate]);

    useEffect(() => {

        // console.log("d",discountRate)
        // console.log("t",taxRate)
        const roomsOrder = items.filter(i => i.reservationType === 'rooms');
        const foodsOrder = items.filter(i => i.reservationType === 'foods');
        const eventsOrder = items.filter(i => i.reservationType === 'events');
        const vehiclesOrder = items.filter(i => i.reservationType === 'vehicle');

        const TotalRoomPrice = roomsOrder.map(item => item.Total_price).reduce((acc, price) => acc + price, 0);
        const TotalFoodPrice = foodsOrder.map(item => item.Total_price).reduce((acc, price) => acc + price, 0);
        const TotalEventPrice = eventsOrder.map(item => item.Total_price).reduce((acc, price) => acc + price, 0);
        const TotalVehiclePrice = vehiclesOrder.map(item => item.Total_price).reduce((acc, price) => acc + price, 0);

        const Discount = (TotalRoomPrice + TotalFoodPrice + TotalEventPrice + TotalVehiclePrice) * discountRate;
        const GovernmentTax = (TotalRoomPrice + TotalFoodPrice + TotalEventPrice + TotalVehiclePrice) * taxRate;
        const Total = (TotalRoomPrice + TotalFoodPrice + TotalEventPrice + TotalVehiclePrice + GovernmentTax) - Discount
        const totalAmount = (TotalRoomPrice + TotalFoodPrice + TotalEventPrice + TotalVehiclePrice)

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
        setTotalAmount(totalAmount)

        if(vehiclesOrder.length > 0 && eventsOrder.length > 0 && foodsOrder.length > 0 && roomsOrder.length > 0){
            setBookingType('A');
        }else if (vehiclesOrder.length === 0 && eventsOrder.length === 0 && foodsOrder.length === 0 && roomsOrder.length > 0){
            setBookingType('R');
        }else if (vehiclesOrder.length === 0 && eventsOrder.length === 0 && foodsOrder.length > 0 && roomsOrder.length > 0){
            setBookingType('RF')
        }else if (vehiclesOrder.length === 0 && eventsOrder.length > 0 && foodsOrder.length === 0 && roomsOrder.length > 0){
            setBookingType('RE')
        }else if (vehiclesOrder.length > 0 && eventsOrder.length === 0 && foodsOrder.length === 0 && roomsOrder.length > 0){
            setBookingType('RV')
        }else if (vehiclesOrder.length === 0 && eventsOrder.length > 0 && foodsOrder.length > 0 && roomsOrder.length > 0){
            setBookingType('REF')
        }else if (vehiclesOrder.length > 0 && eventsOrder.length === 0 && foodsOrder.length > 0 && roomsOrder.length > 0){
            setBookingType('RFV')
        }else if (vehiclesOrder.length > 0 && eventsOrder.length > 0 && foodsOrder.length === 0 && roomsOrder.length > 0){
            setBookingType('RVE')
        }

    }, [items,taxRate,discountRate]);

    const handleDelete = (d) => {

        if (d.reservationType === 'rooms') {
            dispatch(removeRoomItemFromCart(d));
        }
        if (d.reservationType === 'foods') {
            dispatch(removeFoodItemFromCart(d));
        }
        if (d.reservationType === 'events') {
            dispatch(removeEventItemFromCart(d));
        }
        if (d.reservationType === 'vehicle') {
            dispatch(removeVehicleItemFromCart(d));
        }
        toast.success(`${d.name} removed from cart`);
    }

    return (
        <div style={(paymentPopup || ratePopup) ? { backgroundColor: "rgba(0, 0, 0, 0.7)", height: "900px" } : {}}>
            {paymentPopup ? (
                <Payment
                    setPaymentPopup={setPaymentPopup}
                    setRatePopup={setRatePopup}
                    roomT={roomT}
                    foodT={foodT}
                    vehicleT={vehicleT}
                    eventT={eventT}
                    roomsOrder={roomsOrder}
                    foodsOrder={foodsOrder}
                    eventsOrder={eventsOrder}
                    vehiclesOrder={vehiclesOrder}
                    total={total}
                    discount={discount}
                    tax={tax}
                    SetBillData={SetBillData}
                    setBillPrint={setBillPrint}
                    bookingType = {bookingType}
                />
            ) : billPrint ? (
                <Ebill
                    billData={billData}
                    billPrint={billPrint}
                    setBillPrint={setBillPrint}
                />
            ) : ratePopup ? (
                <Reviews
                    setRatePopup={setRatePopup}
                />
            ) : (
                <div className="container-fluid">
                    <p className="fs-4 fw-500" style={{ marginLeft: "20%" }}>Reservation cart</p>
                    <button className='btn btn-primary' style={{ marginLeft: "20%" }} onClick={() => navigate(-1)}>Go Back</button>
                    <hr></hr>
                    <div className='d-flex position-fixed' style={{ width: "100%" }}>
                        <div className='col-9' style={{ maxHeight: "600px", overflowY: "scroll" }}>

                            {items.length === 0 && <p className='text-center my-3 fs-1 fw-lighter'>No orders in the cart</p>}

                            {items.length > 0 && (
                                <>
                                    {roomsOrder.length > 0 && (
                                        <CustomerCartCard
                                            title={"Room Reservations"}
                                            data={roomsOrder}
                                            handleDelete={handleDelete}
                                        />
                                    )}

                                    {foodsOrder.length > 0 && (
                                        <CustomerCartCard
                                            title={"Foods Reservations"}
                                            data={foodsOrder}
                                            handleDelete={handleDelete}
                                        />
                                    )}

                                    {eventsOrder.length > 0 && (
                                        <CustomerCartCard
                                            title={"Event Reservations"}
                                            data={eventsOrder}
                                            handleDelete={handleDelete}
                                        />
                                    )}

                                    {vehiclesOrder.length > 0 && (
                                        <CustomerCartCard
                                            title={"Vehicle Reservations"}
                                            data={vehiclesOrder}
                                            handleDelete={handleDelete}
                                        />
                                    )}
                                </>
                            )}

                        </div>
                        <div className='col-3 '>
                            <div className="card" style={{ width: "90%", marginLeft: "5%", height: "500px" }}>
                                <div className="card-body" >
                                    <h5 className="card-title text-reset">Total Cost</h5>
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <td>Total for rooms</td>
                                                <td>$ {roomT.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>Total for foods</td>
                                                <td>$ {foodT.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>Total for vehicle</td>
                                                <td>$ {vehicleT.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>Total for other events</td>
                                                <td>$ {eventT.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>Sub Total</td>
                                                <td>$ {totalAmount.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>Government  Tax</td>
                                                <td>$ {tax.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>Discount</td>
                                                <td>$ {discount.toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td>$ {total.toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <button type="button" className="btn btn-primary" onClick={() => setPaymentPopup(true)}>Pay Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CustomerCart;