import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PlusCircle, Utensils, Users, MessageSquare, LogOut } from 'lucide-react';
import { API_URL } from "../../api";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('items');
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  
  // New Item State
  const [newItem, setNewItem] = useState({ name: '', price: '', image: '', stock: '' });

  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('adminAuth')) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'items') {
        const res = await axios.get(`${API_URL}/api/items`);
        setItems(res.data);
      } else if (activeTab === 'users') {
        const res = await axios.get(`${API_URL}/api/users`);
        setUsers(res.data);
      } else if (activeTab === 'feedback') {
        const res = await axios.get(`${API_URL}/api/feedbacks`);
        setFeedbacks(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/items`, newItem);
      setNewItem({ name: '', price: '', image: '', stock: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFeedback = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/feedbacks/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`${API_URL}/api/items/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    navigate('/');
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-brand"><Utensils /> QuickBite Admin</div>
        <button className="btn btn-outline" onClick={handleLogout}><LogOut size={16}/> Logout</button>
      </nav>

      <div className="p-4 flex gap-4 w-full" style={{ flex: 1 }}>
        {/* Sidebar */}
        <div className="glass-panel flex-col gap-4" style={{ width: '250px', display: 'flex' }}>
          <button className={`btn w-full justify-start ${activeTab === 'items' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('items')}>
            <PlusCircle size={18} /> Menu Items
          </button>
          <button className={`btn w-full justify-start ${activeTab === 'users' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('users')}>
            <Users size={18} /> Users & Delivery
          </button>
          <button className={`btn w-full justify-start ${activeTab === 'feedback' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('feedback')}>
            <MessageSquare size={18} /> View Feedbacks
          </button>
        </div>

        {/* Main Content */}
        <div className="glass-panel" style={{ flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 100px)' }}>
          {activeTab === 'items' && (
            <div className="animate-fade-in">
              <h3>Add New Item</h3>
              <form onSubmit={handleAddItem} className="flex gap-4 mt-4 mb-4">
                <input type="text" placeholder="Name" value={newItem.name} onChange={e=>setNewItem({...newItem, name: e.target.value})} required />
                <input type="number" placeholder="Price" value={newItem.price} onChange={e=>setNewItem({...newItem, price: e.target.value})} required />
                <input type="text" placeholder="Image URL" value={newItem.image} onChange={e=>setNewItem({...newItem, image: e.target.value})} required />
                <input type="number" placeholder="Stock" value={newItem.stock} onChange={e=>setNewItem({...newItem, stock: e.target.value})} required />
                <button type="submit" className="btn btn-primary">Add Item</button>
              </form>

              <h3>Menu Items</h3>
              <div className="grid-cards mt-4">
                {items.map(item => (
                  <div key={item._id} className="card">
                    <img src={item.image} alt={item.name} className="card-img" />
                    <div className="card-body container">
                      <h4>{item.name} - ₹{item.price}</h4>
                      <div className="flex justify-between mt-4">
                        <span style={{ color: 'var(--text-muted)' }}>Stock: {item.stock}</span>
                        <span style={{ color: 'var(--success)' }}>Sold: {item.soldCount}</span>
                      </div>
                      <button className="btn btn-outline w-full mt-4" style={{ borderColor: 'red', color: 'red' }} onClick={() => handleDeleteItem(item._id)}>Delete Item</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="animate-fade-in">
              <h3>Registered Users & Delivery Partners</h3>
              <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--dark)', textAlign: 'left' }}>
                    <th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th><th className="p-4">Phone / Bike</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td className="p-4">{u.name}</td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4"><span style={{ textTransform: 'capitalize', color: u.role==='delivery' ? 'var(--secondary)' : 'var(--primary)' }}>{u.role}</span></td>
                      <td className="p-4">{u.phone} {u.bikeNumber ? ` | ${u.bikeNumber}` : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="animate-fade-in">
              <h3>Customer Feedbacks</h3>
              <div className="flex-col gap-4 mt-4">
                {feedbacks.map(f => (
                  <div key={f._id} className="card p-4">
                    <div className="flex justify-between items-start">
                      <h4 style={{ color: 'var(--primary)' }}>{f.user?.name} ({f.user?.email})</h4>
                      <button className="btn btn-outline" style={{ padding: '4px 8px', borderColor: 'var(--primary)', color: 'var(--primary)' }} onClick={() => handleDeleteFeedback(f._id)}>Delete</button>
                    </div>
                    <p className="mt-4 text-muted">{f.feedbackText}</p>
                    <div className="flex gap-4 mt-4">
                      <span>Rest. Rating: {f.restaurantRating}/5</span>
                      <span>Del. Rating: {f.deliveryRating}/5</span>
                    </div>
                    {f.foodQuestions && <p className="mt-4 text-muted">Comments: {f.foodQuestions}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
