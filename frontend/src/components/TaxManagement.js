import { MdEditOff, MdDeleteForever } from 'react-icons/md';
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { toast } from 'react-toastify';

const TaxManagement = () => {

    const axiosPrivate = useAxiosPrivate();
    const [details, setDetails] = useState([]);

    useEffect(() => {
        const getDetails = async () => {
            try {
                const response = await axiosPrivate.get('/api/order/taxDetails');
                // Initialize the rate field in the details state
                const initialDetails = response.data.rates.map(detail => ({ ...detail, rate: detail.rates }));
                setDetails(initialDetails);
            } catch (err) {
                console.log(err);
            }
        }
        getDetails();
    }, [axiosPrivate]);

    const handleUpdate = async (id, description) => {
        try {
            const detail = details.find(d => d.id === id);
            await axiosPrivate.put(`/api/order/taxUpdate?id=${id}&rate=${detail.rate}`);
            toast.success(`${description} Successfully updated`);
        } catch (err) {
            console.log(err);
        }
    }

    const handleDelete = async (id, description) => {
        try {
            await axiosPrivate.delete(`/api/order/taxDelete?id=${id}`);
            toast.success(`${description} Successfully deleted`);
        } catch (err) {
            console.log(err);
        }
    }

    const handleRateChange = (id, newRate) => {
        setDetails(details.map(d => d.id === id ? { ...d, rate: newRate } : d));
    }

    return (
        <div className="container">
            <h1 className="d-grid text-center fs-3 fw-bold">Tax & discount rate details</h1>
            {/* <button className='btn btn-primary d-flex align-items-center gap-2'><MdOutlineEditCalendar /> Add new rate</button> */}
            {details && details.length > 0 ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Description</th>
                            <th scope="col">Rates</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {details.map(d => (
                            <tr key={d.id}>
                                <td>{d.discription}</td>
                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={d.rate}
                                        onChange={e => handleRateChange(d.id, e.target.value)}
                                    />
                                </td>
                                <td><button className='btn border-0' onClick={() => handleUpdate(d.id, d.discription)} ><MdEditOff size={25} /></button></td>
                                <td><button className='btn border-0 text-danger' onClick={() => handleDelete(d.id, d.discription)}><MdDeleteForever size={25} /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className='text-center fs-3'>No details Found</p>
            )}
        </div>
    );
}

export default TaxManagement;
