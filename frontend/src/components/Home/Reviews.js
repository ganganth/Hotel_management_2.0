import '../../styles/rate.css'
const Reviews = (props) => {
    return (
        <div className="card w-50  position-fixed " style={{ marginLeft: "25%", height: "40%", marginTop: "15%", backgroundColor: "white", top: "0", left: "0" }} >
            {props.billPrint ? (
                <>
                    <button type="button" className="btn-close float-end mt-2" aria-label="Close" onClick={() => props.setBillPrint(false)} ></button>
                    <h1 className="text-center">Booking success....</h1>
                    <div className='card-body'>
                        {/* <table className="table">
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
                        </table> */}
                    </div>
                </>

            ) : (
                <>
                    <button type="button" className="btn-close float-end mt-2" aria-label="Close" onClick={() => props.setRatePopup(false)} ></button>
                    <h1 className="text-center">Rate Us.</h1>
                    <div className="card-body">
                        <div className="center-container">
                            <div className="star-rating">
                                <input type="radio" id="5-stars" name="rating" value="5" />
                                <label htmlFor="5-stars" className="star">&#9733;</label>
                                <input type="radio" id="4-stars" name="rating" value="4" />
                                <label htmlFor="4-stars" className="star">&#9733;</label>
                                <input type="radio" id="3-stars" name="rating" value="3" />
                                <label htmlFor="3-stars" className="star">&#9733;</label>
                                <input type="radio" id="2-stars" name="rating" value="2" />
                                <label htmlFor="2-stars" className="star">&#9733;</label>
                                <input type="radio" id="1-stars" name="rating" value="1" />
                                <label htmlFor="1-stars" className="star">&#9733;</label>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Reviews;