import Header from "./Header";
import Footer from "./Footer";
import "../../styles/home.css";
import { Link } from 'react-router-dom';

const Contact = () => {
    return (
    <div>
        <div className="home-header">
            <Header style={{ position: "absolute" }}></Header>
            <div className="shape">
                <img src="/img/logo.jpg" alt="" />
            </div>
            <h1>Welcome To</h1>
            <h2>LakRaj</h2>
            <h3>Hotel.</h3>
            <h5>Book your stay and enjoy Luxury</h5>
            <h5>redefined at the most affordable rates.</h5>
            <Link to={'/login'} className="BookNow-btn" style={{ color: 'white', fontWeight: 'bold' }}>Book Now</Link>
        </div>
        <div className="home-body" style={{height:"1100px"}}>
            <h1 style={{textAlign:"center",userSelect:"none", fontSize:"36px"}}>WE ARE HERE FOR YOU</h1>
            <p style={{textAlign:"center",userSelect:"none", fontSize:"20px"}}>At LakRaj Hotel, we take our customers seriously. Do you have any enquiries, compaints or requests, 
             please forward it to our support desk and we will get back to you as soon as possible.</p>
            <div className="contact-details">
                <div className="contact-details-left">
                     <p style={{marginTop:"15%"}}>Lakshan's (Pvt) Ltd 133, Beach Road,<br /> Polhena.<br/> Matara.</p>
                     <p>Tel: + 94 (041) 2238600</p>
                     <p>Email: info@lakrajheritage.com</p>
                </div>
                <div className="contact-details-right">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3968.4281290450995!2d80.51817117447754!3d5.935572629717254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae13ee79c27c91f%3A0x50c4f3d687eda9c1!2sLakraj%20Heritage!5e0!3m2!1sen!2slk!4v1713843900527!5m2!1sen!2slk" 
                        width="600" 
                        height="450" 
                        style={{border:0,marginLeft:"10%"}} 
                        allowfullscreen="" 
                        loading="lazy" 
                        referrerpolicy="no-referrer-when-downgrade"
                        title="Lakraj Heritage Map">
                    </iframe>
                </div>
            </div>

            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Name</label>
                <input type="email" class="form-control" id="exampleFormControlInput1" />
            </div>
            <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Email address</label>
                <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com"/>
            </div>
            <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">Message</label>
                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
            </div>
            <div class="mb-3">
                <button class="btn btn-primary" type="submit">Submit form</button>
            </div>

        </div>
        <div className="home-footer">
            <Footer></Footer>
        </div>
    </div>
    );
}

export default Contact;