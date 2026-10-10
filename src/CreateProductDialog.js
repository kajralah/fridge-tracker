import { useEffect, useState } from 'react'

export default function CreateProductDialog({ open, onClose, onAdd, initialData }) {
  const id = initialData?.id;
  const [name, setName] = useState('')
  const [qty, setQty] = useState(1)
  const [category, setCategory] = useState('Pantry')
  const [expiration, setExpiration] = useState('')
  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name ?? "");
      setQty(initialData.qty ?? 0);
      setCategory(initialData.category);
      setExpiration(initialData.expiration);
    }
  }, [initialData]);

  const handleAdd = () => {
    if (!name || !qty || !category || !expiration) {
      alert('Fill all fields!')
      return
    }

    const id = initialData?.id;
  
    onAdd({ name, qty, category, expiration, id, isEdit })
    setName('')
    setQty(1)
    setCategory('Pantry')
    setExpiration('')
    onClose()
  }

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'white', padding: '0 20px 20px', borderRadius: '8px', minWidth: '300px'
      }}>
        <h2 style={{textAlign: 'center'}}>{isEdit ? 'Edit Product' : 'Add Product'}</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%',height: '25px', marginBottom: '10px' }}
        />
        <input
          type="number"
          placeholder="Quantity"
          min="1"
          value={qty}
          onChange={e => setQty(Number(e.target.value))}
          style={{ width: '10%', marginBottom: '10px', height: '22px' }}
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ width: '45%', marginBottom: '10px', marginLeft: '10px', height: '25px' }}
        >
          <option value="Pantry">Pantry</option>
          <option value="Fridge">Fridge</option>
          <option value="Freezer">Freezer</option>
        </select>
        <input
          type="date"
          value={expiration}
          onChange={e => setExpiration(e.target.value)}
          style={{ width: '100%', marginBottom: '10px', width: '39%', marginLeft: '10px', height: '25px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={onClose} style={{ marginRight: '10px', width: '30%' }}>Cancel</button>
          <button onClick={() => handleAdd(isEdit)} style={{ width: '30%' }}> {isEdit ? 'Edit' : 'Add'}</button>
        </div>
      </div>
    </div>
  )
}
