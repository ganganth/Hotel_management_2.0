import '../../styles/rate.css'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const Reviews = (props) => {

    const axiosPrivate = useAxiosPrivate();
    const [ratingMessage, setRatingMessage] = useState('');
    const { user } = useSelector(state => state.auth)

    const rateSubmit = async () => {
        try {
            await axiosPrivate.post(`/api/order/AddReview?userId=${user.id}&message=${ratingMessage}`);
            props.setRatePopup(false)
        } catch (err) {
            console.log(err);
        }
    }

    const handleRatingChange = (event) => {
        const rating = event.target.value;
        let message = '';
        switch (rating) {
            case '5':
                message = 'Excellent';
                break;
            case '4':
                message = 'Good';
                break;
            case '3':
                message = 'Average';
                break;
            case '2':
                message = 'Poor';
                break;
            case '1':
                message = 'Bad';
                break;
            default:
                message = '';
        }
        setRatingMessage(message);
    };

    return (
        <div className="card w-50  position-fixed " style={{ marginLeft: "25%", height: "40%", marginTop: "15%", backgroundColor: "white", top: "0", left: "0" }} >
            {/* {props.billPrint ? (
                <>
                    <button type="button" className="btn-close float-end mt-2" aria-label="Close" onClick={() => props.setBillPrint(false)} ></button>
                    <h1 className="text-center">Booking success....</h1>
                    <div className='card-body'>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>Total for rooms</td>
                                    <td>$ {roomT.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Total for foods</td>
                                    <td>$ {foodT.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Total for vehicle</td>
                                    <td>$ {vehicleT.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Total for other events</td>
                                    <td>$ {eventT.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Government  Tax</td>
                                    <td>$ {props.tax.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Discount</td>
                                    <td>$ {props.discount.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>$ {total.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </>

            ) : (
                <> */}
                    <button type="button" className="btn-close float-end mt-2" aria-label="Close" onClick={() => props.setRatePopup(false)} ></button>
                    <h1 className="text-center fs-2 fw-bold">How was quality of our service.</h1>
                    <div className="card-body">
                        <div className="center-container" style={{ height: "30%" }}>
                            <div className="star-rating">
                                <input type="radio" id="5-stars" name="rating" value="5" onChange={handleRatingChange} />
                                <label htmlFor="5-stars" className="star">&#9733;</label>
                                <input type="radio" id="4-stars" name="rating" value="4" onChange={handleRatingChange} />
                                <label htmlFor="4-stars" className="star">&#9733;</label>
                                <input type="radio" id="3-stars" name="rating" value="3" onChange={handleRatingChange} />
                                <label htmlFor="3-stars" className="star">&#9733;</label>
                                <input type="radio" id="2-stars" name="rating" value="2" onChange={handleRatingChange} />
                                <label htmlFor="2-stars" className="star">&#9733;</label>
                                <input type="radio" id="1-stars" name="rating" value="1" onChange={handleRatingChange} />
                                <label htmlFor="1-stars" className="star">&#9733;</label>
                            </div>
                        </div>
                        <div className="mt-2 row">
                            <span className='text-center fs-5 fw-900px'>{ratingMessage}</span>
                        </div>
                        <div className="mt-2 d-flex container" >
                            <button type="button" class="btn btn-link" onClick={() => props.setRatePopup(false)} style={{marginLeft:"35%",color:"orange"}} >Not now</button>
                            <button type="button" class="btn btn-success ml-5" onClick={() => rateSubmit()}>Submit</button>
                        </div>
                    </div>
                {/* </>
            )} */}
        </div>
    );
}

export default Reviews;