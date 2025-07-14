import '../styles/Header.css';
import image from '../assets/admin.png';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { firstname } = useAuth();
    return(
        <header className="navbar-header">
            <img className="image" src={image} alt="Description of image" />
            <div className="navbar-text">
            <h1>Online Exam Monitoring System Admin</h1>
            {/* {console.log(firstname)} */}
            <span className="navbar-username">Welcome, {firstname}</span>
            </div>
        </header>
    )
}

export default Header;