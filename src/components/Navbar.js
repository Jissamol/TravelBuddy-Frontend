import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Navbar() {
  return (
    <Nav
      variant="pills"
      activeKey="1"
      style={{ backgroundColor: 'rgb(224, 231, 231)', padding: '10px' }}
    >
      <Nav.Item>
        <Nav.Link eventKey="1" href="/">
          Home
        </Nav.Link>
      </Nav.Item>
      
      <Nav.Item>
        <Nav.Link eventKey="3" href="/login">
          login
        </Nav.Link>
      </Nav.Item>
      
    </Nav>
  );
}

export default Navbar;
