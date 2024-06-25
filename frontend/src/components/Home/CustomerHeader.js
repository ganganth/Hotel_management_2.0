
import { MdAddShoppingCart, MdArrowDropDown } from "react-icons/md";
import { logoutAuthUser } from "../../app/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

const CustomerHeader = () => {

    const dispatch = useDispatch();
    const [popup, setPopup] = useState(false);
    const { items } = useSelector(state => state.orderCart)

    return (
        <ul className="nav justify-content-end bg-light">

            <li className="nav-item">
                <a className="navbar-text" href="/customerCart" >

                    <MdAddShoppingCart style={{ height: '30px', width: '30px', color: 'black', marginLeft: '10px', marginTop: '2px', marginBottom: '2px' }} />
                    {items.length > 0 && (
                        <span className='position-absolute bg-danger text-white d-flex align-items-center justify-content-center' style={{ top: '0', right: '5%', width: '20px', height: '20px', borderRadius: '50%', fontSize: '12px', fontWeight: 500 }}>{items.length}</span>
                    )}

                </a>
            </li>
            <li className="nav-item">
                {/* <a className="nav-link" onClick={() => setPopup(!popup)}>
                    <MdArrowDropDown style={{ height: '20px', width: '20px', color: 'black', marginLeft: '20px' }} />
                </a> */}
                <button className="nav-link" onClick={() => setPopup(!popup)} style={{ background: 'none', border: 'none', padding: 0 }}>
                    <MdArrowDropDown style={{ height: '20px', width: '20px', color: 'black', marginLeft: '20px' }} />
                </button>

                {popup ? (
                    <div className="list-group" style={{ position: "absolute", top: "1", right: "0" }}>

                        {/* <a href="/profile" className="list-group-item list-group-item-action" >Profile</a>
                        <a href="/my-bookings" className="list-group-item list-group-item-action">My Reservation</a> */}
                        <button onClick={() => window.location.href = '/profile'} className="list-group-item list-group-item-action">Profile</button>
                        <button onClick={() => window.location.href = '/my-bookings'} className="list-group-item list-group-item-action">My Reservation</button>

                        <button onClick={() => { setPopup(false); dispatch(logoutAuthUser()); }} className="list-group-item list-group-item-action">Logout</button>

                    </div>
                ) : (
                    <div></div>
                )}
            </li>


        </ul>
    );
}

export default CustomerHeader;