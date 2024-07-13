import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {Spinner} from 'react-bootstrap';
import { MdEdit} from 'react-icons/md';

const FoodList = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const [loading, setLoading] = useState(true);
    const [menus, setMenus] = useState([]);

    useEffect(() => {
        const getAllMenus = async () => {
            try {
                const response =await axiosPrivate.get('/api/foods');
                console.log(response);
                setMenus(response.data.menus);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        getAllMenus();
    }, [axiosPrivate]);

   

    return (
        <>
            <div className="d-flex align-items-center justify-content-between">
                <h1>Food Management</h1>
                {/* <button className='btn btn-dark' onClick={() => navigate('/dash/employee/food-management/orders')} >View All Orders</button> */}
            </div>
            <hr></hr>

            {loading ? (
                <div className='d-flex flex-column gap-2 justify-content-center align-items-center'>
                    <Spinner
                        as="span"
                        animation="grow"
                        size="xl"
                        role="status"
                        aria-hidden="true"
                        
                        style={{marginTop: '250px'}}
                    />
                    <small>loading...</small>
                </div>
            ) : (
                <>
                    {menus.length > 0 ? (
                        <>
                            <p className='m-0 my-3' style={{fontWeight: 500, fontSize: '20px'}}>Available Menus</p>
                            {menus.map(m => (
                                <div className='p-3 shadow rounded d-flex align-items-center justify-content-between mb-4' key={m.id}>
                                    <div>
                                        <img src={m.image} alt={m.name} style={{width: '150px', height: '100px', objectFit: 'cover'}} />
                                    </div>
                                    <div>
                                        <h3>{m.name}</h3>
                                    </div>
                                    <div className='d-flex align-items-center gap-3 mx-5'>
                                        <button className='btn btn-dark btn-sm d-flex align-items-center gap-2' onClick={() => navigate(`/dash/employee/food-management/update?id=${m.id}`)} ><MdEdit fontSize={18} /> Edit</button>
                                        {/* <button className='btn btn-danger btn-sm d-flex align-items-center gap-2' onClick={() => handleMenuDelete(m)}><MdDeleteForever fontSize={18} /> Delete</button> */}
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p className='alert alert-warning text-center m-0 my-5'>No menus to display</p>
                    )}
                </>
            )}
        </>
    );
}

export default FoodList;