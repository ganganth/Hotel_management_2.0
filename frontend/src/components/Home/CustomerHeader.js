
import { MdAddShoppingCart, MdArrowDropDown } from "react-icons/md";
import { logoutAuthUser } from "../../app/auth/authSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";

const CustomerHeader = () => {

    const dispatch = useDispatch();
    const [popup, setPopup] = useState(false);
    
    return (
        <ul className="nav justify-content-end bg-light">

            <li className="nav-item">
                <a className="navbar-text" href="/customerCart" >

                    <MdAddShoppingCart style={{ height: '30px', width: '30px', color: 'black', marginLeft: '10px', marginTop: '2px', marginBottom: '2px' }} />

                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link" onClick={() => setPopup(!popup)}>
                    <MdArrowDropDown style={{ height: '20px', width: '20px', color: 'black', marginLeft: '20px' }} />
                </a>
                {popup ? (
                    <div className="list-group" style={{ position: "absolute", top: "1", right: "0" }}>

                        <a href="/profile" className="list-group-item list-group-item-action" >Profile</a>
                        <a href="/myReservation" className="list-group-item list-group-item-action">My Reservation</a>
                        <a onClick={() => { setPopup(false); dispatch(logoutAuthUser()); }} className="list-group-item list-group-item-action">Logout</a>

                    </div>
                ) : (
                    <div></div>
                )}
            </li>


        </ul>
    );
}

export default CustomerHeader;