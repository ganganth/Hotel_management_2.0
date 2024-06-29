
import { useRef } from "react";
import { useReactToPrint } from 'react-to-print'

const Ebill = (props) => {

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        documentTitle: "Lakraj payment receipt",
        onBeforePrint: () => console.log("before printing..."),
        onAfterPrint: () => console.log("after printing..."),
        removeAfterPrint: true,
    });

    return (
        <div className="card w-50  position-fixed " style={{ marginLeft: "25%", marginTop: "5%", backgroundColor: "white", top: "0", left: "0" }}  >
            <button type="button" className="btn-close float-end mt-2" aria-label="Close" onClick={() => props.setBillPrint(false)} ></button>
            <div ref={contentToPrint}>
                <img src="/img/logo1.jpg" alt="" style={{ width: "100%", height: "200px"}} />
                {/* <h1 className="text-center">Booking success....</h1> */}
                <div className='card-body'>

                    {props.billData.length > 0 && (
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>Total for rooms</td>
                                    <td>$ {props.billData.paymentType === 'full' ? ((props.billData.rooms.total_price * 0.9) + props.billData.rooms.total_price * 0.05 - props.billData.rooms.total_price * 0.1).toFixed(2) : (props.billData.rooms.total_price + props.billData.rooms.total_price * 0.05 - props.billData.rooms.total_price * 0.1).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Total for foods</td>
                                    <td>$ (props.billData.foods.total_price + props.billData.foods.total_price * 0.05 - props.billData.foods.total_price * 0.1).toFixed(2)</td>
                                </tr>
                                <tr>
                                    <td>Total for vehicle</td>
                                    <td>$ {(props.billData.vehicle.total_price + props.billData.vehicle.total_price * 0.05 - props.billData.vehicle.total_price * 0.1).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Total for other events</td>
                                    <td>$ {(props.billData.events.total_price + props.billData.events.total_price * 0.05 - props.billData.events.total_price * 0.1).toFixed(2)}</td>
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
                                    <td>Total</td>
                                    <td>$ {props.billData.bookingTotalPrice.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Total paid Amount</td>
                                    <td>$ {props.billData.paidTotalPrice.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Total Remain balance</td>
                                    <td>$ {props.billData.remainingBalance.toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                    
                </div>
            </div>
            <button className='btn btn-link mt-2' style={{ marginLeft: "85%" }} onClick={() => { handlePrint(null, () => contentToPrint.current); }}>Print bill</button>
        </div>
    );
}

export default Ebill;