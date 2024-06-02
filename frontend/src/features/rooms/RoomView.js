import {Row, Col} from 'react-bootstrap';

import {FaBed, FaChild, FaMale} from 'react-icons/fa';
import {MdClose, MdBookmarkAdd} from 'react-icons/md';
// swiper imports
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Autoplay, EffectCoverflow, Lazy, Zoom} from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import 'swiper/css/lazy';
import 'swiper/css/zoom';
import { useDispatch } from 'react-redux';
import {  removeOtherOrderFreeze } from '../../app/state/stateSlice';

import '../../styles/room_management/roomView.css';

const RoomView = (props) => {

    const dispatch = useDispatch();
   
    const calculateDiscount = () => {
        const discount = (props.singleRoom.totalPrice / 100) * props.singleRoom.fullPaymentDiscount;
        const discountAdded = ((+props.singleRoom.totalPrice) - (+discount.toFixed(2)));
        return discountAdded;
    }

    const handleRoomBooking = () =>{
        dispatch(removeOtherOrderFreeze());
    }

    const setMoreRoomViewFunc = () =>{
        props.setSingleRoom({})
        props.setMoreRoomView(false)
    }

   console.log("room view",props.singleRoom)
    return (
        
        props.singleRoom.name && (
                <div className='roomView'>

                    <aside className='employeeList-header'>
                        <h1 className='roomView-header-title'>{props.singleRoom.name}</h1>
                        <button className='btn btn-primary' onClick={() => setMoreRoomViewFunc()}>Go Back</button>
                    </aside>
                
                    <div className='my-5'>
                        <Swiper
                            modules={[Navigation, Autoplay, EffectCoverflow, Lazy, Zoom]}
                            centeredSlides
                            slidesPerView={2}
                            grabCursor
                            navigation
                            autoplay
                            lazy
                            zoom
                            effect='coverflow'
                            coverflowEffect={{
                                rotate: 50,
                                stretch: 0,
                                depth: 100,
                                modifier: 1,
                                slideShadows: true
                            }}
                        >
                            {props.singleRoom.images.map(item => (
                                <SwiperSlide key={item.fileName}>
                                    <div className='swiper-zoom-container'>
                                        <img src={item.imageUrl} alt={item.fileName} />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    <div className='roomView-details'>
                        <Row className='mb-2'>
                            <Col md={4}>
                                <div className='roomView-details-legend roomView-details-bedType'>
                                    <p className='roomView-details-title'>Bed Type</p>
                                    <p><span><FaBed /></span> {props.singleRoom.bedType}</p>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className='roomView-details-legend'>
                                    <p className='roomView-details-title'>Adult Occupancy</p>
                                    <p>
                                        {props.singleRoom.adultOccupation === 0 && (<span><MdClose color='red' /></span>)}
                                        {Array.from({length: props.singleRoom.adultOccupation}).map((i, index) => (<span key={index}><FaMale /></span>))}
                                    </p>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className='roomView-details-legend'>
                                    <p className='roomView-details-title'>Child Occupancy</p>
                                    <p>
                                        {props.singleRoom.childOccupation === 0 && (<span><MdClose color='red' /></span>)}
                                        {Array.from({length: props.singleRoom.childOccupation}).map((i, index) => (<span key={index}><FaChild /></span>))}
                                    
                                    </p>
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <p  className='roomView-details-title'>Room Description</p>
                                <p>{props.singleRoom.description}</p>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={8}>
                        
                                <Row className='border p-4 mb-4'>
                                    <Col md={6}>
                                        <div>
                                            <p className='roomView-details-title'>Common Features</p>
                                            <ul>
                                                <li>{props.singleRoom.view.toUpperCase()} View</li>
                                                <li>{props.singleRoom.bathroomType === 'attached' ? 'Attached Bathroom' : 'Not Attached Bathroom'}</li>
                                                <li>{props.singleRoom.televisionType === 'cable' ? 'Cable Television' : 'Satellite Television'}</li>
                                                <li>{props.singleRoom.heatingAvailable === 'available' ? 'Heating Available' : 'Heating Not Available'}</li>
                                                <li>{props.singleRoom.towelAvailable === 'available' ? 'Linen & Towel Provided' : 'Linen & Towel Not Available'}</li>
                                                <li>{props.singleRoom.towelAvailable === 'available' ? 'Linen & Towel Provided' : 'Linen & Towel Not Available'}</li>
                                            </ul>
                                        </div>
                                    </Col>
                                    <Col md={6}>
                                        <div>
                                            <p className='roomView-details-title'>Special Features</p>
                                            <ul>
                                                {props.singleRoom.specialFeatures.map(item => (
                                                    <li key={item.id}>{item.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12}>
                                    <div className='roomView-details-legend'>
                                    <p className='roomView-details-title'>Total {props.singleRoom.name}s</p>
                                    <p>
                                        {props.singleRoom.totalRooms}
                                    </p>
                                </div>
                                    </Col>  
                                </Row>
                            </Col>

                            <Col md={4}>
                                <div className='roomView-details-price-container'>
                                    <h1 className='text-center roomView-details-price-main-title'>Price Per Night</h1>
                                    <hr></hr>
                                    <p className='text-center roomView-details-price-main-price'>${props.singleRoom.totalPrice}</p>
                                    <div className='d-flex flex-column align-items-center'>
                                        <small className='text-center text-muted mb-4'>When booking a room make the full payment and get <span className='text-success'>{props.singleRoom.fullPaymentDiscount}%</span> Discount</small>
                                        <h5 className='roomView-details-price-discount-desc'>Full Payment Price</h5>
                                        <p className='roomView-details-price-discount'>${calculateDiscount()}</p>
                                        <p className='text-muted roomView-details-price-discount-show'><span className='roomView-details-price-discount-linethrough'>${props.singleRoom.totalPrice}</span> off {props.singleRoom.fullPaymentDiscount}%</p>
                                        <button className='d-block btn btn-primary roomView-details-price-book-btn' onClick={() => handleRoomBooking()}>Book Room Now <MdBookmarkAdd /></button>                  
                                    </div>
                                </div>
                            </Col>
                        </Row>

                    </div>

                </div>
            )
    );
}


export default RoomView;
