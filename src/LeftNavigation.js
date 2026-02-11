import { useEffect, useState } from "react";
import './css/LeftNavigation.css';
import { NavLink, useLocation } from 'react-router-dom';
import { supabase } from "./supabaseClient";

export default function LeftNavigation() {

    const [categories, setCategories] = useState([]);
    const location = useLocation();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

        if (!error) setCategories(data);
    };

    const isRecipesActive = location.pathname.startsWith("/recipes");

    return (
      <nav className='leftNav'>
            <ul>
                <li><NavLink to="/"className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
                <li><NavLink to="/fridge" className={({ isActive }) => isActive ? 'active' : ''}>Fridge items</NavLink></li>
                <li> <NavLink to="/freezer" className={({ isActive }) => isActive ? 'active' : ''}>Freezer items</NavLink></li>
                <li><NavLink to="/pantry" className={({ isActive }) => isActive ? 'active' : ''}>Pantry items</NavLink></li>
                <li><NavLink to="/recipes" className={({ isActive }) => isActive ? 'active' : ''}>Recipes</NavLink></li>
                {/* Categories */}
                {isRecipesActive && (
                    <ul style={{ listStyle: "none", paddingLeft: 15 }}>
                    {categories.map((category) => (
                        <li key={category.name}>
                            <NavLink to={`/recipes/category/${category.name}`} className={({ isActive }) => isActive ? 'active' : ''}>
                                {category.name}
                            </NavLink>
                        </li>
                    ))}
                    </ul>
                )}
            </ul>
        </nav>
    )
}