import React, { useState, useEffect } from 'react';
import './App.css';

// ⚠️ REPLACE THIS WITH YOUR LIVE VERCEL BACKEND URL (e.g., https://global-trade-saas-abc123.vercel.app)
const API_URL = 'https://global-trade-saas.vercel.app/';

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [priceCNY, setPriceCNY] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [currency, setCurrency] = useState('CNY');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (!name || !priceCNY) return;

    try {
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, priceCNY: Number(priceCNY), imageUrl }),
      });

      if (response.ok) {
        setName('');
        setPriceCNY('');
        setImageUrl('');
        fetchProducts();
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await fetch(`${API_URL}/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const totalValue = products.reduce((acc, curr) => acc + (Number(curr.priceCNY) || 0), 0);

  return (
    <div className="app-container" style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>GlobalTrade SaaS Dashboard</h1>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          <h3>Total Active Products</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{products.length}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px' }}>
          <h3>Gross Inventory Value</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>¥{totalValue}</p>
        </div>
      </div>

      <form onSubmit={addProduct} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <h3>Add New Product</h3>
        <input 
          type="text" 
          placeholder="Product Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          style={{ padding: '8px' }}
        />
        <input 
          type="number" 
          placeholder="Price (CNY)" 
          value={priceCNY} 
          onChange={(e) => setPriceCNY(e.target.value)} 
          required 
          style={{ padding: '8px' }}
        />
        <input 
          type="text" 
          placeholder="Image URL (Optional)" 
          value={imageUrl} 
          onChange={(e) => setImageUrl(e.target.value)} 
          style={{ padding: '8px' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer' }}>
          + Add to Database
        </button>
      </form>

      <h3>Live Database Feed</h3>
      {products.length === 0 ? (
        <p>Your database is empty.</p>
      ) : (
        <ul>
          {products.map((prod) => (
            <li key={prod._id} style={{ marginBottom: '10px' }}>
              <strong>{prod.name}</strong> - ¥{prod.priceCNY} 
              <button onClick={() => deleteProduct(prod._id)} style={{ marginLeft: '10px', color: 'red', cursor: 'pointer' }}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;