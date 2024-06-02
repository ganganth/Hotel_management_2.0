const Header = () => {
  return (
    <ul className="nav justify-content-end">
      <li className="nav-item" >
        <a className="nav-link active" aria-current="page" href="/home" style={{ color: 'white', fontWeight: 'bold'}} >
          Home
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/about" style={{ color: 'white', fontWeight: 'bold' }}>
          About Us
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/contact" style={{ color: 'white', fontWeight: 'bold' }}>
          Contact Us
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link " href="/login" style={{ color: 'white', fontWeight: 'bold' }}>
          Sign Up
        </a>
      </li>
    </ul>
  );
};

export default Header;
