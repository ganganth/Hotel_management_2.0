import EventCard from './components/EventCard';
const SpecialEvents = (props) => {

    return (
        <>
            
            <p className="text-center user-select-none" style={{ fontSize: '20px', fontWeight: 600 }}>Special Events</p>
            <button className='btn btn-primary ' style={{marginLeft:"85%"}} onClick={() => props.setSpecial(false)} >Go Back</button>
            <hr></hr>

            {props.specialEvents.length > 0 && (
                <div className='d-flex flex-wrap justify-content-between'>
                    {props.specialEvents.map(event => (
                        <EventCard event={event} key={event.id} />
                    ))}
                </div>
            )}
            
        </>
    );
}

export default SpecialEvents;