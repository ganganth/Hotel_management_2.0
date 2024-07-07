
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
  console.log('mscndcmdn',props.billData);
  console.log(props.billData.length > 0)
    return (
        <div className="card w-50  position-fixed " style={{ marginLeft: "25%", marginTop: "5%", backgroundColor: "white", top: "0", left: "0" }}  >
            <button type="button" className="btn-close float-end mt-2" aria-label="Close" onClick={() => props.setBillPrint(false)} ></button>
            <div ref={contentToPrint}>
                <img src="/img/logo1.jpg" alt="" style={{ width: "100%", height: "200px"}} />
                {/* <h1 className="text-center">Booking success....</h1> */}
                <div className='card-body'>

                    {Object.keys(props.billData).length > 0 && (
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>Total for rooms</td>
                                    <td>$ {props.billData[0].rooms.length > 0 ? (props.billData[0].paymentType === 'full' ? ((props.billData[0].rooms[0].total_price * 0.9) + props.billData[0].rooms[0].total_price * 0.05 - props.billData[0].rooms[0].total_price * 0.1).toFixed(2) : (props.billData[0].rooms[0].total_price + props.billData[0].rooms[0].total_price * 0.05 - props.billData[0].rooms[0].total_price * 0.1).toFixed(2)) : 0}</td>
                                </tr>
                                <tr>
                                    <td>Total for foods</td>
                                    <td>$ {props.billData[0].foods.length > 0 ? (props.billData[0].foods[0].total_price + props.billData[0].foods[0].total_price * 0.05 - props.billData[0].foods[0].total_price * 0.1).toFixed(2) : 0}</td>
                                </tr>
                                <tr>
                                    <td>Total for vehicle</td>
                                    <td>$ {props.billData[0].vehicle.length > 0 ?(props.billData[0].vehicle[0].total_price + props.billData[0].vehicle[0].total_price * 0.05 - props.billData[0].vehicle[0].total_price * 0.1).toFixed(2) : 0}</td>
                                </tr>
                                <tr>
                                    <td>Total for other events</td>
                                    <td>$ {props.billData[0].events.length > 0 ? (props.billData[0].events[0].total_price + props.billData[0].events[0].total_price * 0.05 - props.billData[0].events[0].total_price * 0.1).toFixed(2) : 0}</td>
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
                                    <td>$ {parseFloat(props.billData[0].bookingTotalPrice).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Total paid Amount</td>
                                    <td>$ {parseFloat(props.billData[0].paidTotalPrice.toFixed(2))}</td>
                                </tr>
                                <tr>
                                    <td>Total Remain balance</td>
                                    <td>$ {parseFloat(props.billData[0].remainingBalance.toFixed(2))}</td>
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