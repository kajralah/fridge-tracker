import { useParams } from "react-router-dom";
import Header from './Header';
import LeftNavigation from './LeftNavigation';
import Products from './Products';

export default function FridgeTracker() {
  const { productType } = useParams();



  return (
    <div className="full-height">
      <Header />
      <hr/>
      <div style={{display: 'flex', flexDirection: 'row'}} className="full-height">
        <LeftNavigation />
        <Products productType={productType}/>
      </div>
    </div>
  )
}
