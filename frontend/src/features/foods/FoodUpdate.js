import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Spinner, Badge, Table } from 'react-bootstrap';
import { MdFastfood, MdEditOff,MdDeleteForever } from 'react-icons/md';
import { MdSort } from 'react-icons/md';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import '../../styles/popupDefault.css'
import { toast } from 'react-toastify';

const FoodUpdate = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const axiosPrivate = useAxiosPrivate();
    const id = searchParams.get('id');
    const [loading, setLoading] = useState(true);
    const [menu, setMenu] = useState({});
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [meals, setMeals] = useState([]);
    const [updatePrice, setUpdatePrice] = useState(1);
    const [updateQuantity, setUpdateQuantity] = useState(1);
    const [refresh, setRefresh] = useState(true)

    useEffect(() => {
        const getSingleMenu = async () => {
            try {
                const response = await axiosPrivate.get(`/api/foods/${id}`);
                const menu = response.data.menu;
                setMenu(menu);
                setName(menu.name);
                setCategories(menu.categories.map(c => ({ id: c.id, name: c.categoryName })));
                let meals = [];
                for (let key in menu.meals) {
                    const catMeals = menu.meals[key].map(m => ({ catId: m.categoryId, category: key, name: m.mealName, price: m.price,id:m.id }));
                    meals = [...meals, ...catMeals]
                }
                setMeals(meals);
                setLoading(false);
            } catch (err) {
                console.log(err.response.data?.message);
                setLoading(false);
                navigate('/dash/employee/food-management');
            }
        }
        getSingleMenu();
    }, [navigate, axiosPrivate, id, refresh])

    const handleMealSort = () => {

        const sortedMeals = meals.sort(function (a, b) {
            if (a.category < b.category) {
                return -1;
            }
            if (a.category > b.category) {
                return 1;
            }
            return 0;
        });

        setMeals([...sortedMeals])
    }

    const handleFoodDelete = async (id, name) => {
        try {
            await axiosPrivate.delete(`/api/foods/foodDetails/deleteFood?id=${id}`);
            toast.success(`${name} Successfully deleted`);
            setRefresh(!refresh);
        } catch (err) {
            console.log(err);
        }
    }

    const handleFoodUpdate = async (id, name) => {
        try {
            const price = updatePrice < 0 ? 0 : updatePrice;
            const quantity = updateQuantity < 0 ? 0 : updateQuantity;
            await axiosPrivate.put(`/api/foods/foodDetails/updateFood?id=${id}&price=${price}&quantity=${quantity}`);
            toast.success(`${name} Successfully updated`);
            setRefresh(!refresh);
        } catch (err) {
            console.log(err);
        }
    }

    const getUpdateDetails = async (id) => {
        try {
            const response = await axiosPrivate.get(`/api/foods/foodDetails/updateDetails?id=${id}`);
            setUpdatePrice(response.data.details[0].price);
            setUpdateQuantity(response.data.details[0].quantity)
        } catch (err) {
            console.log(err);
        }

    }

    return (
        loading ? (
            <div className='d-flex flex-column gap-2 justify-content-center align-items-center'>
                <Spinner
                    as="span"
                    animation="grow"
                    size="xl"
                    role="status"
                    aria-hidden="true"

                    style={{ marginTop: '300px' }}
                />
                <small>loading...</small>
            </div>
        ) : (
            <>

                <div className='d-flex align-items-center justify-content-between'>
                    <h1>Update {name} Food Menu</h1>
                    <button className='btn btn-primary' onClick={() => navigate(-1)} >Go Back</button>
                </div>
                <hr></hr>

                {/* FORM */}

                <div className='form-group mb-4'>
                    <label className='form-label' htmlFor='menuName' >Menu Name</label>
                    <input type='text' id='menuName' className='form-control' value={name} onChange={e => setName(e.target.value)} disabled />
                </div>

                {/* CATEGORY INFORMATION */}

                {categories[0].name === 'no-category' && (
                    <p><Badge bg='danger'>No categories for this menu</Badge></p>
                )}

                {categories.length > 0 && categories[0].name !== 'no-category' && (
                    <>
                        <label className='mb-2 text-muted' style={{ fontSize: '14px' }}>Categories</label>
                        <div className='mb-4 p-3 shadow d-flex align-items-center gap-3'>
                            {/* <button className='border-0 bg-transparent text-white' ><MdCancel fontSize={18} /></button> */}
                            {categories.map(c => (
                                <Badge key={c.id} bg="warning" className='d-flex align-items-center gap-2' >{c.name}</Badge>
                            ))}
                        </div>
                    </>
                )}

                {meals.length > 0 && (
                    <>
                        <button className='btn btn-primary d-flex align-items-center gap-2' onClick={() => navigate(`/dash/employee/food-management/add?id=${menu.id}&MenuName=${name}`)} style={{ marginLeft: "83%" }}><MdFastfood /> Add New Food item</button>
                        <p className='m-0 my-3 d-flex align-items-center justify-content-between' style={{ fontWeight: 500 }}>Meals Details <button className='btn btn-sm btn-secondary d-flex align-items-center gap-2' onClick={handleMealSort} >sort by category <MdSort fontSize={20} /></button></p>
                        <hr></hr>
                        <Table hover>
                            <thead>
                                <tr>
                                    <th>Meal</th>
                                    <th>Price (USD 1 quantity)</th>
                                    <th>Category</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {meals.map(m => (

                                    <tr>
                                        <td>
                                            {m.name}
                                        </td>
                                        <td>
                                            <p>${m.price}</p>
                                        </td>
                                        <td>
                                            {m.category === 'no-category' ? 'No Category' : m.category}
                                        </td>
                                        <td>
                                            <Popup
                                                trigger={<button className='btn border-0'><MdEditOff size={25} /></button>}
                                                modal
                                                onOpen={() => getUpdateDetails(m.id)}
                                            >
                                                {close => (
                                                    <div className="modal" style={{ display: "contents" }}>
                                                        <button className="close" onClick={close}>
                                                            &times;
                                                        </button>
                                                        <div className="header"> Update {m.name} Food Details</div>
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
                                                            <button className='btn btn-success' onClick={() => handleFoodUpdate(m.id, m.name)}>Update</button>
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
                                                        <div className="header">Are you sure you want to delete {m.name} Food?</div>
                                                        <div className="actions" >
                                                            <button className='btn btn-success' onClick={() => handleFoodDelete(m.id, m.name)}>Delete</button>
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
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </>
                )}
            </>
        )
    );
}

export default FoodUpdate;