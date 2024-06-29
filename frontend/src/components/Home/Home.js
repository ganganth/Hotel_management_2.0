import Header from "./Header";
import Footer from "./Footer";
import "../../styles/home.css";
import {Link} from 'react-router-dom';

const Home = () => {
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
        <Link to={'/login'} className="BookNow-btn" style={{ color: 'white', fontWeight: 'bold' }}>Book Now</Link>
      </div>
      <div className="home-body">
        <h1 className="welcomeStatement">Welcome To LakRaj Heritage</h1>
        <div className="home-body-content">
          <div className="home-body-content-left">
            <p>Welcome to Lakraj Heritage where the energy of the Indian Ocean coupled with the panoramic view from our luxury boutique hotel,
               pledges an unparalleled encounter with one of nature's most astounding wonders.</p>
            <p>Our boutique hotel in Matara situated on the banks of the unpolluted Sea of Dondra Head, 
              offers a nonpareil location to feast your eyes. Wake up each morning being caressed by the warm Sunrise that ascends from your left, 
              while daylight will bid you farewell as you grace your eyes on the beautiful Sunset that descends from your right. 
              And as the crystal blue waters consummate in the distant horizon with the piercing blue skies, 
              the most significant attribute of the hotel is thus brought to life with the unveiling of the natural Seawater pool. 
              Equipped with a unique filtration system that naturally preserves the purity of the water, 
              the pool is surrounded by a rock boulder that renders an organic barricade. 
              This unique masterpiece is formed at the very edge of the property and flows into the coral bank to create a phenomenal work-of-art. 
              Embracing you with a myriad of vibrant marine life cocooned within its rock walls, this natural Seawater pool is an aide-memoire of the matchless experiences that await you.</p>
              <p>Equipped with 12 king-sized bedrooms, 
              our exquisite boutique hotel offers pristine comfort and extraordinary experiences from each abode that is uniquely designed to gratify the palette of even the most arduous traveller. 
              The elegant bedrooms beckon with their panoramic views of the adjoining Sea that is home to Dolphins, Turtles and countless varieties of marine life that form a kaleidoscope of colour. 
              Furthermore the neighbouring Sea is also home to stilt fishermen who've made stilt fishing a livelihood that remains an enticing tourist attraction of this vicinity.
              </p>
              <p>Concurrently a delightful culinary experience is yours to savour, unfolding an aromatic fusion cuisine with every meal. 
              Choose to indulge within the aesthetic in-house restaurant that overlooks the vast Ocean or should you opt for a secluded dinner tucked away on the magnificent rooftop terrace, 
              signature dining too is at your beck and call.</p>
              <p>An unparalleled location along with an unparalleled experience for an unparalleled vacation.. 
                Thus forms our service pledge in delivering that inimitable encounter with nature’s most enchanting heritage, 
                affirming the dwelling of Lakraj Heritage among the most coveted beach hotels in Sri Lanka.</p>
          </div>
          <div className="home-body-content-right">
            <img src="/images/dash_event.jpg" alt="" style={{marginTop:"0px"}}/>
            <img src="/images/dash_food.jpg" alt="" />
            <img src="/images/dash_room.jpg" alt="" />
          </div>
        </div>

      </div>
      <div className="home-footer">
        <Footer></Footer>
      </div>
    </div>
  );
};

export default Home;
