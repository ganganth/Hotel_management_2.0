import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { addItemToCart } from '../../app/ordersCart/orderCartSlice';
import { useDispatch, useSelector } from 'react-redux';
import 'react-datetime/css/react-datetime.css';
import VehicleCard from '../../components/VehicleCard';
import VehiclePopUp from './VehiclePopUp';
import { Row, Col, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { selectAuthUser } from '../../app/auth/authSlice';

const VehicleRental = (props) => {

    const axiosPrivate = useAxiosPrivate();
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [popup, setPopup] = useState(false);
    const [pickUp, setPickup] = useState(true);
    const [pickupPolicy, setPickUpPolicy] = useState('');
    const dispatch = useDispatch();
    const { items } = useSelector(state => state.orderCart);
    const [vehiclesPD, setVehiclesPD] = useState([]);
    const pickupCharge =100;
    const role = useSelector(selectAuthUser);
   console.log("dcbdfvchjd",role)
    useEffect(() => {
        const getAllVehicleData = async () => {
            try {
                const response = await axiosPrivate.get(`/api/vehicles/booking/rent-allVehicle?checkInDate=${props.checkInDate}&checkOutDate=${props.checkOutDate}`);
                setVehicles(response.data.data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
                console.log(err);
            }
        }
        getAllVehicleData();
    }, [axiosPrivate, props.checkOutDate, props.checkInDate])
    console.log(vehicles)

    const vehicleRentFunc = (v) => {

        const isFound = items.find(i =>
            i.reservationType === 'vehicle'
            && i.id === v.id
            && (i.quantity + 1) > v.quantity
        );

        if (isFound) {
            toast.warning(`No Vehicle are available`)
        }
        else {
            const r = {
                id: v.id,
                image: v.images[0].url,
                quantity: 1,
                name: v.name,
                price: v.price,
                checkInDate: props.checkInDate,
                checkOutDate: props.checkOutDate,
                reservationType: 'vehicle',
                Total_price: ((v.fuelPolicy === 'full-to-empty' || v.fuelPolicy === 'none') ? (v.price -(v.price*v.discount/100)) : pickUp ? (((v.price -(v.price*v.discount/100)) * props.total_days) + pickupCharge) : ((v.price -(v.price*v.discount/100)) * props.total_days)) ,
                description: `This is ${v.name} with brand ${v.brand} vehicle.`,
                fuelPolicy: v.fuelPolicy,
                pickupPolicy: v.pickupPolicy
            }

            dispatch(addItemToCart(r));
            toast.success(`${v.name} added to the cart`);


        }
    }
    const handleVehiclePopup = (v) => {
        setPopup(true);
        setVehiclesPD(v);
        setPickUpPolicy('');
        setPickup(false);
        if(v.pickupPolicy ==='both' || v.pickupPolicy === 'delivery'){
            setPickUpPolicy(v.pickupPolicy);
            setPickup(true);
        }
    }

    return (
        <>
            <div style={popup ? { pointerEvents: "none", opacity: "0.1", backgroundColor: "rgba(0, 0, 0, 0.7)" } : {}}>

                <div>
                    <h6 className="text-center" style={{ fontSize: '25px', fontWeight: 500 }}>Your Comprehensive Resource for Vehicle Rentals and Exploration !</h6>
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
                                {vehicles.map(v => <VehicleCard key={v.id} vehicle={v} isEditable={false} isRentalBtnVisible={true} handleVehiclePopup={handleVehiclePopup} role={role.role} />)
                                }
                            </Col >

                        </Row >

                    </>
                )}


            </div>
            <VehiclePopUp
                pickUp={pickUp}
                setPickup={setPickup}
                trigger={popup}
                setPopup={setPopup}
                total_days={props.total_days}
                pickupPolicy={pickupPolicy}
                vehicleRentFunc={vehicleRentFunc}
                vehiclesPD={vehiclesPD}
            />
        </>
    );
}

export default VehicleRental;