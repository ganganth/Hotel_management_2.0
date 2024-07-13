import { useState } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../styles/popupDefault.css'
import { MdEditOff, MdDeleteForever } from 'react-icons/md';
import { Carousel, Badge } from 'react-bootstrap';
import { MdInfo, MdCheckCircle, MdCancel, MdDoubleArrow } from 'react-icons/md';
import { FaCarSide, FaGasPump, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
// import { useState } from 'react';

const VehicleCard = (props) => {

    // const navigate = useNavigate();
    const [updatePrice, setUpdatePrice] = useState(1);
    const [updateQuantity, setUpdateQuantity] = useState(1);
    const axiosPrivate = useAxiosPrivate();

    const calculatePriceWithDiscount = (price, discount) => {
        const d = (+price / 100) * +discount;
        return (+price - d).toFixed(2);
    }

    const handleVehicleDelete = async (id, name) => {
        try {
            await axiosPrivate.delete(`/api/vehicles/vehicleDetails/deleteVehicle?id=${id}`);
            toast.success(`${name} Successfully deleted`);
        } catch (err) {
            console.log(err);
        }
    }

    const handleVehicleUpdate = async (id, name) => {
        try {
            const price = updatePrice < 0 ? 0 : updatePrice;
            const quantity = updateQuantity < 0 ? 0 : updateQuantity;
            await axiosPrivate.put(`/api/vehicles/vehicleDetails/updateVehicle?id=${id}&price=${price}&quantity=${quantity}`);
            toast.success(`${name} Successfully updated`);
        } catch (err) {
            console.log(err);
        }
    }

    const getUpdateDetails = async (id) => {
        try {
            const response = await axiosPrivate.get(`/api/vehicles/vehicleDetails/updateDetails?id=${id}`);
            setUpdatePrice(response.data.details[0].price);
            setUpdateQuantity(response.data.details[0].quantity)
        } catch (err) {
            console.log(err);
        }

    }

    return (

        <div className="p-4 shadow mb-4 w-100 position-relative" >

            <div className="d-flex align-items-center justify-content-center gap-4">
                {/* image carousel */}
                <div style={{ width: '35%', alignSelf: 'flex-start' }}>
                    <Carousel className='w-100'>
                        {props.vehicle.images.map(img => (
                            <Carousel.Item key={img.fileName}>
                                <img
                                    className="d-block w-100"
                                    src={img.url}
                                    alt={img.fileName}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                            </Carousel.Item>
                        ))}

                    </Carousel>
                </div>
                {/* details */}
                <div className='d-flex flex-column justify-content-start align-items-start' style={{ width: '65%', height: 'max-content' }}>
                    <h5 className='mt-0 mb-4 d-flex align-items-center gap-4' style={{ fontSize: '30px', fontWeight: 700 }} >{props.vehicle.name} <Badge bg={props.vehicle.vehicleCondition === 'normal' ? 'warning' : props.vehicle.vehicleCondition === 'semi-luxary' ? 'info' : 'success'} style={{ fontSize: '12px' }}>{props.vehicle.vehicleCondition === 'normal' ? 'Normal' : props.vehicle.vehicleCondition === 'semi-luxary' ? 'Semi Luxary' : 'Luxary'}</Badge></h5>
                    <div className='d-flex align-items-center gap-4 flex-wrap'>
                        <p className='d-flex align-items-center gap-2 text-muted m-0'>
                            <img src="https://img.icons8.com/material-rounded/24/null/car-door.png" alt='door' style={{ width: '20px', height: '20px' }} />
                            <span style={{ fontSize: '14px', fontWeight: 500 }}>{props.vehicle.brand} </span>
                        </p>
                        <p className='d-flex align-items-center gap-1 text-muted m-0'>
                            {/* <MdAirlineSeatReclineNormal fontSize={25} className='text-muted' /> */}
                            <img src="https://img.icons8.com/material-rounded/24/null/passenger.png" alt='seat' style={{ width: '20px', height: '20px' }} />
                            <span style={{ fontSize: '14px', fontWeight: 500 }}>{props.vehicle.seats} seats</span>
                        </p>
                        <p className='d-flex align-items-center gap-2 text-muted m-0'>
                            <img src="https://img.icons8.com/ios-glyphs/30/null/briefcase.png" alt='bag' style={{ width: '20px', height: '20px' }} />
                            {/* <MdShoppingBag fontSize={25} className='text-muted' /> */}
                            <span style={{ fontSize: '14px', fontWeight: 500 }}>{props.vehicle.bags} bags</span>
                        </p>
                        <p className='d-flex align-items-center gap-2 text-muted m-0'>
                            <img src="https://img.icons8.com/material-rounded/24/null/car-door.png" alt='door' style={{ width: '20px', height: '20px' }} />
                            <span style={{ fontSize: '14px', fontWeight: 500 }}>{props.vehicle.doors} doors</span>
                        </p>
                        <p className='d-flex align-items-center gap-2 text-muted m-0'>
                            {/* <FaSnowflake fontSize={25} className='text-muted' /> */}
                            <img src="https://img.icons8.com/ios/50/null/cooling.png" alt='cooling' style={{ width: '20px', height: '20px' }} />
                            <span style={{ fontSize: '14px', fontWeight: 500 }}>{props.vehicle.isAirConditioned === 'yes' ? 'Air Conditioning' : 'No Air Conditioning'}</span>
                        </p>
                        <p className='d-flex align-items-center gap-2 text-muted m-0'>
                            <img src="https://img.icons8.com/external-tanah-basah-basic-outline-tanah-basah/24/null/external-gearbox-transportation-tanah-basah-basic-outline-tanah-basah-2.png" alt='gearbox' style={{ width: '20px', height: '20px' }} />
                            <span style={{ fontSize: '14px', fontWeight: 500 }}>{props.vehicle.isAuto === 'yes' ? 'Automatic' : 'Manuel'}</span>
                        </p>
                        <p className='d-flex align-items-center gap-2 text-muted m-0'>
                            <img src="https://img.icons8.com/external-vitaliy-gorbachev-fill-vitaly-gorbachev/60/null/external-fuel-ecology-vitaliy-gorbachev-fill-vitaly-gorbachev.png" alt="fuel" style={{ width: '20px', height: '20px' }} />
                            <span style={{ fontSize: '14px', fontWeight: 500 }}>{props.vehicle.fuelType.charAt(0).toUpperCase() + props.vehicle.fuelType.slice(1)}</span>
                        </p>
                    </div>
                    <p className='bg-info text-white mt-4 mb-4 rounded d-flex align-items-center gap-2' style={{ fontSize: '12px', fontWeight: 500, padding: '4px 10px', letterSpacing: '1px' }} ><MdInfo fontSize={20} /> {props.vehicle.paymentType === 'half' ? 'HALF PAYMENT' : 'FULL PAYMENT'}</p>
                    <div className='w-100 d-flex align-items-center justify-content-between'>
                        <p className='d-flex align-items-center gap-2 m-0'>
                            <FaCarSide fontSize={18} />
                            <Badge bg='dark'>{props.vehicle.type.charAt(0).toUpperCase() + props.vehicle.type.slice(1)}</Badge>

                        </p>
                        {props.role === 'Customer' ? (
                            <button className='btn btn-primary rounded mx-5 d-flex align-items-center justify-content-center gap-2' style={{ fontWeight: 500, width: '200px', fontSize: '18px' }} onClick={() => props.handleVehiclePopup(props.vehicle)} >Rent Now <MdDoubleArrow fontSize={25} /></button>
                        ) : (
                            <div className='d-flex justify-content-start'>
                                <Popup
                                    trigger={<button className='btn border-0'><MdEditOff size={25} /></button>}
                                    modal
                                    onOpen={() => getUpdateDetails(props.vehicle.id)}
                                >
                                    {close => (
                                        <div className="modal" style={{ display: "contents" }}>
                                            <button className="close" onClick={close}>
                                                &times;
                                            </button>
                                            <div className="header"> Update {props.vehicle.name} vehicle Details</div>
                                            {(updatePrice && updateQuantity) && (
                                                <div className="content">
                                                    <label htmlFor="">Price</label>
                                                    <input
                                                        type='number'
                                                        step='1'
                                                        min='0'
                                                        className="form-control"
                                                        value={updatePrice}
                                                        onChange={e => setUpdatePrice(e.target.value)}
                                                    />
                                                    <label htmlFor="">Quantity</label>
                                                    <input
                                                        type='number'
                                                        step='1'
                                                        min='0'
                                                        className="form-control"
                                                        value={updateQuantity}
                                                        onChange={e => setUpdateQuantity(e.target.value)}
                                                    />
                                                </div>
                                            )}
                                            <div className="actions" >
                                                <button className='btn btn-success' onClick={() => handleVehicleUpdate(props.vehicle.id, props.vehicle.name)}>Update</button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => {
                                                        console.log('modal closed ');
                                                        close();
                                                    }}
                                                    style={{ marginLeft: "2px" }}
                                                >
                                                    cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </Popup>

                                <Popup
                                    trigger={<button className='btn border-0 text-danger' ><MdDeleteForever size={25} /></button>}
                                    modal
                                >
                                    {close => (
                                        <div className="modal" style={{ display: "contents" }}>
                                            <button className="close" onClick={close}>
                                                &times;
                                            </button>
                                            <div className="header">Are you sure you want to delete {props.vehicle.name} vehicle?</div>
                                            <div className="actions" >
                                                <button className='btn btn-success' onClick={() => handleVehicleDelete(props.vehicle.id, props.vehicle.name)}>Delete</button>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => {
                                                        console.log('modal closed ');
                                                        close();
                                                    }}
                                                    style={{ marginLeft: "2px" }}
                                                >
                                                    cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </Popup>
                            </div>
                        )}

                    </div>

                </div>
            </div>

            <hr></hr>

            <div className='d-flex  justify-content-between' style={{ height: 'max-content' }}>

                <div style={{ flex: 1 }}>
                    <div className='d-flex align-items-center gap-3 mb-3' title='This is it'>
                        <FaGasPump fontSize={28} />
                        <p className='d-flex flex-column align-items-start m-0'>
                            <span style={{ fontSize: '14px', fontWeight: 700 }}>Fuel Policy</span>
                            <span style={{ fontSize: '16px' }}>{props.vehicle.fuelPolicy === 'full-to-full' ? 'Full to Full' : props.vehicle.fuelPolicy === 'full-to-empty' ? 'Full to Empty' : 'Same to Same'}</span>
                        </p>
                    </div>
                    <div className='d-flex align-items-center gap-3'>
                        <FaMapMarkerAlt fontSize={28} />
                        <p className='d-flex flex-column align-items-start m-0'>
                            <span style={{ fontSize: '14px', fontWeight: 700 }}>Pick Up Policy</span>
                            <span style={{ fontSize: '16px' }}>
                                {props.vehicle.pickupPolicy === 'delivery' ? 'Delivery Only' : props.vehicle.pickupPolicy === 'both' ? 'Both Delivery And Hotel Premise' : 'No Delivery, On Hotel Premise Only'}
                            </span>
                        </p>
                    </div>
                </div>

                <div style={{ flex: 1, height: '100%' }}>
                    <ul>
                        {props.vehicle.additionalFeatures.length > 0 ? (
                            props.vehicle.additionalFeatures.map(f => (
                                <li key={f} className='d-flex align-items-center gap-2 mb-1'>
                                    <FaCheck className='text-success' fontSize={12} />
                                    <small style={{ fontSize: '13px' }}>{f}</small>
                                </li>
                            ))
                        ) : (
                            <p>No additional features</p>
                        )}
                    </ul>
                </div>

                <div style={{ flex: 1 }}>
                    <p className={`mb-3 d-flex align-items-center justify-content-start gap-3 m-0 px-2 py-1 border rounded ${props.vehicle.isDriverFree === 'yes' ? 'text-success' : 'text-danger'} ${props.vehicle.isDriverFree === 'yes' ? 'border-success' : 'border-danger'}`} style={{ fontWeight: 500 }} >{props.vehicle.isDriverFree === 'yes' ? (<><MdCheckCircle className='text-success' fontSize={22} /> Free Driver</>) : (<><MdCancel className='text-danger' fontSize={22} />No Free Driver</>)}</p>

                    <div className='mb-3'>
                        <small style={{ fontSize: '12px', fontWeight: 500 }} className='text-muted'>Overdue cost (per hour)</small>
                        <p className='m-0 text-muted'>USD ${props.vehicle.overduePrice}</p>
                    </div>

                    <div>
                        <small style={{ fontSize: '14px', fontWeight: 500 }} className='text-dark'>Rental cost (per hour)</small>
                        {props.vehicle.discount > 0 ? (
                            <p className='m-0 text-dark d-flex align-items-center gap-3' style={{ fontSize: '20px' }}>USD ${calculatePriceWithDiscount(props.vehicle.price, props.vehicle.discount)} <span style={{ textDecoration: 'line-through', marginLeft: '10px' }} className='text-muted'>${props.vehicle.price}</span> <span style={{ fontSize: '12px', fontWeight: 500 }} className='text-muted'>with {props.vehicle.discount}% Discount</span></p>
                        ) : (
                            <p className='m-0 text-dark' style={{ fontSize: '20px' }}>USD ${props.vehicle.price}</p>
                        )}

                    </div>

                </div>
            </div>
        </div>

    );
}

export default VehicleCard;