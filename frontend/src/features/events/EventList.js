import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../../styles/popupDefault.css'

import { Badge, Spinner } from 'react-bootstrap';

import { MdOutlineEditCalendar, MdEditOff, MdDeleteForever } from 'react-icons/md';
import { toast } from 'react-toastify';


const EventList = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatePrice, setUpdatePrice] = useState(1);
    const [updateQuantity, setUpdateQuantity] = useState(1);


    useEffect(() => {

        const getAllEvents = async () => {

            try {
                const response = await axiosPrivate.get('/api/events');
                setEvents(response.data.events);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        getAllEvents();

    }, [axiosPrivate]);

    const handleEventDelete = async (id, name) => {
        try {
            await axiosPrivate.delete(`/api/events/eventsDetails/deleteEvent?id=${id}`);
            toast.success(`${name} Successfully deleted`);
        } catch (err) {
            console.log(err);
        }
    }

    const handleEventUpdate = async (id, name) => {
        try {
            const price = updatePrice < 0 ? 0 : updatePrice;
            const quantity = updateQuantity < 0 ? 0 : updateQuantity;
            await axiosPrivate.put(`/api/events/eventDetails/updateEvent?id=${id}&price=${price}&quantity=${quantity}`);
            toast.success(`${name} Successfully updated`);
        } catch (err) {
            console.log(err);
        }
    }

    const getUpdateDetails = async (id) => {
        try {
            const response = await axiosPrivate.get(`/api/events/eventDetails/updateDetails?id=${id}`);
            setUpdatePrice(response.data.details[0].price);
            setUpdateQuantity(response.data.details[0].quantity)
        } catch (err) {
            console.log(err);
        }

    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h1>Event List</h1>
                {/* <button className='btn btn-dark' onClick={() => navigate('/dash/employee/event-management/orders')} >All Event Orders</button> */}
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={() => navigate('/dash/employee/event-management/add')} ><MdOutlineEditCalendar /> Add New Event</button>
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

            {!loading && events.length > 0 && events.map(e => (
                <div key={e.id} className='shadow p-3 d-flex gap-5 align-items-start mb-4 rounded position-relative' >
                    <div className='position-absolute d-flex align-items-center' style={{ top: 20, right: 20 }}>
                        {/* <button className='btn border-0' onClick={() => navigate(`/dash/employee/event-management/add?edit=true&id=${e.id}`)} ><MdEditOff size={25} /></button>
                        <button className='btn border-0 text-danger' onClick={() => handleEventDelete(e.id)}><MdDeleteForever size={25} /></button> */}
                        <Popup
                            trigger={<button className='btn border-0'><MdEditOff size={25} /></button>}
                            modal
                            onOpen={() => getUpdateDetails(e.id)}
                        >
                            {close => (
                                <div className="modal" style={{ display: "contents" }}>
                                    <button className="close" onClick={close}>
                                        &times;
                                    </button>
                                    <div className="header"> Update {e.name} event Details</div>
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
                                        <button className='btn btn-success' onClick={() => handleEventUpdate(e.id, e.name)}>Update</button>
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
                                    <div className="header">Are you sure you want to delete {e.name} event?</div>
                                    <div className="actions" >
                                        <button className='btn btn-success' onClick={() => handleEventDelete(e.id, e.name)}>Delete</button>
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
                    <div>
                        <img src={e.image} alt={e.name} style={{ width: '300px', height: '200px', objectFit: 'cover' }} />
                    </div>
                    <div>
                        <h4 className='mb-3'>{e.name}</h4>
                        <div className='d-flex flex-column gap-1 mb-3' style={{ width: 'max-content' }}>
                            <span style={{ fontSize: '12px', fontWeight: 500 }}>Event Type</span>
                            <Badge bg={e.type === 'common' ? 'info' : 'success'}>{e.type}</Badge>
                        </div>
                        <div className='d-flex flex-column gap-1' style={{ width: 'max-content' }}>
                            <span style={{ fontSize: '12px', fontWeight: 500 }}>Event Price (USD)</span>
                            <p style={{ fontSize: '30px' }}>${e.price}</p>
                        </div>
                    </div>
                </div>
            ))}

            {!loading && events.length === 0 && (<p className='text-center my-4'>No events to display</p>)}
        </>
    );
}

export default EventList;