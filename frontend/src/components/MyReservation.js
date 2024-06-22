import { useNavigate } from 'react-router-dom';

const MyReservation = () => {
    const navigate = useNavigate();
    return (
        <div className="container-fluid">
            <p className="fs-4 fw-500" style={{ marginLeft: "20%" }}>My Reservation </p>
            <button className='btn btn-primary' style={{ marginLeft: "20%" }} onClick={() => navigate(-1)}>Go Back</button>
            <hr></hr>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Order Id</th>
                        <th scope="col">Order Date</th>
                        <th scope="col">Order State</th>

                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td><button type="button" className="btn btn-danger">Delete</button></td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td><button type="button" className="btn btn-danger">Delete</button></td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td colspan="2">Larry the Bird</td>
                        <td><button type="button" className="btn btn-danger">Delete</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default MyReservation;