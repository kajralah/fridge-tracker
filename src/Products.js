import { useState, useEffect } from 'react';
import { fetchProducts, deleteProduct, createProduct } from './api/products';
import CreateProductDialog from './CreateProductDialog';
import FoodStatus from './FoodStatus';
import './css/Products.css';
import deleteIcon from "./img/delete-button.svg";

 export default function Products({productType}) {
    const [products, setProducts] = useState([])
    const [dialogOpen, setDialogOpen] = useState(false)

    const loadProducts = () => {
        fetchProducts(productType).then((data) => {
            setProducts(data)
        });
    }

    const addProduct = async (product) => {
        const { error } = await createProduct(product)
        const data = (!error) && fetchProducts(productType)
        if (data) loadProducts()
    }

    useEffect(() => {
       loadProducts();
    }, [productType])

    const handleRemove = async (event) => {
        const productId = event.nativeEvent.target.dataset.productid;
        await deleteProduct(productId);
        loadProducts();
    }

    return (
        <div className="container">
            <div class="container-header">
                <h2>Fridge items</h2>
                <button className="addButton" onClick={() => setDialogOpen(true)}>
                    + Add Product
                </button>
            </div>
            <hr></hr>
            <table>
                <thead>
                    <tr style={{height: '40px'}}>
                        <th>Name</th>
                        {!productType && <th>Category</th>}
                        <th>Qty</th>
                        <th>Expiration</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                    <tr key={p.id}>
                        <td>{p.name}</td>
                        {!productType && <td>{p.category}</td>}
                        <td>{p.qty}</td>
                        <td>
                            {new Date(p.expiration).toLocaleDateString(
                            "en-GB",
                            { year: "numeric", month: "short", day: "numeric" }
                            )}
                        </td>
                        <td>
                            <FoodStatus expiryDate={p.expiration} />
                        </td>
                        <td>
                        {/* For future - edit button */}
                            <img src={deleteIcon} data-productid={p.id} onClick={handleRemove} alt="Delete" class="icon"/>
                        </td>
                    </tr>
                    )).sort((a,b) => {return a.expiration > b.expiration})}
                </tbody>
            </table>
            <CreateProductDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onAdd={addProduct}
            />
        </div>
    )
}