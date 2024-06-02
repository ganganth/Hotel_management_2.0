import "../../styles/footer.css";


const Footer = () => {
    return ( 
    
    <div class="footer">
        <div class="footer-left">
            <img src="/img/logo.jpg" alt="" class="homeimg" style={{ borderRadius: '0px', marginBottom: '10px' }}/>
            <p>Visit our website and place your booking. This section provides you some information about LakRaj and some links for imporatant pages.
            Customers can book rooms and other requirement
            in same platform. So, this is a one stop solution for all your holyday facility needs. Just try it and you will love it.
            </p>
            <h2>Follow Us</h2>
            <div class="socialmedia">
            <a href="https://web.facebook.com/LakrajHeritageHotel133"><img src="/img/facebook.png" alt="" class="homeimg"/></a>
            <a href="https://www.instagram.com/"><img src="/img/insta.png" alt="" class="homeimg"/></a>
            <a href="https://www.twitter.com/"><img src="/img/twitter.png" alt="" class="homeimg"/></a>
            <a href="https://www.linkedin.com"><img src="/img/linkd.jpg" alt="" class="homeimg"/></a>
            </div>
        </div>
        <div class="footer-right">
            <h2>Menu</h2>
            <a href="/home" style={{ color: 'white', fontWeight: 'bold' }}>Home</a><br></br><br></br>
            <a href="/about" style={{ color: 'white', fontWeight: 'bold' }}>About Us</a><br></br><br></br>
            <a href="/contact" style={{ color: 'white', fontWeight: 'bold' }}>Contact Us</a><br></br>
        </div>
        <div class="fagolink">
            <p>© 2024 LakRaj. All Rights Reserved.</p>
        </div>
    </div>

   
    );
}
 
export default Footer;