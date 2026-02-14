import { Container } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <div className="row">
          <div className="col-md-6">
            <h5>☪️ Islamic Dawah</h5>
            <p>Spreading the message of Islam through knowledge and understanding</p>
            <p className="small text-muted">
              "And who is better in speech than one who invites to Allah" - Quran 41:33
            </p>
          </div>
          <div className="col-md-3">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li>About Us</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6>Connect With Us</h6>
            <p>Share knowledge and spread the truth</p>
          </div>
        </div>
        <hr className="bg-white" />
        <div className="text-center">
          <small>&copy; 2024 Islamic Dawah Portal. All rights reserved.</small>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
