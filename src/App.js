import FridgeTracker from './FridgeTracker'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<FridgeTracker />} />
          <Route path="/:productType" element={<FridgeTracker />} />
        </Routes>
    </BrowserRouter>
  );  
}

export default App