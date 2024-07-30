import { useState, useEffect, useRef } from 'react';
import moment from "moment";
import { Alert, Table, Badge } from 'react-bootstrap';
import { FaPrint } from "react-icons/fa";
import '../../styles/welcome.css';
import { MdFilterList } from "react-icons/md";
import { useReactToPrint } from 'react-to-print'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { PieChart } from 'react-minimal-pie-chart';
import { FaSearchPlus } from "react-icons/fa";

const Welcome = () => {

    const [filter, setFilter] = useState(false);
    const [allBooking, setAllBooking] = useState([]);
    const axiosPrivate = useAxiosPrivate();
    const [summary, setSummary] = useState([]);
    const [chart1, setChart1] = useState([]);
    const [chart2, setChart2] = useState([]);
    const [paymentType, setPaymentType] = useState('full');
    const [customerType, setCustomerType] = useState('yes');
    const [month, setMonth] = useState(1);
    const [reservationType, setReservationType] = useState('A');
    const [date, setDate] = useState(1);
    const contentToPrint = useRef(null);
    const contentToPrint1 = useRef(null);
    const contentToPrint2 = useRef(null);

    const handlePrint = useReactToPrint({
        documentTitle: "Lakraj all order",
        onBeforePrint: () => console.log("before printing..."),
        onAfterPrint: () => console.log("after printing..."),
        removeAfterPrint: true,
    });

    useEffect(() => {
        const getAllBookings = async () => {
            try {
                const response = await axiosPrivate.get('/api/order/');
                setAllBooking(response.data.booking);
            } catch (err) {
                console.log(err);
            }
        }

        const getSummary = async () => {
            try {
                const response = await axiosPrivate.get('/api/order/summary');
                setSummary(response.data.booking);
                setChart1(response.data.char1);
                setChart2(response.data.char2);
            } catch (err) {
                console.log(err);
            }
        }
        getAllBookings();
        getSummary();
    }, [axiosPrivate, filter]);


    const handleFoodFunc = async () => {
        try {
            console.log("1",chart1)
            const response = await axiosPrivate.get(`/api/order/foodWithDate?date=${date}`);
            setChart1(response.data.booking);
            console.log(response.data.booking)
            console.log("2",chart1)
        } catch (err) {
            console.log(err);
        }
    }

    const handleeventFunc = async () => {
        try {
            setChart2([]);
            const response = await axiosPrivate.get(`/api/order/eventWithDate?date=${date}`);
            setChart2(response.data.booking);
        } catch (err) {
            console.log(err);
        }
    }

    const handleSearchFilter = async () => {
        try {
            const response = await axiosPrivate.get(`/api/order/searchFilter?payment=${paymentType}&customer=${customerType}&month=${month}&reservationType=${reservationType}`);
            setAllBooking(response.data.booking);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="d-flex" >

            <div className='col-8'>

                <div className="row">
                    <div className="col-sm-4">
                        <div className="card" style={{ height: "120px" }}>
                            <div className="card-body">
                                <p className="text-center">Today total booking:</p>
                                <p className="text-center">{(summary && summary.length > 0) ? summary[0].totalBooking : 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="card" style={{ height: "120px" }}>
                            <div className="card-body">
                                <p className="text-center">Today total income:</p>
                                <p className="text-center">$ {(summary && summary.length > 0) ? summary[0].totalPrice : 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="card" style={{ height: "120px" }}>
                            <div className="card-body">
                                <p className="text-center">Today total remain balance:</p>
                                <p className="text-center">$ {(summary && summary.length > 0) ? summary[0].totalRemain : 0}</p>
                            </div>
                        </div>
                    </div>      
                </div>

                <div className='row mt-3 d-flex'>
                    <button style={{ background: 'none', border: 'none', padding: 0, width: 0, marginLeft: "75%" }} onClick={() => { handlePrint(null, () => contentToPrint.current); }}><FaPrint /></button>
                    <button type="button" className="btn btn-primary col-2 align-items-end" style={{ marginLeft: "5%" }} onClick={() => setFilter(!filter)}> <MdFilterList /> Filter</button>
                </div>
                <div ref={contentToPrint}>
                    <div className='row mt-3'>
                        <p className='text-center text-mute fz-4 fw-bold'>Booking Details</p>
                        <hr />
                    </div>

                    <div className='row mt-3' style={{ maxHeight: "600px", overflowY: "auto" }}>
                        {allBooking && allBooking.length > 0 ? (
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Booking ID</th>
                                        <th>Check In Date</th>
                                        <th>Check Out Date</th>
                                        <th>Booked Date</th>
                                        <th>Payment Status</th>
                                        <th>Total Price</th>
                                        <th>Payment Type</th>
                                        <th>Remaining Balance</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allBooking.map(booking => (
                                        <tr key={booking.id}>
                                            <td>{booking.id}</td>
                                            <td>{moment(booking.checkInDate).utc().format('YYYY-MM-DD')}</td>
                                            <td>{moment(booking.checkOutDate).utc().format('YYYY-MM-DD')}</td>
                                            <td>{moment(booking.createdAt).utc().format('YYYY-MM-DD')}</td>
                                            <td>
                                                <div className='d-flex align-items-center justify-content-center'>{booking.isPaid === 'yes' ? (<Badge bg='success'>paid</Badge>) : (<Badge bg='warning'>not completed</Badge>)}</div>
                                            </td>
                                            <td>{booking.totalPrice}</td>
                                            <td>
                                                <div className='d-flex align-items-center justify-content-center'><Badge bg='dark'>{booking.paymentType === 'full' ? 'Full' : 'Half'}</Badge></div>
                                            </td>
                                            <td>{booking.isPaid === 'yes' ? 'No remaining balance' : `$${booking.remainBalance.toFixed(2)}`}</td>

                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <Alert style={{width:"100%"}} variant='info'>No bookings yet</Alert>
                        )}
                    </div>
                </div>
            </div>
            <div className='col-4 ml-5 gap-2'>

                {filter ? (
                    <div style={{ marginLeft: "10%" }}>
                        <div className='row'> <p className='text-center fz-4 fw-bold'>Filter Orders</p></div>
                        <div className='row d-flex mt-5'>
                            <label htmlFor="exampleInputEmail1" className="label col-6" style={{ width: "20" }}>Payment Type :</label>
                            <select className="form-select col-6" aria-label="Default select example" style={{ width: "40%" }} onChange={e => setPaymentType(e.target.value)}>
                                <option value="full">full</option>
                                <option value="half">half</option>
                            </select>
                        </div>
                        <div className='row d-flex mt-5'>
                            <label htmlFor="exampleInputEmail1" className="label col-6" style={{ width: "20" }}>payment Status :</label>
                            <select className="form-select col-6" aria-label="Default select example" style={{ width: "40%" }} onChange={e => setCustomerType(e.target.value)}>
                                <option value="yes">paid</option>
                                <option value="no">Not paid</option>
                            </select>
                        </div>
                        <div className='row d-flex mt-5'>
                            <label htmlFor="exampleInputEmail1" className="label col-6" style={{ width: "20" }} >Month :</label >
                            <select className="form-select col-6" aria-label="Default select example" style={{ width: "40%" }} onChange={e => setMonth(e.target.value)}>
                                <option value="1">January</option>
                                <option value="2">February</option>
                                <option value="3">March</option>
                                <option value="4">April</option>
                                <option value="5">May</option>
                                <option value="6">June</option>
                                <option value="7">July</option>
                                <option value="8">August</option>
                                <option value="9">September</option>
                                <option value="10">October</option>
                                <option value="11">November</option>
                                <option value="12">December</option>
                            </select>
                        </div>
                        <div className='row d-flex mt-5'>
                            <label htmlFor="exampleInputEmail1" className="label col-6" style={{ width: "20" }} >Reservation Type :</label>
                            <select className="form-select col-6" aria-label="Default select example" style={{ width: "40%" }} onChange={e => setReservationType(e.target.value)}>
                                <option value="A">All</option>
                                <option value="R">Rooms </option>
                                <option value="RE">Rooms & event</option>
                                <option value="RF">Rooms & foods</option>
                                <option value="RV">Rooms & vehicle</option>
                                <option value="REF">Rooms & event & food</option>
                                <option value="RFV">Rooms & foods & vehicle</option>
                                <option value="RVE">Rooms & vehicle & event </option>
                            </select>
                        </div>
                        <div className='row mt-5'>
                            <div class="d-grid col-6 mx-auto">
                                <button className="btn btn-primary" type="button" onClick={() => handleSearchFilter()}>Search</button>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div style={{ marginLeft: "10%" }}>
                        <div className='row' style={{ height: "50%" }}>

                            <div className='d-flex'>
                                <label htmlFor="exampleInputEmail1" className="label " style={{ width: "20$" }}>Top five foods :</label>
                                <button style={{ background: 'none', border: 'none', padding: 0, width: 0, marginLeft: "10%" }} onClick={() => { handlePrint(null, () => contentToPrint1.current); }}><FaPrint /></button>
                                <select className="form-select c ml-2 " aria-label="Default select example" style={{ width: "40%", marginLeft: "10%" }} onChange={(e) => setDate(e.target.value)}>
                                    <option value="1">All</option>
                                    <option value="2">Today</option>
                                    <option value="3">Last 7 days.</option>
                                    <option value="4">Last 30 days</option>
                                </select>
                                <button style={{ background: 'none', border: 'none', padding: 0, width: 0, marginLeft: "3%" }} onClick={() => handleFoodFunc()}><FaSearchPlus /></button>
                            </div >
                            <div ref={contentToPrint1}>
                                {chart1 && chart1.length > 0 ? (
                                    <>
                                        <PieChart
                                            data={chart1}
                                            style={{ height: "200px" }}
                                            lineWidth={40}
                                        />

                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {chart1.map((entry) => (
                                                <div key={entry.value} style={{ display: 'flex', alignItems: 'center', margin: 'auto' }}>
                                                    <div style={{ width: '15px', height: '15px', backgroundColor: entry.color }} />
                                                    <span>{entry.title}</span>
                                                </div>
                                            ))}
                                        </div>

                                    </>

                                ) : (
                                    <p className='text-center fs-3'>No data found</p>
                                )}
                            </div>

                        </div>
                        <div className='row' style={{ height: "50%" }}>
                            <div className='d-flex'>
                                <label htmlFor="exampleInputEmail1" className="label " style={{ width: "20$" }}>Top five events :</label>
                                <button style={{ background: 'none', border: 'none', padding: 0, width: 0, marginLeft: "10%" }} onClick={() => { handlePrint(null, () => contentToPrint2.current); }}><FaPrint /></button>
                                <select className="form-select c ml-2 " aria-label="Default select example" style={{ width: "40%", marginLeft: "10%" }} onChange={(e) => setDate(e.target.value)}>
                                    <option value="1">All</option>
                                    <option value="2">Today</option>
                                    <option value="3">Last 7 days.</option>
                                    <option value="4">Last 30 days</option>
                                </select>
                                <button style={{ background: 'none', border: 'none', padding: 0, width: 0, marginLeft: "3%" }} onClick={() => handleeventFunc()}> <FaSearchPlus /> </button>
                            </div>
                            <div ref={contentToPrint2}>

                                {chart2 && chart2.length > 0 ? (
                                    <>
                                        <PieChart
                                            data={chart2}
                                            style={{ height: "200px" }}
                                            lineWidth={40}
                                        />

                                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                            {chart2.map((entry1) => (
                                                <div key={entry1.value} style={{ display: 'flex', alignItems: 'center', margin: 'auto' }}>
                                                    <div style={{ width: '15px', height: '15px', backgroundColor: entry1.color, marginRight: '5px' }} />
                                                    <span>{entry1.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>

                                ) : (
                                    <p className='text-center fs-3'>No data found</p>
                                )}

                            </div>
                        </div>
                    </div>
                )}
            </div >

        </div >
    );
}

export default Welcome;