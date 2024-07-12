
import { useRef } from "react";
import { useReactToPrint } from 'react-to-print'

const Ebill = (props) => {

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        documentTitle: "Reservation payment",
        onBeforePrint: () => console.log("before printing..."),
        onAfterPrint: () => console.log("after printing..."),
        removeAfterPrint: true,
    });
  console.log('mscndcmdn',props.billData);
  console.log(props.billData.length > 0)
    return (
        <div className="card w-50 " style={{ marginLeft: "25%", backgroundColor: "white" }}  >
            <button type="button" className="btn-close float-end mt-2" aria-label="Close" onClick={() => props.setBillPrint(false)} ></button>
            <div ref={contentToPrint}>
                {/* <img src="/img/logo1.jpg" alt="" style={{ width: "100%", height: "200px"}} /> */}
                <h1 className="text-center fs-3 fst-italic fw-100px"> Lakraj Heritage</h1>
                <h1 className="text-center fs-3 fst-italic fw-100px"> 133, Beach Road, Polhena, Matara</h1>
                <h1 className="text-center fs-3 fst-italic fw-100px"> 0412238600</h1>
                <div className='card-body'>
                    <h1 className="text-center fs-3 fw-light">Final bill amount</h1>
                    {Object.keys(props.billData).length > 0 && (
                        <table className="table" style={{width:"80%",marginLeft:"10%"}}>
                            <tbody>
                                <tr>
                                    <td>Total for rooms</td>
                                    <td>$ {props.billData[0].rooms.length > 0 ? (props.billData[0].paymentType === 'full' ? (props.billData[0].rooms[0].total_price * 0.9).toFixed(2) : (props.billData[0].rooms[0].total_price).toFixed(2)) : 0}</td>
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
                                    <td>$ {props.billData[0].tax.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Discount</td>
                                    <td>$ {props.billData[0].discount.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Total</td>
                                    <td>$ {parseFloat(props.billData[0].bookingTotalPrice).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Total paid Amount</td>
                                    <td>$ {parseFloat(props.billData[0].paidTotalPrice).toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td>Total Remain balance</td>
                                    <td>$ {parseFloat(props.billData[0].remainingBalance).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                    <p className="text-center fs-5 fst-italic fw-bold">Thank you for your rersevation!!</p>
                </div>
            </div>
            <button className='btn btn-link mt-2' style={{ marginLeft: "85%" }} onClick={() => { handlePrint(null, () => contentToPrint.current); }}>Print bill</button>
        </div>
    );
}

export default Ebill;