import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '../app/auth/authSlice';
import RoomView from '../features/rooms/RoomView';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import '../styles/roomCard.css';

const RoomCard = (props) => {

    const navigate = useNavigate();
    const { role } = useSelector(selectAuthUser);
    const [index, setIndex] = useState(0);
    const [singleRoom, setSingleRoom] = useState({});
    const axiosPrivate = useAxiosPrivate();
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    const calculateDiscount = () => {
        const discount = (props.room.totalPrice / 100) * props.room.fullPaymentDiscount;
        const discountAdded_prev = ((+props.room.totalPrice) - (+discount.toFixed(2)));
        const discountAdded = discountAdded_prev.toFixed(2)
        return discountAdded;
    }

    const getSingleRoomType = async (id) => {
        console.log(id);
        try {
            const response = await axiosPrivate.get(`/api/rooms/bookings/available-rooms?roomType=${id}&checkInDate=${props.checkInDate}&checkOutDate=${props.checkOutDate}`);
            console.log("Single room data:", response.data);
            setSingleRoom(response.data.room);
        } catch (err) {
            console.error("Error fetching single room type:", err);
            
        }
};

    const roomMoreViewFunc = (id) => {
        setSingleRoom({})
        props.setMoreRoomView(true);
        getSingleRoomType(id);
    }
   
    return (
        <>
            {props.moreRoomView ? (
                <RoomView 
                    setMoreRoomView={props.setMoreRoomView}
                    roomId = {props.roomId}
                    singleRoom = {singleRoom}
                    setSingleRoom ={setSingleRoom}
                    checkOutDate = {props.checkOutDate}
                    checkInDate = {props.checkInDate}
                    total_days = {props.total_days}
                />
            ) : (
                <div className="row justify-content-center mb-5" >
                    <div className="col-sm-9 col-md-12 col-lg-12">
                        <div className="hotel-card bg-white rounded-lg shadow overflow-hidden d-block d-lg-flex">

                            <div className="hotel-card_images">

                                <Carousel activeIndex={index} onSelect={handleSelect}>
                                    {props.room.images.map(item => (
                                        <Carousel.Item style={{ height: '290px' }} key={item.fileName}>
                                            <img
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                className="d-block w-100"
                                                src={item.imageUrl}
                                                alt={item.fileName}
                                            />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>

                            </div>

                            <div className="hotel-card_info px-4 py-3">

                                <div className="">
                                    <h3 className="mb-0 mr-2">{props.room.name}</h3>
                                    <p className='hotel-card_info-description text-muted mt-2 m-0 p-0'>{props.room.description}</p>

                                </div>
                                <div className="d-flex justify-content-between align-items-end mt-2">
                                    <div className="hotel-card_details">
                                        <div className="text-muted mb-2"><i className="fas fa-map-marker-alt"></i> {props.room.bedType}</div>

                                        <div className="amnities d-flex align-items-center gap-3 mb-3">
                                            <img className="mr-2" src="/images/icons/desk-bell.svg" data-toggle="tooltip" data-placement="top" title="Desk bell" alt="Desk bell" />
                                            <img className="mr-2" src="/images/icons/single-bed.svg" data-toggle="tooltip" data-placement="top" title="Single Bed" alt="Single Bed" />
                                            <img className="mr-2" src="/images/icons/towels.svg" data-toggle="tooltip" data-placement="top" title="Towels" alt="Towels" />
                                            <img className="mr-2" src="/images/icons/wifi.svg" data-toggle="tooltip" data-placement="top" title="Wifi" alt="Wifi" />
                                            <img className="mr-2" src="/images/icons/hammock.png" data-toggle="tooltip" data-placement="top" title="Hammock" alt="Hammock" />
                                            <img className="mr-2" src="/images/icons/heating.svg" data-toggle="tooltip" data-placement="top" title="Hammock" alt="Hammock" />
                                        </div>
                                        <ul className="hotel-checklist p-0 m-0">
                                            <li className='text-muted'>{props.room.view.toUpperCase()} View <i className="fa fa-check text-success"></i> </li>
                                            <li className='text-muted'>Attached Bathrooms {props.room.bathroomType === 'attached' ? <i className="fa fa-check text-success"></i> : <i className="fa fa-remove text-danger"></i>} </li>
                                            <li className='text-muted'>Satellite Television {props.room.televisionType === 'satellite' ? <i className="fa fa-check text-success"></i> : <i className="fa fa-remove text-danger"></i>}</li>
                                            <li className='text-muted'>Heating Available {props.room.heatingAvailability === 'available' ? <i className="fa fa-check text-success"></i> : <i className="fa fa-remove text-danger"></i>}</li>
                                            <li className='text-muted'>Towel & Linen Available {props.room.towelAvailability === 'available' ? <i className="fa fa-check text-success"></i> : <i className="fa fa-remove text-danger"></i>}</li>
                                        </ul>

                                    </div>
                                    <div className="hotel-card_pricing text-center">
                                        <h3>${calculateDiscount()}</h3>
                                        <div className="d-flex gap-2">
                                            <h6 className="text-striked text-muted">${props.room.totalPrice}</h6>
                                            <h6 className="text-success">{props.room.fullPaymentDiscount}% off</h6>
                                        </div>
                                        {(role === 'Customer') && (
                                            <button className="btn btn-primary" onClick={() => roomMoreViewFunc(props.room.id)}>View More</button>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}


export default RoomCard;