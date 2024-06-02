import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '../../app/auth/authSlice';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import RoomCard from '../../components/RoomCard';

import { MdBedroomParent } from 'react-icons/md';

const RoomList = (props) => {

    const { role } = useSelector(selectAuthUser);
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [moreRoomView, setMoreRoomView] = useState(false);
    const [rooms, setRooms] = useState([]);


    useEffect(() => {
        const getAllRoomTypes = async () => {
            try {
                const response = await axiosPrivate.get('/api/rooms');
                setRooms(response.data.rooms);
            } catch (err) {
                console.error("Error fetching all room types:", err);
            }
        }

        getAllRoomTypes();

    }, [axiosPrivate, props.roomId]); 

    return (
        <div>

            {(role === 'Employee' || role === 'Admin') && (
                <>
                    <aside className='employeeList-header'>
                        <h1>Room Management</h1>
                        <button className='btn btn-dark' onClick={() => navigate('/dash/employee/room-management/bookings')}>View All Bookings</button>
                        <button className='btn btn-primary' onClick={() => navigate('/dash/employee/room-management/add')}>Create New Room Type <MdBedroomParent /></button>
                    </aside>

                    <hr></hr>
                </>
            )}

            {(role === 'Customer' && moreRoomView === false) && (
                <>
                    <h1 className='text-center user-select-none mb-4'>Reserve your one ....</h1>
                    <button className='btn btn-primary' style={{ marginLeft: "87%" }} onClick={() => props.setRoomOrder(false)}>Go Back</button>
                </>

            )}


            <div className='container mt-4'>
                {rooms.length > 0 && rooms.map(r => (
                    <RoomCard
                        key={r.id} 
                        room={r}
                        moreRoomView={moreRoomView}
                        setMoreRoomView={setMoreRoomView}
                    />
                ))}
            </div>

        </div>
    );
}

export default RoomList;