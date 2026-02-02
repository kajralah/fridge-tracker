import './css/Header.css';
import logo from "./img/logo.png";

export default function Header() {

    return (
        <header>
            <img className="logo" src={logo} alt="Fridge Tracker"/>
        </header>
    )
}