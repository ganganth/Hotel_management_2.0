import { AiFillDelete } from "react-icons/ai";

const CustomerCartCard = (props) => {
    return (
        <div className="card shadow-none" style={{ width: "90%", marginLeft: "5%" }}>
            <div className="card-body" >
                <>
                    <h5 className="card-title text-reset fs-5">{props.title}</h5>

                    {props.data.map(d => (
                        <div className="card" style={{ width: "95%", marginLeft: "2.5%" }} key={d.id}>
                            <div className="card-body">
                                <div className='d-flex'>
                                    <div className='col-2'>
                                        <img src = {d.image} alt = {d.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                    </div>
                                    <div className='col-6'>
                                        <p className="justify-content-between text-center fs-8">{d.description}</p>
                                    </div>
                                    <div className='col-3'>
                                        <table className="table">
                                            <tbody>
                                                <tr>
                                                    <td>Total Quantity :</td>
                                                    <td>{d.quantity}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total cost :</td>
                                                    <td>$ {d.Total_price.toFixed(2)}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                    <div className='col-1'>
                                        <button className='btn btn-outline-none ms-3 mt-3' onClick={() => props.handleDelete(d)}><AiFillDelete /></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </>

            </div>
        </div>
    );
}

export default CustomerCartCard;