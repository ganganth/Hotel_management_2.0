import { MdDoubleArrow } from 'react-icons/md';
const VehiclePopUp = (props) => {
    if (!props.trigger) {
        return null;
    }

    return (

        <div className="card w-50  position-fixed " style={{ marginLeft: "25%", height: "40%", marginTop: "15%", backgroundColor: "white", top: "0", left: "0" }} >
            <button type="button" className="btn-close float-end mt-2" aria-label="Close" onClick={() => props.setPopup(false)} ></button>
            <div className="card-body">
                <p className='text-center fw-bold fz-4'>Do you want to added vehicle to th cart ?</p>
                {props.pickupPolicy === 'both' && (
                    <>
                        <p className="text-left mt-2">Select PickUp Policy</p>
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
                    </>
                )}
                <div className='d-flex'>
                    {(props.pickupPolicy === 'delivery' || props.pickUp) && (
                        <>
                            <p className='text-left mt-2'>Pick Up location : </p>
                            <select id='type' className='mx-5 rounded'>
                                <option value='cColombo Air port'>Colombo Air port</option>
                                <option value='Colombo'>Colombo</option>
                                <option value='Kandy'>Kandy</option>
                                <option value='Other place'>Other Place</option>
                            </select>
                        </>
                    )}
                    <button className='btn btn-primary rounded d-flex align-items-center justify-content-center gap-2 position-absolute top-50 start-50' style={{ fontWeight: 400, width: '180px', fontSize: '16px' }} onClick={() => props.vehicleRentFunc(props.vehiclesPD)} >Rent Now <MdDoubleArrow fontSize={23} /></button>
                </div>


            </div>
        </div>

    );
}

export default VehiclePopUp;