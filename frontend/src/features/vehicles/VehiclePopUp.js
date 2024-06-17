
const VehiclePopUp = (props) => {
    if (!props.trigger) {
        return null;
    }

    return (

        <div className="card w-50 shadow-none position-fixed " style={{ marginLeft: "25%", height: "50%", marginTop: "10%", backgroundColor: "white", top: "0", left: "0"}} >
            <button type="button" className="btn-close float-end" aria-label="Close" onClick={() => props.setPopup(false)} ></button>
            <div className="card-body">
                <p className="text-center">Select the days reserver the vehicle.</p>
                <div className="d-flex flex-wrap justify-content-between">
                    {Array.from(Array(props.total_days), (e, i) => (
                        <div class="form-check form-check-inline">
                            <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
                        </div>
                    ))}

                </div>
                <p className="text-center mt-5">Select PickUp Policy</p>
                <div className="form-check justify-content-center">
                    <input className="form-check-input ml-25" type="radio" name="flexRadioDefault" id="flexRadioDefault1" value={props.pickUp} onChange={() => props.setPickup(true)} checked={props.pickUp} />
                    <label className="form-check-label user-select-none" title="Includes bed, breakfast and evening meal (no lunch)." for="flexRadioDefault1" style={{ cursor: "pointer" }}>
                        Pick Up
                    </label>
                </div>
                <div className="form-check justify-content-center">
                    <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" value={props.pickUp} checked={!props.pickUp} onChange={() => props.setPickup(false)} />
                    <label className="form-check-label user-select-none" title="Includes bed, breakfast,lunch and evening meal." for="flexRadioDefault2" style={{ cursor: "pointer" }}>
                        Collect the hotel premisses
                    </label>
                </div>
                <button type="button" class="btn btn-primary" onClick={() => props.handleVehicleRent()}>Rent Now</button>
            </div>
        </div>

    );
}

export default VehiclePopUp;