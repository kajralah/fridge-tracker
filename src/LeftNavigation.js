import './css/LeftNavigation.css';
import { Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

export default function LeftNavigation() {

    return (
      <nav className='leftNav'>
            <ul>
                <li><NavLink to="/"className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
                <li><NavLink to="/fridge" className={({ isActive }) => isActive ? 'active' : ''}>Fridge items</NavLink></li>
                <li> <NavLink to="/freezer" className={({ isActive }) => isActive ? 'active' : ''}>Freezer items</NavLink></li>
                <li><NavLink to="/pantry" className={({ isActive }) => isActive ? 'active' : ''}>Pantry items</NavLink></li>
                 {/* <Link to="/recipes">Recipes</Link> */}
            </ul>
        </nav>
    )
}