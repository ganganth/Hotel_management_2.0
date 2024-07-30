import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';
import { MdAddCircle } from 'react-icons/md';

const FoodAdd = () => {

    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [searchParams] = useSearchParams();
    const [processing, setProcessing] = useState(false);
    const menuName = searchParams.get('MenuName');
    const [allCategories, setAllCategories] = useState([]);
    const id = searchParams.get(['id']);
    const [category, setCategory] = useState('');
    const [mealName, setMealName] = useState('');
    const [mealPrice, setMealPrice] = useState(1);
    const [maxCount, setMaxCount] = useState(1);

    useEffect(() => {
        const getDetails = async () => {
            try {
                const response = await axiosPrivate.get(`/api/foods/foodCreate/allCategory?id=${id}`);
                setAllCategories(response.data.details);
            } catch (err) {
                console.log(err);
            }
        }
        getDetails();
    }, [axiosPrivate,id]);

    // CREATE NEW MENU
    const handleNewMenuCreation = async () => {
        setProcessing(true);

        try {
            const meal = {
                menuName: menuName,
                categoryName: category,
                mealName: mealName,
                price: mealPrice,
                quantity: maxCount
            };

            await axiosPrivate.post('/api/foods', JSON.stringify(meal));
            toast.success('Menu created');
            setProcessing(false);
        } catch (err) {
            console.log(err);
            setProcessing(false);
            toast.error(err.response.data?.message);
        }


    }

    return (
        <>
            <div className='d-flex align-items-center justify-content-between'>
                <h1>Add New meals for {menuName}</h1>
                <button className='btn btn-primary' onClick={() => navigate(-1)} >Go Back</button>
            </div>
            <hr></hr>

            <div className='form-group mb-4'>
                <label className='form-label' htmlFor='menuName' >Menu Name</label>
                <input type='text' id='menuName' className='form-control' value={menuName}  disabled />
            </div>

            <div className='form-group mb-4'>
                <label className='form-label' htmlFor='menuName' >All categories</label>
                {(allCategories && allCategories.length > 0) && (
                    <select value={allCategories[0].name} onChange={e => setCategory(e.target.value.trim())} >
                        {allCategories.map(c => <option key={c.name} value={c.name} >{c.name}</option>)}
                    </select>
                )}
            </div>

            {/* ADD MEALS */}

            <div className='mb-5'>
                <label className='mb-2 text-muted' style={{ fontSize: '14px' }}>Add new meal</label>
                <div className='p-3 shadow rounded d-flex align-items-center gap-4'>
                    <div className='form-group'>
                        <label className='form-label'>Meal Name</label>
                        <input type='text' value={mealName} onChange={e => setMealName(e.target.value)} />
                    </div>
                    <div className='form-group'>
                        <label className='form-label'>Price (USD 1 qty )</label>
                        <input type='number' min="1" step=".01" value={mealPrice.toString()} onChange={e => setMealPrice(+e.target.value)} />
                    </div>
                    <div className='form-group'>
                        <label className='form-label'>Max quantity per day</label>
                        <input type='number' min="1" step="1" value={maxCount.toString()} onChange={e => setMaxCount(+e.target.value)} />
                    </div>

                </div>
            </div>

            <div className='my-5'>
                <button className='d-flex align-items-center justify-content-center gap-3 w-100 btn btn-dark' onClick={handleNewMenuCreation} >
                    {processing ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            processing...
                        </>
                    ) : (
                        <>
                            <MdAddCircle fontSize={25} /> Add this meal
                        </>
                    )}

                </button>
            </div>
        </>
    );
}

export default FoodAdd;