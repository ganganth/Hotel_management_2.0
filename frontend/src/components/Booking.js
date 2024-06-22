import CustomerHeader from "./Home/CustomerHeader";
import { useState,useEffect } from "react";
import Datetime from 'react-datetime';
import moment from 'moment';
import { useSelector } from 'react-redux';
import MenuList from "../features/foods/MenuList";
import RoomList from "../features/rooms/RoomList";
import VehicleRental from "../features/vehicles/VehicleRental";
import Events from "../features/events/Events";
// import {toast} from 'react-toastify';

const Booking = () => {

    const [checkInDate, setCheckInDate] = useState(new Date());
    const [checkOutDate, setCheckOutDate] = useState('');
    const [board, setBoard] = useState(true); // set a default value true for full Board
    const [foodOrder, setFoodOrder] = useState(false);
    const [vehicleOrder, setVehicleOrder] = useState(false);
    const [eventOrder, setEventOrder] = useState(false);
    const [roomOrder, setRoomOrder] = useState(false);
    const { items } = useSelector(state => state.orderCart)

    // const allOrderFreeze = useSelector(selectAllOrderFreeze);
    // const otherOrderFreeze = useSelector(selectOtherOrderFreeze);

    const total_days = Math.ceil(((checkOutDate - checkInDate) / (24 * 60 * 60 * 1000))) + 1
    let total_breakfast, total_lunch, total_dinner;

    total_breakfast = total_days;
    total_lunch = board ? total_days : 0;
    total_dinner = total_days- 1;

    
    
    // useEffect(() => {
    //     const items = JSON.parse(localStorage.getItem('items'));
    //     if (items !== null) {
    //         setAllOrderFreeze(items.allOrderFreeze);
    //         setOtherOrderFreeze(items.otherOrderFreeze);
    //         setCheckInDate(items.checkInDate);
    //         setCheckOutDate(items.checkOutDate);
    //         setBoard(items.board);
    //     } else {

    //         setAllOrderFreeze(true);
    //         setOtherOrderFreeze(true);
    //         setCheckInDate('');
    //         setCheckOutDate('');
    //         setBoard(false);
    //     }
    // }, []);

    // useEffect(() => {
    //     const itemsToStore = {
    //         allOrderFreeze,
    //         otherOrderFreeze,
    //         checkInDate,
    //         checkOutDate,
    //         board
    //     };
    //     localStorage.setItem('items', JSON.stringify(itemsToStore));
    // }, [allOrderFreeze, otherOrderFreeze, checkInDate, checkOutDate, board]);


    const valid1 = function (current) {
        // Get today's date
        const today = moment().startOf('day');

        // Get the future date two months from now
        const futureDate = moment().add(2, 'months').endOf('day');

        // Return true if the current date is between today and two months in the future
        return current.isBetween(today, futureDate, null, '[]');
    };



    const valid2 = function (current) {

        // Get the future date two months from now
        const futureDate = moment().add(2, 'months').endOf('day');

        // Return true if the current date is between today and two months in the future
        return current.isBetween(checkInDate, futureDate, null, '[]');
    };

    useEffect(() => {
        if(items.find(i => i.reservationType  === 'rooms')){
            const roomsOrder = items.filter(i => i.reservationType === 'rooms');
            const oneRoomOrder =roomsOrder[0];
            setCheckInDate(new Date(oneRoomOrder.checkInDate)); 
            setCheckOutDate(new Date(oneRoomOrder.checkOutDate));
        }
    }, [items]);

    return (
        <div className="container-fluid">
            <div className="row">
                <CustomerHeader />
            </div>

            { foodOrder ? (
                <MenuList
                    totalBreakfast={total_breakfast}
                    totalLunch={total_lunch}
                    totalDinner={total_dinner}
                    setFoodOrder={setFoodOrder}
                    checkOutDate = {checkOutDate}
                    checkInDate = {checkInDate}
                />

            ) : vehicleOrder ? (
                <VehicleRental
                    setVehicleOrder = {setVehicleOrder}
                    total_days = {total_days}
                    checkOutDate = {checkOutDate}
                    checkInDate = {checkInDate}
                />
            ) : eventOrder ? (
                <Events
                    setEventOrder = {setEventOrder}
                    checkOutDate = {checkOutDate}
                    checkInDate = {checkInDate}
                    total_days = {total_days}
                />
            ) :  roomOrder ? (
                <RoomList
                    setRoomOrder = {setRoomOrder}
                    roomOrder = {roomOrder}
                    checkOutDate = {checkOutDate}
                    checkInDate = {checkInDate}
                    total_days = {total_days}
                />
            ): (
                <>
                    <div className="row" style={{ height: "25%" }}>
                        <div>
                            <h6 className="text-center user-select-none" style={{ fontSize: '35px', fontWeight: 900 }}>Secure your perfect stay with LakRaj's hotel reservation service for worry-free exploration. !</h6>
                        </div>
                        <hr></hr>

                        <div className='w-75 mx-auto shadow px-3 py-4 rounded mt-4' style={(items.find(i => i.reservationType  === 'rooms')) ? { pointerEvents: "none", opacity: "0.5" } : {}}>
                            <p className='text-dark text-start my-0' style={{ fontSize: '14px', fontWeight: 500, marginLeft: '25px' }}>Please select your <strong>Check in Date</strong> and <strong>Check out Date</strong></p>

                            <div className='d-flex align-items-center justify-content-center gap-5 mt-3 w-100 mx-auto'>
                                <div>
                                    <label htmlFor="pickup-date-picker" className='text-muted mb-2' style={{ fontSize: '14px' }}>Select Check in Date</label>
                                    <Datetime
                                        inputProps={{ id: 'pickup-date-picker' }}
                                        value={checkInDate}
                                        onChange={(date) => setCheckInDate(date)}
                                        timeFormat="HH A"
                                        isValidDate={valid1}
                                    />
                                </div>

                                <span style={{ width: '30px', height: '3px', alignSelf: 'flex-end', marginBottom: '20px' }} className='bg-secondary' ></span>

                                <div className=''>
                                    <label htmlFor="dropoff-date-picker" className='text-muted mb-2' style={{ fontSize: '14px' }}>Select Check out Date</label>
                                    <Datetime
                                        inputProps={{ id: 'dropoff-date-picker' }}
                                        value={checkOutDate}
                                        onChange={(date) => setCheckOutDate(date)}
                                        timeFormat="HH A"
                                        isValidDate={valid2}
                                    />
                                </div>
                            </div>

                            <div className="form-check">
                                <input className="form-check-input ml-25" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value={board} onChange={() => setBoard(false)} checked={!board} />
                                <label className="form-check-label user-select-none" title="Includes bed, breakfast and evening meal (no lunch)." htmlFor="flexRadioDefault1" style={{ cursor: "pointer" }}>
                                    Half Board
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value={board} checked={board} onChange={() => setBoard(true)} />
                                <label className="form-check-label user-select-none" title="Includes bed, breakfast,lunch and evening meal." htmlFor="flexRadioDefault2" style={{ cursor: "pointer" }}>
                                    Full board
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="row" style={{ height: "25%", marginTop: "5%" }}>
                        <div className="col-md-3 d-flex" style={!(checkOutDate !== '' || (items.find(i => i.reservationType  === 'rooms'))) ? { pointerEvents: "none", opacity: "0.5" } : {}}>
                            <div className="card w-80 m-auto" >
                                <div className="card-body">
                                    <h5 className="card-title user-select-none" style={{ color: "black" }}>Room Reservation</h5>
                                    <p className="card-text user-select-none">Booking your room today will ensure your accommodation is secured for your desired dates.</p>
                                    {/* <a href="/rooms" class="btn btn-primary">Add Reservation</a> */}
                                    <button type="button" className="btn btn-primary" onClick={() => setRoomOrder(true)}>Add Reservation</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 d-flex " style={!(items.find(i => i.reservationType  === 'rooms')) ? { pointerEvents: "none", opacity: "0.5" } : {}}>
                            <div className="card w-80 m-auto">
                                <div className="card-body">
                                    <h5 className="card-title user-select-none" style={{ color: "black" }}>Food Reservation</h5>
                                    <p className="card-text user-select-none">Ordering some food will satisfy your hunger and provide you with a delicious meal delivered right to your doorstep.</p>
                                    <button type="button" className="btn btn-primary" onClick={() => setFoodOrder(true)}>Add Reservation</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 d-flex" style={!(items.find(i => i.reservationType  === 'rooms')) ? { pointerEvents: "none", opacity: "0.5" } : {}}>
                            <div className="card w-80 m-auto">
                                <div className="card-body">
                                    <h5 className="card-title user-select-none" style={{ color: "black" }}>Vehicle Reservation</h5>
                                    <p className="card-text user-select-none">Renting a vehicle will provide you with the means to conveniently travel and explore your destination.</p>
                                    <button type="button" className="btn btn-primary" onClick={() => setVehicleOrder(true)}>Add Reservation</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 d-flex" style={!(items.find(i => i.reservationType  === 'rooms')) ? { pointerEvents: "none", opacity: "0.5" } : {}} >
                            <div className="card w-80 m-auto">
                                <div className="card-body">
                                    <h5 className="card-title user-select-none" style={{ color: "black" }}>Event Reservation</h5>
                                    <p className="card-text user-select-none">Joining some events will allow you to immerse yourself in enriching experiences and connect with like-minded individuals.</p>
                                    <button type="button" className="btn btn-primary" onClick={() => setEventOrder(true)}>Add Reservation</button>
                                </div>
                            </div>
                        </div>
                    </div>
                   
                </>
            )}

        </div>
    );
}

export default Booking;