
import {Carousel} from 'react-bootstrap';
import "../../styles/home.css";
const AboutDetails = ({title,text,url1,url2,url3}) => {
    return ( 
        <div className="About-content">
           <div className="About-content-image">
                <Carousel>
                    <Carousel.Item style={{height: '290px'}} >
                        <img
                            style={{width: '100%', height: '100%', objectFit: 'cover'}}
                            className="d-block w-100"
                            src={url1}
                            alt={title}
                        />
                    </Carousel.Item>
                    <Carousel.Item style={{height: '290px'}} >
                        <img
                            style={{width: '100%', height: '100%', objectFit: 'cover'}}
                            className="d-block w-100"
                            src={url2}
                            alt={title}
                        />
                    </Carousel.Item>
                    <Carousel.Item style={{height: '290px'}} >
                        <img
                            style={{width: '100%', height: '100%', objectFit: 'cover'}}
                            className="d-block w-100"
                            src={url3}
                            alt={title}
                        />
                    </Carousel.Item>
                </Carousel>
            </div>
            <div className="About-content-body">
                <h1>{title}</h1>
                <p>{text}</p>
            </div> 
            
        </div>
     );
}
 
export default AboutDetails;