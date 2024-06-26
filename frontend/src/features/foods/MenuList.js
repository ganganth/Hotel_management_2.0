import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Spinner, Card, Button } from 'react-bootstrap';
import Menu from './Menu';
import moment from 'moment';


const MenuList = (props) => {

    const axiosPrivate = useAxiosPrivate();
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [breakfast, setBreakfast] = useState(false);
    const [lunch, setLunch] = useState(false);
    const [dinner, setDinner] = useState(false);
    const [dayNumber, setDayNumber] = useState('');
    const [menuId, setMenuId] = useState('');
    const [viewMenu, setViewMenu] = useState(false);
    const [createFoodOrder, setCreateFoodOrder] = useState(false)
    const [reservedDate, setReserverDate] = useState({})
    const [mealType, setMealType] = useState('');

    useEffect(() => {
        const getAllMenus = async () => {
            try {
                const response = await axiosPrivate.get('/api/foods');
                console.log(response);
                setMenus(response.data.menus);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        getAllMenus();
    }, [axiosPrivate])

    const getSelected = async (menuType) => {
        try {
            const response = await axiosPrivate.get(`/api/foods/getSingle/${menuType}`);
            console.log(response);
            setMenus(response.data.menus);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const lunchFunc = (id) => {
        setDayNumber(id);
        createDate(id);
        setLunch(true);
        setBreakfast(false);
        setDinner(false);
        setMenus([]);
        getSelected(2);
        setMealType('Lunch');
    }

    const BreakfastFunc = (id) => {
        setDayNumber(id);
        createDate(id);
        setLunch(false);
        setBreakfast(true);
        setDinner(false);
        setMenus([]);
        getSelected(1);
        setMealType('Breakfast');
    }

    const DinnerFunc = (id) => {
        setDayNumber(id);
        createDate(id);
        setLunch(false);
        setBreakfast(false);
        setDinner(true);
        setMenus([]);
        console.log(dayNumber)
        getSelected(3);
        setMealType('Dinner');
    }

    const viewMenuFunc = (id) => {
        setViewMenu(true);
        setMenuId(id)
    }

    const createDate = (dayNumber) => {
        const checkInDate = moment(props.checkInDate);
        const formatReservedDate = checkInDate.add((dayNumber - 1), 'days');
        setReserverDate(formatReservedDate.toDate());
    };

    return (
        <>
            {viewMenu ? (
                <Menu
                    menuId={menuId}
                    setViewMenu={setViewMenu}
                    setCreateFoodOrder={setCreateFoodOrder}
                    reservedDate={reservedDate}
                />
            ) : (
                <>
                    <h1 className='text-center user-select-none mb-4 fz-1' style={{fontSize:"20px"}}>Apply You flavour</h1>
                    <button className='btn btn-primary' style={{ marginLeft: "85%" }} onClick={() => props.setFoodOrder(false)}>Go Back</button>
                    <hr></hr>
                    <div className='card-body '>
                        <div className="row row-cols-1 row-cols-md-3 g-4">
                            <div className="col">
                                {props.totalBreakfast > 0 && (
                                    <div className="card">
                                        <div className='card-body'>
                                            {Array.from(Array(props.totalBreakfast), (e, i) => (
                                                <div className="form-check" key={i}>
                                                    <input className="form-check-input" type="checkbox" value="" id={`defaultCheck${i}`} disabled checked={createFoodOrder && dayNumber === (i + 1) && mealType === 'Breakfast'} />
                                                    <button type="button" className="btn" style={{ paddingTop: "0", paddingBottom: "0" }} data-bs-toggle="button" onClick={() => BreakfastFunc(i + 1)}>Day {i + 1} Breakfast</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="col">
                                {props.totalLunch > 0 && (
                                    <div className="card">
                                        <div className='card-body'>
                                            {Array.from(Array(props.totalLunch), (e, i) => (
                                                <div className="form-check" key={i}>
                                                    <input className="form-check-input" type="checkbox" value="" id={`defaultCheck${i}`} disabled checked={createFoodOrder && dayNumber === (i + 1) && mealType === 'Lunch'} />
                                                    <button type="button" className="btn" style={{ paddingTop: "0", paddingBottom: "0" }} data-bs-toggle="button" onClick={() => lunchFunc(i + 1)}>Day {i + 1} Lunch</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="col">
                                {props.totalDinner > 0 && (
                                    <div className="card">
                                        <div className='card-body'>
                                            {Array.from(Array(props.totalDinner), (e, i) => (
                                                <div className="form-check" key={i}>
                                                    <input className="form-check-input" type="checkbox" value="" id={`defaultCheck${i}`} disabled checked={createFoodOrder && dayNumber === (i + 1) && mealType === 'Dinner'} />
                                                    <button type="button" className="btn" style={{ paddingTop: "0", paddingBottom: "0" }} data-bs-toggle="button" onClick={() => DinnerFunc(i + 1)}>Day {i + 1} Dinner</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {breakfast ? (
                        <>
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

                            {!loading && menus.length > 0 && (
                                <div className='d-flex flex-wrap gap-5'>
                                    {menus.map(menu => (
                                        <Card style={{ width: '20rem' }} key={menu.id} >
                                            <Card.Img variant="top" src={menu.image} width={200} height={200} />
                                            <Card.Body className='d-flex flex-column position-relative' style={{ paddingBottom: '60px' }}>
                                                <Card.Title className="text-center mb-3" style={{ fontSize: '25px', fontWeight: 700 }}>{menu.name}</Card.Title>

                                                <div>
                                                    <p style={{ fontSize: '16px', fontWeight: 500, textDecoration: 'underline' }}>Categories</p>

                                                    {menu.categories.map((cat, index) => (
                                                        <div key={`${menu.id}-${cat.id}`}>
                                                            <div key={index} className='d-flex align-items-center justify-content-between mb-2' >
                                                                <span>{cat.categoryName === 'no-category' ? 'No special category' : cat.categoryName}</span>
                                                                <span className='d-flex align-items-center justify-content-center' style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#333', color: '#fff', fontSize: '12px', fontWeight: 500 }}>{cat.totalMeals}</span>
                                                            </div>
                                                            <hr></hr>
                                                        </div>
                                                    ))}
                                                </div>


                                                <Button
                                                    variant="primary"
                                                    className='mt-3 position-absolute left-0 btn-sm d-block'
                                                    style={{
                                                        top: 'auto',
                                                        bottom: '10px', // Adjust the value as needed
                                                        width: '90%',
                                                        transform: 'translateX(-50%)', // Center horizontally
                                                        left: '50%'
                                                    }}
                                                    onClick={() => viewMenuFunc(menu.id)}
                                                >
                                                    View Menu
                                                </Button>
                                            </Card.Body>
                                        </Card>

                                    ))}
                                </div>
                            )}
                        </>
                    ) : lunch ? (
                        <>
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

                            {!loading && menus.length > 0 && (
                                <div className='d-flex flex-wrap gap-5' >
                                    {menus.map(menu => (
                                        <Card style={{ width: '20rem' }} key={menu.id} >
                                            <Card.Img variant="top" src={menu.image} width={200} height={200} />
                                            <Card.Body className='d-flex flex-column position-relative' style={{ paddingBottom: '60px' }}>
                                                <Card.Title className="text-center mb-3" style={{ fontSize: '25px', fontWeight: 700 }}>{menu.name}</Card.Title>

                                                <div>
                                                    <p style={{ fontSize: '16px', fontWeight: 500, textDecoration: 'underline' }}>Categories</p>

                                                    {menu.categories.map((cat, index) => (
                                                        <div key={`${menu.id}-${cat.id}`}>
                                                            <div key={index} className='d-flex align-items-center justify-content-between mb-2' >
                                                                <span>{cat.categoryName === 'no-category' ? 'No special category' : cat.categoryName}</span>
                                                                <span className='d-flex align-items-center justify-content-center' style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#333', color: '#fff', fontSize: '12px', fontWeight: 500 }}>{cat.totalMeals}</span>
                                                            </div>
                                                            <hr></hr>
                                                        </div>
                                                    ))}
                                                </div>


                                                <Button
                                                    variant="primary"
                                                    className='mt-3 position-absolute left-0 btn-sm d-block'
                                                    style={{
                                                        top: 'auto',
                                                        bottom: '10px', // Adjust the value as needed
                                                        width: '90%',
                                                        transform: 'translateX(-50%)', // Center horizontally
                                                        left: '50%'
                                                    }}
                                                    onClick={() => viewMenuFunc(menu.id)}
                                                >
                                                    View Menu
                                                </Button>
                                            </Card.Body>
                                        </Card>

                                    ))}
                                </div>
                            )}
                        </>
                    ) : dinner ? (
                        <>
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

                            {!loading && menus.length > 0 && (
                                <div className='d-flex flex-wrap gap-5'>
                                    {menus.map(menu => (
                                        <Card style={{ width: '20rem' }} key={menu.id} >
                                            <Card.Img variant="top" src={menu.image} width={200} height={200} />
                                            <Card.Body className='d-flex flex-column position-relative' style={{ paddingBottom: '60px' }}>
                                                <Card.Title className="text-center mb-3" style={{ fontSize: '25px', fontWeight: 700 }}>{menu.name}</Card.Title>

                                                <div>
                                                    <p style={{ fontSize: '16px', fontWeight: 500, textDecoration: 'underline' }}>Categories</p>

                                                    {menu.categories.map((cat, index) => (
                                                        <div key={`${menu.id}-${cat.id}`}>
                                                            <div key={index} className='d-flex align-items-center justify-content-between mb-2' >
                                                                <span>{cat.categoryName === 'no-category' ? 'No special category' : cat.categoryName}</span>
                                                                <span className='d-flex align-items-center justify-content-center' style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#333', color: '#fff', fontSize: '12px', fontWeight: 500 }}>{cat.totalMeals}</span>
                                                            </div>
                                                            <hr></hr>
                                                        </div>
                                                    ))}
                                                </div>


                                                <Button
                                                    variant="primary"
                                                    className='mt-3 position-absolute left-0 btn-sm d-block'
                                                    style={{
                                                        top: 'auto',
                                                        bottom: '10px', // Adjust the value as needed
                                                        width: '90%',
                                                        transform: 'translateX(-50%)', // Center horizontally
                                                        left: '50%'
                                                    }}
                                                    onClick={() => viewMenuFunc(menu.id)}
                                                >
                                                    View Menu
                                                </Button>
                                            </Card.Body>
                                        </Card>

                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <>
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

                            {!loading && menus.length > 0 && (
                                <div className='d-flex flex-wrap gap-5' style={{ pointerEvents: "none", opacity: "0.5" }}>
                                    {menus.map(menu => (
                                        <Card style={{ width: '20rem' }} key={menu.id} >
                                            <Card.Img variant="top" src={menu.image} width={200} height={200} />
                                            <Card.Body className='d-flex flex-column position-relative' style={{ paddingBottom: '60px' }}>
                                                <Card.Title className="text-center mb-3" style={{ fontSize: '25px', fontWeight: 700 }}>{menu.name}</Card.Title>

                                                <div>
                                                    <p style={{ fontSize: '16px', fontWeight: 500, textDecoration: 'underline' }}>Categories</p>

                                                    {menu.categories.map((cat, index) => (
                                                        <div key={`${menu.id}-${cat.id}`}>
                                                            <div key={index} className='d-flex align-items-center justify-content-between mb-2' >
                                                                <span>{cat.categoryName === 'no-category' ? 'No special category' : cat.categoryName}</span>
                                                                <span className='d-flex align-items-center justify-content-center' style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#333', color: '#fff', fontSize: '12px', fontWeight: 500 }}>{cat.totalMeals}</span>
                                                            </div>
                                                            <hr></hr>
                                                        </div>
                                                    ))}
                                                </div>


                                                <Button
                                                    variant="primary"
                                                    className='mt-3 position-absolute left-0 btn-sm d-block'
                                                    style={{
                                                        top: 'auto',
                                                        bottom: '10px', // Adjust the value as needed
                                                        width: '90%',
                                                        transform: 'translateX(-50%)', // Center horizontally
                                                        left: '50%'
                                                    }}
                                                // onClick={() => navigate(`/food-reservation/menu/${menu.id}`)}
                                                >
                                                    View Menu
                                                </Button>
                                            </Card.Body>
                                        </Card>

                                    ))}
                                </div>
                            )}
                        </>
                    )}

                </>
            )}
        </>
    );
}

export default MenuList;