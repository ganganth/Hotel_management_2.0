import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button } from 'react-bootstrap';
// import { addEventToCart } from '../../../app/eventCart/eventSlice';
import { toast } from 'react-toastify';
import { addItemToCart } from '../../../app/ordersCart/orderCartSlice';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';

const EventCard = (props) => {

    const dispatch = useDispatch();
    const [qty, setQty] = useState(1);
    const [total_people, setTotal_people] = useState(1);
    const { items } = useSelector(state => state.orderCart)
    const axiosPrivate = useAxiosPrivate();

    const decreaseQty = () => {

        if (qty === 1) return;
        setQty(prev => prev - 1);
    }

    const increaseQty = () => {
        if (qty >= props.event.maxQuantity) {
            toast.warning(`Your are added maximum number of ${props.event.name} in the cart`)
        }
        else {
            console.log("djchbsdhcb")
            console.log(qty)
            setQty(prev => prev + 1);
            console.log(qty)
        }

    }

    const getAvailableEventCount = async () => {
        try {
            const response = await axiosPrivate.get(`/api/events/booking/eventItemOrder/?eventId=${props.event.id}&reservedDate=${props.reservedDate}`);

            if (response && response.data) {
                return response.data.count;
            } else {
                console.error('API response is missing data.');
                return null;
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            return null;
        }
    }

    const handleAddEventToCart = async () => {

        const availableCount = await getAvailableEventCount();
        if (availableCount === null) {
            toast.error('Failed to fetch available food count');
            return;
        }
        console.log(availableCount)
        // const isFound = items.find(i =>
        //     i.reservationType === 'events'
        //     && i.id === props.event.id
        //     && (i.people + qty) > availableCount
        //     && new Date(i.reservedDate).getTime() === new Date(props.reservedDate).getTime()
        // );
        // console.log(isFound)
        const isFound = items.find(i => {
            console.log('Checking item:', i);
            const isReservationTypeMatch = i.reservationType === 'events';
            console.log('Reservation type match:', isReservationTypeMatch);
        
            const isIdMatch = i.id === props.event.id;
            console.log('ID match:', isIdMatch);
        
            const isPeopleCountConditionMet = (i.people + qty) > availableCount;
            console.log('People count condition met:', isPeopleCountConditionMet);
        
            const isDateMatch = new Date(i.reservedDate).getTime() === new Date(props.reservedDate).getTime();
            console.log('Date match:', isDateMatch);
        
            return isReservationTypeMatch && isIdMatch && isPeopleCountConditionMet && isDateMatch;
        });
        
        console.log('Found item:', isFound);
        

        if (isFound) {
            toast.warning(`Maximum number of ${props.event.name} Orders reserved In ${props.reservedDate}`)
        }
        else {
            setTotal_people(qty);

            const total_people_found = items.filter(i => i.reservationType === 'events' && i.id === props.event.id && new Date(i.reservedDate).getTime() === new Date(props.reservedDate).getTime())
            console.log("1",total_people)
            if (total_people_found.length > 0) {
                const total_people_from_reservations = total_people_found.reduce((sum, current) => sum + current.people, 0);
                 setTotal_people(total_people_from_reservations + qty);
                 console.log("2",total_people)
            }
            console.log("3",total_people)
            const e = {
                id: props.event.id,
                image: props.event.image,
                people: total_people,
                name: props.event.name,
                type: props.event.type,
                price: props.event.price,
                quantity: 1,
                reservationType: 'events',
                Total_price: qty * props.event.price,
                reservedDate: props.reservedDate,
                description: `This is ${props.event.name} with ${total_people} peoples Added for the ${new Date(props.reservedDate)}.`
            }
            dispatch(addItemToCart(e));
            toast.success(`${props.event.name} added to the cart`);

        }
    }

    return (
        <div className="p-3 rounded">
            <Card style={{ width: '18rem', height: "500px" }}>
                <Card.Img variant="top" src={props.event.image} style={{ height: "200px" }} />
                <Card.Body>
                    <Card.Title className='mb-4'>{props.event.name}</Card.Title>
                    <div className='d-flex flex-column mb-3'>
                        <label style={{ fontSize: '14px', fontWeight: 500 }}>Price (per person)</label>
                        <span style={{ fontSize: '22px', fontWeight: 500 }}>${props.event.price}</span>
                    </div>
                    <p className='m-0 mb-1' style={{ fontSize: '14px' }}>Total People</p>
                    <div style={{ flex: 1, fontSize: '14px' }} className="d-flex align-items-center" >
                        <button style={{ padding: '5px 10px', border: '1px solid #333' }} onClick={decreaseQty} disabled={qty === 1} >-</button>
                        <span style={{ padding: '5px 10px', borderTop: '1px solid #333', borderBottom: '1px solid #333' }}>{qty}</span>
                        <button style={{ padding: '5px 10px', border: '1px solid #333' }} onClick={increaseQty}>+</button>
                    </div>
                    <Button variant="primary" className='mt-3' onClick={handleAddEventToCart} >Add to event cart</Button>
                </Card.Body>
            </Card>
        </div>
    );
}

export default EventCard;