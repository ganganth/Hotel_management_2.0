import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import 'react-datetime/css/react-datetime.css';
import VehicleCard from '../../components/VehicleCard';
import VehiclePopUp from './VehiclePopUp';
import { Row, Col, Spinner } from 'react-bootstrap';


const VehicleRental = (props) => {

    const axiosPrivate = useAxiosPrivate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [popup, setPopup] = useState(false);
    const [pickUp, setPickup] = useState(true);

    // const [modelState, setModelState] = useState({
    //     isOpen: false,
    //     vehicle: null
    // });

    // const [pickupDate, setPickupDate] = useState(new Date());
    // const [dropoffDate, setDropoffDate] = useState('');

    useEffect(() => {
        const getAllVehicleData = async () => {
            try {
                const response = await axiosPrivate.get('/api/vehicles/');
                setVehicles(response.data.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                console.log(err);
            }
        }
        getAllVehicleData();
    }, [axiosPrivate])
    console.log(vehicles)

    const vehicleRentFunc = () => {
        setPopup(true)
    }

    const handleVehicleRent = () => {
        setPopup(false)
    }


    // const yesterday = moment().subtract( 1, 'day' );
    // const valid1 = function( current ){

    //     return current.isAfter( yesterday );
    // };

    // const valid2 = function( current ){
    //     //console.log(current);
    //     const currentDate = moment(current);
    //     const selectedDate = moment(pickupDate);

    //     const daysDiff = Math.abs(selectedDate.diff(currentDate, 'days'))
    //     let futureDay;
    //     //console.log(new Date(moment(new Date())).toDateString());
    //     //console.log(new Date(moment(pickupDate)).toDateString());
    //     if(new Date(moment(pickupDate)).toDateString() === new Date(moment(new Date())).toDateString()) {
    //        futureDay = moment().add(daysDiff - 1, 'day');
    //     } else {
    //         futureDay = moment().add(daysDiff, 'day');
    //     }
    //     return current.isAfter( futureDay );
    // };

    // const handleModelState = (vehicle) => {
    //     setModelState({
    //         isOpen: true,
    //         vehicle
    //     });
    // }

    // const handleModelClose = () => {
    //     setModelState({
    //         isOpen: false,
    //         vehicle: null
    //     });
    // }

    // function getHours(date1, date2) {
    //     const millieSeconds = Math.abs(date2 - date1);
    //     return millieSeconds / (1000 * 60 * 60);
    // }

    // const handleVehicleSearch = async () => {

    //     // check for the dropOffDate before search
    //     if(!dropoffDate && dropoffDate.trim() === '') return toast.error('please select drop off date');

    //     setIsSearching(true);

    //     const pickupDateString = moment(pickupDate).toDate();
    //     const dropoffDateString = moment(dropoffDate).toDate();

    //     const sqlPickupDate = `${pickupDateString.getFullYear()}-${pickupDateString.getMonth() + 1}-${pickupDateString.getDate()} ${pickupDateString.getHours()}:00:00`;
    //     const sqlDropoffDate = `${dropoffDateString.getFullYear()}-${dropoffDateString.getMonth() + 1}-${dropoffDateString.getDate()} ${dropoffDateString.getHours()}:00:00`;

    //     // console.log(getHours(new Date(sqlPickupDate), new Date(sqlDropoffDate)));

    //     try {
    //         // MAKE THE API CALL TO FETCH AVAILABLE VEHICLES
    //         const response = await axiosPrivate.get(`/api/vehicles/rental/search?pickupDate=${sqlPickupDate}&dropoffDate=${sqlDropoffDate}`);
    //         console.log(response);
    //         setIsOnceSearched(true);
    //         setResultVehicles(response.data.vehicles);
    //         setIsSearching(false);
    //     } catch (err) {
    //         console.log(err.response.data?.message || 'Internal server error');
    //         setIsSearching(false);
    //     }
    // }

    return (
        <>
            <div style={popup ? { pointerEvents: "none", opacity: "0.1", backgroundColor: "rgba(0, 0, 0, 0.7)" } : {}}>

                <div>
                    <h6 className="text-center" style={{ fontSize: '25px', fontWeight: 500 }}>Your Comprehensive Resource for Car Rentals and Exploration !</h6>
                    <button className='btn btn-primary' style={{ marginLeft: "87%" }} onClick={() => props.setVehicleOrder(false)}>Go Back</button>
                </div>
                <hr></hr>

                {loading && (
                    <div className='d-flex flex-column gap-2 justify-content-center align-items-center'>
                        <Spinner
                            as="span"
                            animation="grow"
                            size="xl"
                            role="status"
                            aria-hidden="true"

                            style={{ marginTop: '250px' }}
                        />
                        <small>loading...</small>
                    </div>
                )}

                {!loading && vehicles.length > 0 && (
                    <>



                        <Row className='my-5'>
                            <Col md={12}>
                                {vehicles.map(v => <VehicleCard key={v.id} vehicle={v} isEditable={false} isRentalBtnVisible={true} vehicleRentFunc={vehicleRentFunc} />)
                                }
                            </Col >

                        </Row >

                    </>
                )}


            </div>
            <VehiclePopUp pickUp={pickUp} setPickup={setPickup} handleVehicleRent={handleVehicleRent} trigger={popup} setPopup={setPopup} total_days={props.total_days} />
        </>
    );
}

export default VehicleRental;