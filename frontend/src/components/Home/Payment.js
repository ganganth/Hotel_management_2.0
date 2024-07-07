import { Row, Col, ListGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from 'react-toastify';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../../app/ordersCart/orderCartSlice';

const Payment = (props) => {

    const [paymentType, setPaymentType] = useState('full');
    const axiosPrivate = useAxiosPrivate();
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch();
    const [filteredRoomsOrder, setFilteredRoomsOrder] = useState([]);
    const [filteredFoodsOrder, setFilteredFoodsOrder] = useState([]);
    const [filteredEventsOrder, setFilteredEventsOrder] = useState([]);
    const [filteredVehiclesOrder, setFilteredVehiclesOrder] = useState([]);
    

    useEffect(() => {
        if (props.roomsOrder.length > 0) {
            const filteredArray = props.roomsOrder.map(item => ({
                id: item.id,
                reservationType: item.reservationType,
                total_quantity: item.quantity,
                total_price: item.Total_price,
                reserveDate: item.reservedDate
            }));
            setFilteredRoomsOrder(filteredArray);
        }
    }, [props.roomsOrder]);

    useEffect(() => {
        if (props.foodsOrder.length > 0) {
            const filteredArray = props.foodsOrder.map(item => ({
                id: item.mealId,
                reservationType: item.reservationType,
                total_quantity: item.quantity,
                total_price: item.Total_price,
                reserveDate: item.reservedDate
            }));
            setFilteredFoodsOrder(filteredArray);
        }
    }, [props.foodsOrder]);

    useEffect(() => {
        if (props.eventsOrder.length > 0) {
            const filteredArray = props.eventsOrder.map(item => ({
                id: item.id,
                reservationType: item.reservationType,
                total_quantity: item.people,
                total_price: item.Total_price,
                reserveDate: item.reservedDate
            }));
            setFilteredEventsOrder(filteredArray);
        }
    }, [props.eventsOrder]);

    useEffect(() => {
        if (props.vehiclesOrder.length > 0) {
            const filteredArray = props.vehiclesOrder.map(item => ({
                id: item.id,
                reservationType: item.reservationType,
                total_quantity: item.quantity,
                total_price: item.Total_price,
                reserveDate: 'NULL'
            }));
            setFilteredVehiclesOrder(filteredArray);
        }
    }, [props.vehiclesOrder]);

    const calculateRemainPrice = () => {
        return (props.total - +(props.total / 2)).toFixed(2);
    }

    const calculateTotalPrice = () => {
        let total;
        let roomDiscount = props.roomsOrder[0].fullPaymentDiscount;

        if (paymentType === 'full') {
            total = (props.eventT + props.vehicleT + props.foodT + (props.roomT * ((100 - roomDiscount) / 100)) + props.tax - props.discount).toFixed(2);
        } else {
            total = (props.total / 2).toFixed(2);
        }
        return total;
    }
 
    const addBooking = async (booking) => {

        try {
            const response = await axiosPrivate.post('/api/rooms/bookings', JSON.stringify(booking));
            toast.success('Booking Successful');
            props.setPaymentPopup(false);
            props.setRatePopup(true); 
            props.setBillPrint(true);
            return response;
        } catch (err) {
            console.log(err);
        }
    }


    const handleBookingSuccess = async () => {
        // paypal payment details

        const booking = {
            checkInDate: props.roomsOrder[0].checkInDate,
            checkOutDate: props.roomsOrder[0].checkOutDate,
            paymentType,
            totalNightsStay: props.roomsOrder[0].totalNightsStay,
            paidTotalPrice: paymentType === 'full' ? calculateTotalPrice() : (props.total / 2), // paid total price
            bookingTotalPrice: paymentType === 'full' ? calculateTotalPrice() : props.total,
            isPaid: paymentType === 'full' ? "yes" : "no",
            remainingBalance: paymentType === 'half' ? calculateTotalPrice() : 0.00,
            customerId: user.id,
            rooms: filteredRoomsOrder,
            events: filteredEventsOrder,
            vehicle: filteredVehiclesOrder,
            foods: filteredFoodsOrder,
            bookingType:props.bookingType
        };
        props.SetBillData([booking]);
        
        const bookingSuccess = await addBooking(booking);
        
        if (!bookingSuccess) {
            throw new Error('Booking failed');
        }
        else{
            dispatch(clearCart());
        }
    }
    return (


        <div className='position-fixed' style={{ marginLeft: "5%", width: "90%", marginTop: "10%", top: "0", left: "0", backgroundColor: "white" }}>

            <button type="button" className="btn-close float-end mt-2" aria-label="Close" onClick={() => props.setPaymentPopup(false)} ></button>
            <div className='shadow pt-3 pb-5 px-5'>
                <h1 className='text-center display-6 mb-3'>Payment Details</h1>
                <ListGroup>

                    <ListGroup.Item>
                        <Row>
                            <Col>Payment Type</Col>
                            <Col>
                                <div className='d-flex align-items-center gap-3 mb-2'>
                                    <input type='radio' value='full' name='payment-type' checked={paymentType === 'full'} onChange={e => setPaymentType(e.target.value)} />
                                    <span>Full Payment </span>
                                </div>
                                <div className='d-flex align-items-center gap-3'>
                                    <input type='radio' value='half' name='payment-type' checked={paymentType === 'half'} onChange={e => setPaymentType(e.target.value)} />
                                    <span>Half Payment </span>
                                </div>
                            </Col>
                        </Row>
                    </ListGroup.Item>

                    {paymentType === 'half' && (
                        <ListGroup.Item>
                            <Row className='justify-content-center'>
                                <Col md={6}>
                                    <h5 className='text-center fw-bold my-2 text-muted'>Remain Balance : ${calculateRemainPrice()}</h5>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    )}

                    <ListGroup.Item>
                        <Row className='justify-content-center'>
                            <Col md={10}>
                                <h1 className='text-center fs-2 mt-4 mb-2'>Pay Now : ${calculateTotalPrice()} </h1>
                                <small className='text-center d-block mb-2'>(Once the payment is made you cannot cancel booking, and no money refunded)</small>
                            </Col>
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Row className='justify-content-center'>
                            <Col md={6}>
                                <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}>
                                    {paymentType === 'full' && (
                                        <PayPalButtons
                                            style={{ layout: "horizontal" }}
                                            createOrder={(data, actions) => {

                                                return actions.order.create({
                                                    purchase_units: [
                                                        {
                                                            amount: {
                                                                value: calculateTotalPrice(),
                                                            },
                                                        },
                                                    ],
                                                });
                                            }}
                                            onApprove={(data, actions) => {
                                                return actions.order.capture().then((details) => {
                                                    handleBookingSuccess();
                                                });
                                            }}

                                        />
                                    )}

                                    {paymentType === 'half' && (
                                        <PayPalButtons
                                            style={{ layout: "horizontal" }}
                                            createOrder={(data, actions) => {

                                                return actions.order.create({
                                                    purchase_units: [
                                                        {
                                                            amount: {
                                                                value: calculateTotalPrice(),
                                                            },
                                                        },
                                                    ],
                                                });
                                            }}
                                            onApprove={(data, actions) => {
                                                return actions.order.capture().then((details) => {
                                                    handleBookingSuccess();
                                                });
                                            }}

                                        />
                                    )}

                                </PayPalScriptProvider>
                                {/* <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}>
                                    {paymentType === 'full' && (
                                        <PayPalButtons
                                            style={{ layout: "horizontal" }}
                                            createOrder={async (data, actions) => {
                                                try {
                                                    await handleBookingSuccess();
                                                    return actions.order.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    value: calculateTotalPrice(),
                                                                },
                                                            },
                                                        ],
                                                    });
                                                } catch (error) {
                                                    console.error('Booking failed, stopping payment process', error);
                                                    // Optionally, display an error message to the user
                                                    return Promise.reject(error);
                                                }
                                            }}
                                            onApprove={(data, actions) => {
                                                return actions.order.capture().then((details) => {
                                                    // Handle successful payment capture
                                                    console.log('Payment successful', details);
                                                });
                                            }}
                                        />
                                    )}

                                    {paymentType === 'half' && (
                                        <PayPalButtons
                                            style={{ layout: "horizontal" }}
                                            createOrder={async (data, actions) => {
                                                try {
                                                    await handleBookingSuccess();
                                                    return actions.order.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    value: calculateTotalPrice(),
                                                                },
                                                            },
                                                        ],
                                                    });
                                                } catch (error) {
                                                    console.error('Booking failed, stopping payment process', error);
                                                    // Optionally, display an error message to the user
                                                    return Promise.reject(error);
                                                }
                                            }}
                                            onApprove={(data, actions) => {
                                                return actions.order.capture().then((details) => {
                                                    // Handle successful payment capture
                                                    console.log('Payment successful', details);
                                                });
                                            }}
                                        />
                                    )}
                                </PayPalScriptProvider> */}


                            </Col>
                        </Row>

                    </ListGroup.Item>

                </ListGroup>
            </div>
        </div>

    );
}

export default Payment;