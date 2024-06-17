import EventCard from './components/EventCard';

const CommonEvents = (props) => {

    return (
        <>

            <p className="text-center user-select-none" style={{ fontSize: '20px', fontWeight: 600 }}>Common Events</p>
            <button className='btn btn-primary ' style={{marginLeft:"85%"}} onClick={() => props.setCommon(false)} >Go Back</button>
            <hr></hr>

            {props.commonEvents.length > 0 && (
                <div className='d-flex flex-wrap justify-content-between'>
                    {props.commonEvents.map(event => (
                        <EventCard event={event} key={event.id} />
                    ))}
                </div>
            )}
            
        </>
    );
}

export default CommonEvents;