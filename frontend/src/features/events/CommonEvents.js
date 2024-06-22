import EventCard from './components/EventCard';
import { useState } from 'react';
import moment from 'moment';

const CommonEvents = (props) => {
   
    const[dayNumber,setDayNumber] =useState('');
    const [reservedDate, setReserverDate] = useState({});

    const commonEventsFunc = (dayNumber) => {
        setDayNumber(dayNumber)
        const checkInDate = moment(props.checkInDate); 
        const formatReservedDate = checkInDate.add((dayNumber-1), 'days');
        setReserverDate(formatReservedDate.toDate()); 
    }

    return (
        <>

            <p className="text-center user-select-none" style={{ fontSize: '20px', fontWeight: 600 }}>Common Events</p>
            <button className='btn btn-primary ' style={{ marginLeft: "85%" }} onClick={() => props.setCommon(false)} >Go Back</button>
            <hr></hr>

            <div className="col">
                {props.total_days > 0 && (
                    <div className="card mt-3">
                        <div className='card-body'>
                            {Array.from(Array(props.total_days), (e, i) => (
                                <div className="form-check" key={i}>
                                    <input className="form-check-input" type="checkbox" value="" id={`defaultCheck${i}`} disabled  />
                                    <button type="button" class="btn" style={{ paddingTop: "0", paddingBottom: "0" }} data-bs-toggle="button" onClick={() => commonEventsFunc(i + 1)}>Day {i + 1} </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            

            {props.commonEvents.length > 0 && (
                <div className='d-flex flex-wrap justify-content-between' style={!dayNumber ? { pointerEvents: "none", opacity: "0.5" } : {}}>
                    {props.commonEvents.map(event => (
                        <EventCard event={event} key={event.id} reservedDate={reservedDate} />
                    ))}
                </div>
            )}

        </>
    );
}

export default CommonEvents;