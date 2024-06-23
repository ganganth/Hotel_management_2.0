const Reviews = (props) => {
    return (
        <div className="card w-50  position-fixed " style={{ marginLeft: "25%", height: "80%", marginTop: "5%", backgroundColor: "white", top: "0", left: "0" }} >
            <button type="button" className="btn-close float-end mt-2" aria-label="Close" onClick={() => props.setRatePopup(false)} ></button>
            <div className="card-body">
                {/* <div class="star-widget">
                    <input type="radio" name="rate" id="rate-5" />
                    <label for="rate-5" class="fas fa-star" id="r5"></label>
                    <input type="radio" name="rate" id="rate-4" />
                    <label for="rate-4" class="fas fa-star" id="r4"></label>
                    <input type="radio" name="rate" id="rate-3" />
                    <label for="rate-3" class="fas fa-star" id="r3"></label>
                    <input type="radio" name="rate" id="rate-2" />
                    <label for="rate-2" class="fas fa-star" id="r2"></label>
                    <input type="radio" name="rate" id="rate-1" />
                    <label for="rate-1" class="fas fa-star" id="r1"></label>
                </div> */}

            </div>
        </div>
    );
}

export default Reviews;