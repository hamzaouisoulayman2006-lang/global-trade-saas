import React, { useState, useEffect } from 'react';

function App() {
  const [inventory, setInventory] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImage, setNewImage] = useState('');
  const [currency, setCurrency] = useState('CNY');
  
  // NEW: Professional state management
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true); 

  const loadInventory = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch('https://global-trade-saas-k4e6p3rjw-soul-e42c.vercel.app/api/products');
      const data = await response.json();
      setInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load inventory:', err);
      setInventory([]);
    } finally {
      setIsLoading(false); // Stop loading when done
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const addNewProduct = async (e) => {
    e.preventDefault();
    if (!newName || !newPrice) return alert('Please enter both a name and a price.');

    try {
      const response = await fetch('https://global-trade-saas-k4e6p3rjw-soul-e42c.vercel.app/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, priceCNY: Number(newPrice), imageUrl: newImage })
      });
      if (response.ok) {
        setNewName(''); setNewPrice(''); setNewImage(''); 
        loadInventory();
      }
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`https://global-trade-saas-k4e6p3rjw-soul-e42c.vercel.app/api/products//${id}`, { method: 'DELETE' });
      if (response.ok) loadInventory();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // NEW: Filter the inventory based on the search bar
  const filteredInventory = inventory.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = inventory.length;
  const totalValueCNY = inventory.reduce((sum, item) => sum + item.priceCNY, 0);
  const conversionRate = 7.2; 

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif', maxWidth: '1000px', margin: '0 auto', color: '#1e293b' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f5f9', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#3b82f6', color: 'white', padding: '10px', borderRadius: '8px', fontSize: '1.5rem' }}>🌍</div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '700' }}>GlobalTrade SaaS</h1>
        </div>
        <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', fontWeight: 'bold', cursor: 'pointer' }}>
          <option value="CNY">🇨🇳 Currency: CNY (¥)</option>
          <option value="USD">🇺🇸 Currency: USD ($)</option>
        </select>
      </header>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ flex: 1, padding: '1.5rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#64748b', textTransform: 'uppercase', fontSize: '0.85rem' }}>Total Active Products</h4>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '2.5rem', fontWeight: '800' }}>{totalItems}</h2>
        </div>
        <div style={{ flex: 1, padding: '1.5rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#64748b', textTransform: 'uppercase', fontSize: '0.85rem' }}>Gross Inventory Value</h4>
          <h2 style={{ margin: 0, color: '#3b82f6', fontSize: '2.5rem', fontWeight: '800' }}>
            {currency === 'CNY' ? `¥${totalValueCNY.toLocaleString()}` : `$${(totalValueCNY / conversionRate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </h2>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2.5rem' }}>
        
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', height: 'fit-content' }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>Add New Product</h3>
          <form onSubmit={addNewProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px', color: '#475569' }}>Product Name</label>
              <input type="text" placeholder="e.g., Wireless Headphones" value={newName} onChange={(e) => setNewName(e.target.value)} style={{ width: '90%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px', color: '#475569' }}>Price (CNY)</label>
              <input type="number" placeholder="e.g., 299" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} style={{ width: '90%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px', color: '#475569' }}>Image URL (Optional)</label>
              <input type="text" placeholder="https://..." value={newImage} onChange={(e) => setNewImage(e.target.value)} style={{ width: '90%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            </div>
            <button type="submit" style={{ padding: '12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', marginTop: '10px' }}>
              + Add to Database
            </button>
          </form>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ margin: 0 }}>Live Database Feed</h3>
            
            {/* NEW: Search Bar */}
            <input 
              type="text" 
              placeholder="🔍 Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '200px' }}
            />
          </div>
          
          {/* NEW: Loading and Empty States */}
          {isLoading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>⏳ Fetching from cloud...</div>
          ) : filteredInventory.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '2px dashed #cbd5e1', color: '#64748b' }}>
              <p>{inventory.length === 0 ? "Your database is empty." : "No products match your search."}</p>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredInventory.map((product) => (
                <li key={product._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img 
                      src={product.imageUrl || 'https://placehold.co/100x100?text=No+Img'} 
                      alt={product.name} 
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                      onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=Error' }}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '1.15rem', color: '#0f172a', marginBottom: '4px' }}>{product.name}</strong>
                      <span style={{ color: '#059669', fontWeight: '700', fontSize: '1rem', background: '#d1fae5', padding: '2px 8px', borderRadius: '4px' }}>
                        {currency === 'CNY' ? `¥${product.priceCNY}` : `$${(product.priceCNY / conversionRate).toFixed(2)}`}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => deleteProduct(product._id)} style={{ background: '#fee2e2', color: '#ef4444', border: '1px solid #fca5a5', padding: '8px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;