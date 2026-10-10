import { useState, useEffect } from 'react';
import { fetchProducts, deleteProduct, createProduct, editProduct } from './api/products';
import CreateProductDialog from './CreateProductDialog';
import FoodStatus from './FoodStatus';
import './css/Products.css';
import deleteIcon from "./img/delete-button.svg";
import editIcon from "./img/edit.png";

 export default function Products({productType}) {
    const [products, setProducts] = useState([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null);

    const loadProducts = () => {
        fetchProducts(productType).then((data) => {
            setProducts(data)
        });
    }

    const addProduct = async (product) => {
        let data;
        let result;

        if (product.isEdit) {
            result = await editProduct(product);
        } else {
            console.log(product)
            const {isEdit, id, ...newProduct} = product;

            result = await createProduct(newProduct)
        }
        
        data = (!result.error) && fetchProducts(productType)

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

    const handleEdit = async (product) => {
        setSelectedProduct(product);
        setDialogOpen(true);
    }

    return (
        <div className="container">
            <div className="container-header">
                <h2>Items</h2>
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
                            <img src={editIcon} onClick={() => {handleEdit(p)}} alt="Edit" className="editIcon"/>
                            <img src={deleteIcon} data-productid={p.id} onClick={handleRemove} alt="Delete" className="icon"/>
                        </td>
                    </tr>
                    )).sort((a,b) => {return a.expiration > b.expiration})}
                </tbody>
            </table>
            <CreateProductDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onAdd={addProduct}
                initialData={selectedProduct}
            />
        </div>
    )
}