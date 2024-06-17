import {useState} from 'react';
import {axiosPublic} from '../app/axios';
import {useDispatch} from 'react-redux';
import {loginSuccess} from '../app/auth/authSlice';
import {Form, Button} from 'react-bootstrap';
import {useNavigate,Link} from 'react-router-dom';
import { resetState } from '../app/state/stateSlice';
import { clearCart } from '../app/ordersCart/orderCartSlice';

import '../styles/login.css';

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLoginSubmit = async e => {
        e.preventDefault();

        if(!username.trim() || !password.trim()) return alert('Both username and password are required');

        setLoading(true);
        // send username & password to the server
        try {
            const response = await axiosPublic.post('/api/auth/login', JSON.stringify({username,password}));
            console.log(response.data);
            dispatch(loginSuccess({accessToken: response.data.accessToken, user: response.data.user}));
            dispatch(resetState());
            dispatch(clearCart());
            setLoading(false);
            if(response.data.user.role==='Customer'){
                navigate('/booking');
            }
            else{
                navigate('/dash');
            }
            

        } catch(err) {
            alert(err.response?.data?.message);
            setLoading(false);
        } 

    }

    return (
        <div className="login w-100 vh-100 d-flex justify-content-center align-items-center">

            <Form onSubmit={handleLoginSubmit} className='login-form'>

                <button type='button' className='btn btn-dark btn-sm mb-3' onClick={() => navigate('/')}>&larr; Back to Landing Page</button>

                <h1 className="login-form-title">Login</h1>

                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                
                <Button 
                    type='submit' 
                    variant='primary' 
                    className="auth-btn"
                    disabled={loading || !username.trim() || !password.trim() }
                >
                    {loading 
                        ? (
                            <>
                                <span>wait...</span>
                            </>
                        )
                        : 'Login'}
                </Button>
                <p className='loginPage-btn-para'>Do not have an account ? <Link to='/register'>Register</Link></p>
            
            </Form>
            
        </div>
    );
}


export default Login;