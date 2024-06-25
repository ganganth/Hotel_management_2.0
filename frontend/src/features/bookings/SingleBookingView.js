import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Table, Spinner } from 'react-bootstrap';
import moment from 'moment';
import { useReactToPrint } from 'react-to-print'

const SingleBookingView = () => {

    const [booking, setBooking] = useState({});
    const navigate = useNavigate();
    const { bookingId } = useParams();
    const axiosPrivate = useAxiosPrivate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSingleBooking = async () => {
            try {
                const response = await axiosPrivate.get(`/api/rooms/bookings/${bookingId}`);
                setBooking(response.data.booking);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        getSingleBooking();
    }, [axiosPrivate, bookingId, navigate]);

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        documentTitle: "Lakraj all order",
        onBeforePrint: () => console.log("before printing..."),
        onAfterPrint: () => console.log("after printing..."),
        removeAfterPrint: true,
    });

    return (
        <>
            
            <button className='btn btn-primary mt-2' style={{ marginLeft: "85%" }} onClick={() => navigate(-1)}>Go Back</button><br />
            <button className='btn btn-primary mt-2' style={{ marginLeft: "85%" }} onClick={() => {handlePrint(null, () => contentToPrint.current);}}>Print</button>
            <hr></hr>

            <div className='d-flex position-fixed' style={{ width: "100%" }}>
                <div className='col-12' style={{ maxHeight: "600px", overflowY: "scroll" }}>
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

                    {!loading && (
                        <div ref={contentToPrint}>
                            <h3 className='text-center fz-5 fw-900 text-muted' style={{ marginLeft: "0%" }}>Booking No.{bookingId} Details</h3>
                            {booking.bookedRooms.length > 0 && (
                                <div className="card" style={{ width: "95%", marginLeft: "2.5%" }} >
                                    <p className="text-decoration-underline text-center fw-bold fz-4">All room booking details...</p>
                                    <div className="card-body">
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>Room Name</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Description</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {booking.bookedRooms.map(room => (
                                                    <tr key={room.id}>
                                                        <td>{room.name}</td>
                                                        <td>$ {room.paymentType === 'full' ? ((room.booking_price * 0.9) + room.booking_price * 0.05 - room.booking_price * 0.1).toFixed(2) : (room.booking_price + room.booking_price * 0.05 - room.booking_price * 0.1).toFixed(2)}</td>
                                                        <td>{room.booking_quantity}</td>
                                                        <td><p>{`This is ${room.adultOccupation} adult Occupation with ${room.bathroomType} bathroom `} <br /> {`and television type ${room.televisionType} ${room.view} view room.`}</p></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            )}
                            {booking.bookedVehicle.length > 0 && (
                                <div className="card" style={{ width: "95%", marginLeft: "2.5%" }} >
                                    <p className="text-decoration-underline text-center fw-bold fz-4">All Vehicle booking details...</p>
                                    <div className="card-body">
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th> Vehicle Name</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    <th>Description</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {booking.bookedVehicle.map(v => (
                                                    <tr key={v.id}>
                                                        <td>{v.name}</td>
                                                        <td>$ {v.booking_price}</td>
                                                        <td>{v.booking_quantity}</td>
                                                        <td><p>{`This is ${v.fuelType} fuel type. ${v.isAirConditioned === 'yes' ? 'Air Conditioned' : 'not air Conditioned'} vehicle`} <br /> {`and also  ${v.fuelPolicy} fuel policy and ${v.isDriverFree === 'yes' ? 'with driver' : 'without driver'} vehicle.`}</p></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            )}
                            {booking.bookedFood.length > 0 && (
                                <div className="card" style={{ width: "95%", marginLeft: "2.5%" }} >
                                    <p className="text-decoration-underline text-center fw-bold fz-4">All Foods booking details...</p>
                                    <div className="card-body">
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>meal Name</th>
                                                    <th>Price</th>
                                                    <th>Total potions</th>
                                                    <th>Reserve Date</th>
                                                    <th>Meal Type</th>
                                                    <th>Meal Category</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {booking.bookedFood.map(f => (
                                                    <tr key={f.id}>
                                                        <td>{f.mealName}</td>
                                                        <td>$ {f.booking_price}</td>
                                                        <td>{f.booking_quantity}</td>
                                                        <td>{moment(f.reserveDate).utc().format('YYYY-MM-DD')}</td>
                                                        <td>{f.categoryName}</td>
                                                        <td>{f.name}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            )}
                            {booking.bookedEvent.length > 0 && (
                                <div className="card" style={{ width: "95%", marginLeft: "2.5%" }} >
                                    <p className="text-decoration-underline text-center fw-bold fz-4">All event booking details...</p>
                                    <div className="card-body">
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>Event Name</th>
                                                    <th>Price</th>
                                                    <th>Total people</th>
                                                    <th>Reserver Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {booking.bookedEvent.map(e => (
                                                    <tr key={e.id}>
                                                        <td>{e.name}</td>
                                                        <td>$ {e.booking_price}</td>
                                                        <td>{e.booking_quantity}</td>
                                                        <td>{moment(e.reserveDate).utc().format('YYYY-MM-DD')}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>

               
            </div>


        </>
    );
}

export default SingleBookingView;