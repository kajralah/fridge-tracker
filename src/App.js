import FridgeTracker from './FridgeTracker'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RecipesList from './RecipesList';
import RecipeDetails from './RecipeDetails';
import RecipesByCategory from './RecipesByCategory';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<FridgeTracker />} />
          <Route path="/:productType" element={<FridgeTracker />} />
          <Route path="/recipes" element={<RecipesList />} />
          <Route path="/recipes/:id" element={<RecipeDetails />} />
          <Route
              path="/recipes/category/:categoryName"
              element={<RecipesByCategory />}
            />
        </Routes>
    </BrowserRouter>
  );  
}

export default App