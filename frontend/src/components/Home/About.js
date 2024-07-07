import Header from "./Header";
import Footer from "./Footer";
import "../../styles/home.css";
import { Link } from "react-router-dom";
import AboutDetails from "./AboutDetails";

const About = () => {
  return (
    <div>
      <div className="home-header">
        <Header style={{ position: "absolute" }}></Header>
        <div className="shape">
          <img src="/img/logo1.jpg" alt="" />
        </div>
        <h1>Welcome To</h1>
        <h2>LakRaj</h2>
        <h3>Hotel.</h3>
        <h5>Book your stay and enjoy Luxury</h5>
        <h5>redefined at the most affordable rates.</h5>
        <Link to={"/login"} className="BookNow-btn" style={{ color: 'white', fontWeight: 'bold' }}>
          Book Now
        </Link>
      </div>
      <div className="home-body">
         <AboutDetails 
            
            title={"Book your room today!"} 
            text={"Booking your room today will ensure your accommodation is secured for your desired dates.Lakraj Hotel rooms offer a seamless blend of comfort and sophistication, providing guests with a sanctuary amidst their travels. Each room is meticulously designed to evoke a sense of tranquility, featuring modern amenities and elegant furnishings. From cozy single rooms to spacious suites, every accommodation boasts luxurious touches and thoughtful details to ensure a memorable stay. Whether guests are traveling for business or leisure, they can unwind in style and enjoy the impeccable service and attention to detail that define the Lakraj Hotel experience."}
            url1={"/images/r1.jpeg"}
            url2={"/images/r2.jpeg"}
            url3={"/images/r3.jpeg"}
         />

         <AboutDetails 
            
            title={"Rent a vehicle!"} 
            text={"Renting a vehicle will provide you with the means to conveniently travel and explore your destination.Lakraj Hotel extends its hospitality beyond its luxurious accommodations by offering convenient vehicle rental services to its guests. Whether visitors wish to explore the surrounding area or simply require transportation during their stay, Lakraj Hotel ensures a hassle-free experience. With a diverse fleet of well-maintained vehicles ranging from sleek sedans to spacious SUVs, guests can choose the perfect option to suit their needs. From airport transfers to sightseeing tours, the hotel's reliable rental service ensures comfort, convenience, and peace of mind throughout their journey."}
            url1={"/images/v1.jpeg"}
            url2={"/images/v2.jpeg"}
            url3={"/images/v3.jpeg"}
         />

        <AboutDetails 
           
            title={"Order some foods!"} 
            text={"Ordering some food will satisfy your hunger and provide you with a delicious meal delivered right to your doorstep.Lakraj Hotel transforms dining into an exquisite journey, offering a diverse range of flavors and dishes crafted with the freshest ingredients. From lavish breakfast spreads to gourmet à la carte meals, each dining experience reflects culinary mastery. Whether enjoying a lavish buffet or savoring chef-inspired creations, guests embark on a gastronomic adventure that tantalizes the senses. With impeccable service and a dedication to culinary excellence, Lakraj Hotel redefines unforgettable dining experiences."}
            url1={"/images/f1.jpeg"}
            url2={"/images/f2.jpeg"}
            url3={"/images/f3.jpeg"}
         />

         <AboutDetails 
           
            title={"Join some events!"} 
            text={"Joining some events will allow you to immerse yourself in enriching experiences, connect with like-minded individuals, and create lasting memories.Lakraj Hotel offers a diverse range of special entertainment events, from live music performances to themed parties and cultural showcases. Guests can enjoy wine tastings, cooking classes with renowned chefs, and art exhibitions, creating memorable moments and fostering a sense of community. With a commitment to providing unforgettable experiences, Lakraj Hotel ensures every stay is filled with excitement and delight."}
            url1={"/images/e1.jpeg"}
            url2={"/images/e2.jpeg"}
            url3={"/images/e3.jpeg"}
         />
      </div>
      <div className="home-footer">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default About;
