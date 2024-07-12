import { useState, useEffect, useRef } from "react";
import { Alert, Table, Badge } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import moment from "moment";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useReactToPrint } from "react-to-print";
import { FaPrint } from "react-icons/fa";
import Datetime from 'react-datetime';


const OrderManagement = () => {

    const [allBooking, setAllBooking] = useState([]);
    const [orderType, setOrderType] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [title, setTitle] = useState('All Booking Details')
    const [orderTypeTitle, setOrderTypeTitle] = useState(`${moment(currentDate).format('YYYY-MM-DD')} Reserve Room Details`)
    const [allBookingType, setAllBookingType] = useState([]);
    const [orderRange, setOrderRange] = useState(0);
    const [reservationType, setReservationType] = useState(1);
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const getAllBookings = async () => {
            try {
                const response = await axiosPrivate.get('/api/order/');
                setAllBooking(response.data.booking);
            } catch (err) {
                console.log(err);
            }
        }
        getAllBookings();
    }, [axiosPrivate, orderType]);

    const contentToPrint = useRef(null);
    const contentToPrint1 = useRef(null);

    const handlePrint = useReactToPrint({
        documentTitle: "order details",
        onBeforePrint: () => console.log("before printing..."),
        onAfterPrint: () => console.log("after printing..."),
        removeAfterPrint: true,
    });

    const handleAllOrder = async () => {
        try {
            const response = await axiosPrivate.get(`/api/order/filterData/?dateRange=${orderRange}`);
            setAllBooking(response.data.booking);
            setTitle(response.data.title);
        } catch (err) {
            console.log(err);
        }
    }

    const handleAllOrderType = async () => {
        try {
            setAllBookingType([]);
            const response = await axiosPrivate.get(`/api/order/filterDataType/?date=${currentDate}&reservationType=${reservationType}`);
            setAllBookingType(response.data.booking);
            setOrderTypeTitle(response.data.title);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div style={{ width: "95%", marginInlineStart: "2.5%" }}>
            <div className="d-flex gap-2">
                <button className="btn btn-outline-primary col-6" style={!orderType ? { backgroundColor: "#0d6efd", color: "white" } : {}} type="button" onClick={() => { setOrderType(false); handleAllOrderType(); }}>All order Details</button>
                <button className="btn btn-outline-primary col-6" style={orderType ? { backgroundColor: "#0d6efd", color: "white" } : {}} type="button" onClick={() => { setOrderType(true); setTitle('All Booking Details'); setAllBookingType([]); }}>Order Type Details</button>
            </div>
            {orderType ? (
                <>
                    <div className='mt-3 d-flex gap-2'>
                        <Datetime
                            inputProps={{ id: 'pickup-date-picker' }}
                            value={currentDate}
                            onChange={(date) => setCurrentDate(date)}
                            timeFormat="HH A"
                            className="col-2.5 gap-2"
                            style={{ width: "auto" }}
                        />

                        <select className="form-select col-6" aria-label="Default select example" style={{ width: "auto" }} onChange={e => setReservationType(e.target.value)}>
                            <option value="1">Rooms</option>
                            <option value="2">event</option>
                            <option value="3">foods</option>
                            <option value="4">vehicle</option>
                        </select>

                        <button className="btn btn-primary" onClick={() => handleAllOrderType()}>Search</button>
                        <button className="col-1" style={{ background: 'none', border: 'none', padding: 0, width: 0, marginLeft: "1%" }} onClick={() => { handlePrint(null, () => contentToPrint1.current); }}><FaPrint /></button>

                    </div>
                    <div ref={contentToPrint1}>
                        <p className='text-center fs-3 fw-bold text-muted'>{orderTypeTitle}</p>
                        <hr></hr>
                        {allBookingType && allBookingType.length > 0 ? (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        {allBookingType[0].bookingType === 'food' && (
                                            <>
                                                <th>Meal name</th>
                                                <th>Meal type</th>
                                            </>
                                        )}
                                        {allBookingType[0].bookingType !== 'food' && (
                                            <th>Name</th>
                                        )}
                                        {(allBookingType[0].bookingType === 'room' || allBookingType[0].bookingType === 'vehicle') && (
                                            <>
                                                <th>Check In Date</th>
                                                <th>Check Out Date</th>
                                            </>
                                        )}
                                        {(allBookingType[0].bookingType === 'food' || allBookingType[0].bookingType === 'event') && (
                                            <th>Reserve Date</th>
                                        )}
                                        {allBookingType[0].bookingType === 'event' && (
                                            <th>Total People</th>
                                        )}
                                        {allBookingType[0].bookingType !== 'event'  && (
                                            <th>Quantity</th>
                                        )}
                                         {allBookingType[0].bookingType === 'vehicle' && (
                                            <>
                                                <th>PickUp Location</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {allBookingType.map(booking => (
                                        <tr key={booking.id}>
                                            <td>{booking.id}</td>
                                            {booking.bookingType === 'food'  && (
                                                <>
                                                    <td>{booking.mealName}</td>
                                                    <td>{booking.name}</td>
                                                </>
                                            )}
                                            {booking.bookingType !== 'food'  && (
                                                <td>{booking.name}</td>
                                            )}
                                            {(booking.bookingType === 'room' || booking.bookingType === 'vehicle') && (
                                                <>
                                                    <td>{moment(booking.checkInDate).utc().format('YYYY-MM-DD')}</td>
                                                    <td>{moment(booking.checkOutDate).utc().format('YYYY-MM-DD')}</td>
                                                </>
                                            )}
                                            {(booking.bookingType === 'event' || booking.bookingType === 'food') && (
                                                <td>{moment(booking.reserveDate).utc().format('YYYY-MM-DD')}</td>
                                            )}
                                            <td>{booking.booking_quantity}</td>
                                            {booking.bookingType === 'vehicle' && (
                                                <td>{booking.pickUpLocation}</td> 
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <Alert variant='info'>No bookings yet</Alert>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className='mt-3 d-flex gap-2'>
                        <select className="form-select col-5 " aria-label="Default select example" style={{ width: "auto" }} onChange={e => setOrderRange(e.target.value)}>
                            <option value="3">All</option>
                            <option value="0">Today</option>
                            <option value="1">Last 7 days.</option>
                            <option value="2">Last 30 days</option>
                        </select>

                        <button className="btn btn-primary" onClick={() => handleAllOrder()}>Search</button>
                        <button className="col-1" style={{ background: 'none', border: 'none', padding: 0, width: 0, marginLeft: "1%" }} onClick={() => { handlePrint(null, () => contentToPrint.current); }}><FaPrint /></button>

                    </div>
                    <div ref={contentToPrint}>
                        <p className='text-center fs-3 fw-bold'>{title}</p>
                        <hr></hr>
                        {allBooking && allBooking.length > 0 ? (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Booking ID</th>
                                        <th>Check In Date</th>
                                        <th>Check Out Date</th>
                                        <th>Booked Date</th>
                                        <th>Payment Status</th>
                                        <th>Total Price</th>
                                        <th>Payment Type</th>
                                        <th>Remaining Balance</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allBooking.map(booking => (
                                        <tr key={booking.id}>
                                            <td>{booking.id}</td>
                                            <td>{moment(booking.checkInDate).utc().format('YYYY-MM-DD')}</td>
                                            <td>{moment(booking.checkOutDate).utc().format('YYYY-MM-DD')}</td>
                                            <td>{moment(booking.createdAt).utc().format('YYYY-MM-DD')}</td>
                                            <td>
                                                <div className='d-flex align-items-center justify-content-center'>{booking.isPaid === 'yes' ? (<Badge bg='success'>paid</Badge>) : (<Badge bg='warning'>not completed</Badge>)}</div>
                                            </td>
                                            <td>{booking.totalPrice}</td>
                                            <td>
                                                <div className='d-flex align-items-center justify-content-center'><Badge bg='dark'>{booking.paymentType === 'full' ? 'Full' : 'Half'}</Badge></div>
                                            </td>
                                            <td>{booking.isPaid === 'yes' ? 'No remaining balance' : `$${booking.remainBalance.toFixed(2)}`}</td>
                                            <td>
                                                <div className='d-flex align-items-center justify-content-center'>
                                                    <button className='btn btn-primary btn-sm' onClick={() => navigate(`bookings_details/${booking.id}`)} >view more</button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <Alert variant='info'>No bookings yet</Alert>
                        )}
                    </div>
                </>
            )}


        </div>
    );
}

export default OrderManagement;