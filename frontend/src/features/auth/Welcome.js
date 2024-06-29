import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FaPrint } from "react-icons/fa";
import '../../styles/welcome.css';
import { MdFilterList } from "react-icons/md";
import { useReactToPrint } from 'react-to-print'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const Welcome = () => {

    const [filter, setFilter] = useState(false);

    const contentToPrint = useRef(null);
    const contentToPrint1 = useRef(null);
    const contentToPrint2 = useRef(null);
    const handlePrint = useReactToPrint({
        documentTitle: "Lakraj all order",
        onBeforePrint: () => console.log("before printing..."),
        onAfterPrint: () => console.log("after printing..."),
        removeAfterPrint: true,
    });

    return (
        <div className="container d-flex">

            <div className='col-8'>

                <div className="row">
                    <div className="col-sm-4">
                        <div className="card" style={{ height: "120px" }}>
                            <div className="card-body">
                                <p className="text-center">Today total booking:</p>
                                <p className="text-center">12</p>

                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="card" style={{ height: "120px" }}>
                            <div className="card-body">
                                <p className="text-center">Today total income:</p>
                                <p className="text-center">$ 45</p>

                            </div>
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <div className="card" style={{ height: "120px" }}>
                            <div className="card-body">
                                <p className="text-center">Today total number of customer:</p>
                                <p className="text-center">4</p>

                            </div>
                        </div>
                    </div>
                </div>

                <div className='row mt-3 d-flex'>
                    <select className="form-select col-3 ml-2 align-items-start" aria-label="Default select example" style={{ width: "20%" }}>
                        <option selected>Today</option>
                        <option value="1">Last 7 days.</option>
                        <option value="2">Last 30 days</option>
                        <option value="3">All</option>
                    </select>
                    <button style={{ background: 'none', border: 'none', padding: 0, width: 0, marginLeft: "55%" }} onClick={() => { handlePrint(null, () => contentToPrint.current); }}><FaPrint /></button>
                    <button type="button" className="btn btn-primary col-2 align-items-end" style={{ marginLeft: "5%" }} onClick={() => setFilter(!filter)}> <MdFilterList /> Filter</button>
                </div>
                <div ref={contentToPrint}>
                    <div className='row mt-3'>
                        <p className='text-center text-mute fz-4 fw-bold'>Booking Details</p>
                    </div>

                    <div className='row mt-3' style={{ maxHeight: "600px", overflowY: "auto" }}>
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">Order Id</th>
                                    <th scope="col">Order Date</th>
                                    <th scope="col">Order State</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td><button type="button" className="btn btn-danger">Delete</button></td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td><button type="button" className="btn btn-danger">Delete</button></td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td colSpan="2">Larry the Bird</td>
                                    <td><button type="button" className="btn btn-danger">Delete</button></td>
                                </tr>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td><button type="button" className="btn btn-danger">Delete</button></td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td><button type="button" className="btn btn-danger">Delete</button></td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td colSpan="2">Larry the Bird</td>
                                    <td><button type="button" className="btn btn-danger">Delete</button></td>
                                </tr>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td><button type="button" className="btn btn-danger">Delete</button></td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td><button type="button" className="btn btn-danger">Delete</button></td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td colSpan="2">Larry the Bird</td>
                                    <td><button type="button" className="btn btn-danger">Delete</button></td>
                                </tr>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td><button type="button" className="btn btn-danger">Delete</button></td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td><button type="button" className="btn btn-danger">Delete</button></td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td colSpan="2">Larry the Bird</td>
                                    <td><button type="button" className="btn btn-danger">Delete</button></td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className='col-4 ml-5 gap-2'>

                {filter ? (
                    <div style={{ marginLeft: "10%" }}>
                        <div className='row'> <p className='text-center fz-4 fw-bold'>Filter Orders</p></div>
                        <div className='row d-flex mt-5'>
                            <label htmlFor="exampleInputEmail1" className="label col-6" style={{ width: "20" }}>Payment Status :</label>
                            <select className="form-select col-6" aria-label="Default select example" style={{ width: "40%" }}>
                                <option value="1">full</option>
                                <option value="2">half</option>
                            </select>
                        </div>
                        <div className='row d-flex mt-5'>
                            <label htmlFor="exampleInputEmail1" className="label col-6" style={{ width: "20" }}>Customer Type :</label>
                            <select className="form-select col-6" aria-label="Default select example" style={{ width: "40%" }}>
                                <option value="1">Foreign</option>
                                <option value="2">Local</option>
                            </select>
                        </div>
                        <div className='row d-flex mt-5'>
                            <label htmlFor="exampleInputEmail1" className="label col-6" style={{ width: "20" }}>Month :</label>
                            <select className="form-select col-6" aria-label="Default select example" style={{ width: "40%" }}>
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
                            <label htmlFor="exampleInputEmail1" className="label col-6" style={{ width: "20" }}>Reservation Type :</label>
                            <select className="form-select col-6" aria-label="Default select example" style={{ width: "40%" }}>
                                <option value="1">All</option>
                                <option value="2">Rooms & event</option>
                                <option value="3">Rooms & foods</option>
                                <option value="4">Rooms & vehicle</option>
                                <option value="5">Rooms & event & foods</option>
                                <option value="6">Rooms & event & vehicle</option>
                                <option value="7">Rooms & foods & vehicle</option>
                            </select>
                        </div>
                        <div className='row mt-5'>
                            <div class="d-grid col-6 mx-auto">
                                <button className="btn btn-primary" type="button">Search</button>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div style={{ marginLeft: "10%" }}>
                        <div className='row' style={{ height: "50%" }}>

                            <div className='d-flex'>
                                <label htmlFor="exampleInputEmail1" className="label " style={{ width: "20$" }}>Top five foods :</label>
                                <button style={{ background: 'none', border: 'none', padding: 0, width: 0, marginLeft: "25%" }} onClick={() => { handlePrint(null, () => contentToPrint1.current); }}><FaPrint /></button>
                                <select className="form-select c ml-2 " aria-label="Default select example" style={{ width: "40%", marginLeft: "10%" }}>
                                    <option selected>Today</option>
                                    <option value="1">Last 7 days.</option>
                                    <option value="2">Last 30 days</option>
                                    <option value="3">All</option>
                                </select>
                            </div >
                            <div ref={contentToPrint1}>
                                <h1>chart 1</h1>
                            </div>

                        </div>
                        <div className='row' style={{ height: "50%" }}>
                            <div className='d-flex'>
                                <label htmlFor="exampleInputEmail1" className="label " style={{ width: "20$" }}>Top five events :</label>
                                <button style={{ background: 'none', border: 'none', padding: 0, width: 0, marginLeft: "25%" }} onClick={() => { handlePrint(null, () => contentToPrint2.current); }}><FaPrint /></button>
                                <select className="form-select c ml-2 " aria-label="Default select example" style={{ width: "40%", marginLeft: "10%" }}>
                                    <option selected>Today</option>
                                    <option value="1">Last 7 days.</option>
                                    <option value="2">Last 30 days</option>
                                    <option value="3">All</option>
                                </select>
                            </div>
                            <div ref={contentToPrint2}>

                                <div className='anl-pie-chart-container'>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            {/* <Pie data={data} innerRadius={60} outerRadius={100} fill='#ccc' paddingAngle={5} dataKey='value' label={{ fill: 'black', fontSize: 13 }} onClick={handlePieClick}>
                                                {data.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} /> */}
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                            </div>
                        </div>
                    </div>
                )
                }

            </div >

        </div >
    );
}

export default Welcome;