import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, MapPin, Phone, User as UserIcon, CheckCircle } from 'lucide-react';
import useStore from '../../store';

const DeliveryDashboard = () => {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [confirmCode, setConfirmCode] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  
  const navigate = useNavigate();
  const { user, logout } = useStore();

  useEffect(() => {
    if (!user || user.role !== 'delivery') {
      navigate('/delivery/auth');
      return;
    }
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchData = async () => {
    try {
      const waitRes = await axios.get('http://localhost:5000/api/orders/waiting');
      setAvailableOrders(waitRes.data);

      const myRes = await axios.get(`http://localhost:5000/api/orders/delivery/${user.id}`);
      setMyOrders(myRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    sessionStorage.removeItem('deliveryToken');
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${user.id}`);
        handleLogout();
      } catch (err) {
        console.error('Error deleting account', err);
      }
    }
  };

  const handleAccept = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/accept`, { deliveryPersonId: user.id });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReached = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/reached`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplete = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/complete`, { code: confirmCode });
      setConfirmCode('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error confirming code');
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar" style={{ position: 'relative' }}>
        <div className="nav-brand">Delivery Partner Dashboard</div>
        <div className="flex items-center gap-4">
          <span style={{ color: 'var(--secondary)' }}>Partner: {user?.name}</span>
          
          <div style={{ position: 'relative' }}>
            <button className="btn btn-outline" onClick={() => setShowMenu(!showMenu)} style={{ padding: '8px' }}>
              ⋮
            </button>
            
            {showMenu && (
              <div className="glass-panel" style={{ position: 'absolute', right: 0, top: '100%', marginTop: '10px', minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 100 }}>
                <p className="text-sm border-b" style={{ borderColor: 'var(--glass-border)', paddingBottom: '8px' }}>
                  <strong>Phone:</strong> {user?.phone}
                </p>
                <button className="btn w-full justify-start text-sm" onClick={handleLogout}><LogOut size={14}/> Logout</button>
                <button className="btn w-full justify-start text-sm" style={{ color: 'red' }} onClick={handleDeleteAccount}>Delete Account</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Stats Section */}
      <div className="p-4 flex gap-4 w-full flex-wrap" style={{ background: 'rgba(0,0,0,0.2)' }}>
         <div className="glass-panel text-center flex-1" style={{ minWidth: '150px' }}>
            <h3 style={{ color: 'var(--secondary)' }}>{myOrders.filter(o => o.status === 'Completed').length}</h3>
            <p className="text-muted text-sm">Completed Orders</p>
         </div>
         <div className="glass-panel text-center flex-1" style={{ minWidth: '150px' }}>
            <h3 style={{ color: 'var(--success)' }}>₹{myOrders.filter(o => o.status === 'Completed').reduce((sum, o) => sum + (o.totalAmount * 0.1), 0).toFixed(0)}</h3>
            <p className="text-muted text-sm">Total Earnings</p>
         </div>
         <div className="glass-panel text-center flex-1" style={{ minWidth: '150px' }}>
            <h3 style={{ color: 'var(--primary)' }}>4.8 / 5.0</h3>
            <p className="text-muted text-sm">Delivery Rating</p>
         </div>
      </div>

      <div className="p-4 flex gap-6 w-full" style={{ flex: 1, flexWrap: 'wrap' }}>
        
        {/* Active/My Orders */}
        <div className="flex-col gap-4" style={{ flex: 1, minWidth: '350px' }}>
          <h3>My Deliveries</h3>
          {myOrders.length === 0 ? <p className="text-muted mt-2">No active deliveries.</p> : myOrders.filter(o => o.status !== 'Completed').map(order => (
            <div key={order._id} className="glass-panel mt-4 animate-fade-in" style={{ borderLeft: '4px solid var(--secondary)' }}>
              <div className="flex justify-between items-center mb-4">
                <h4 style={{ color: 'var(--secondary)' }}>{order.status}</h4>
                <span className="font-bold">₹{order.totalAmount} (COD)</span>
              </div>
              
              <div className="flex-col gap-2 p-3 mb-4" style={{ background: 'var(--dark-light)', borderRadius: '8px' }}>
                <p className="flex items-center gap-2"><UserIcon size={16}/> {order.user.name}</p>
                <p className="flex items-center gap-2"><Phone size={16}/> {order.userPhone}</p>
                <p className="flex items-center gap-2"><MapPin size={16}/> {order.location}</p>
              </div>

              <div className="mb-4">
                <p className="font-bold mb-2 text-sm">Order Breakdown:</p>
                <ul className="text-sm text-muted mb-2" style={{ paddingLeft: '15px' }}>
                  {order.items.map((i, idx) => (
                    <li key={idx} className="flex justify-between" style={{ listStyleType: 'disc' }}>
                      <span>{i.quantity}x {i.item?.name || 'Deleted Item'}</span>
                      <span>₹{i.price * i.quantity}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between text-sm text-muted">
                  <span>GST (5%)</span>
                  <span>₹{(order.items.reduce((acc, i) => acc + i.price * i.quantity, 0) * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted mb-2">
                  <span>Delivery Charges</span>
                  <span>₹40.00</span>
                </div>
                <div className="flex justify-between font-bold pt-2 mb-4" style={{ borderTop: '1px solid var(--glass-border)' }}>
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--primary)' }}>₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {order.status === 'Accepted' && (
                <button className="btn btn-secondary w-full" onClick={() => handleReached(order._id)}>
                  Mark Reached
                </button>
              )}

              {order.status === 'Reached' && (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter Code" 
                    value={confirmCode}
                    onChange={e => setConfirmCode(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button className="btn btn-success" onClick={() => handleComplete(order._id)}>
                    <CheckCircle size={16}/> Confirm Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Available Orders Pool */}
        <div className="flex-col gap-4" style={{ flex: 1, minWidth: '350px' }}>
          <h3>Waiting Orders</h3>
          {availableOrders.length === 0 ? <p className="text-muted mt-2">No new orders available.</p> : availableOrders.map(order => (
            <div key={order._id} className="glass-panel mt-4">
               <div className="flex justify-between items-center mb-2">
                 <span>Order ID: #{order._id.substring(18)}</span>
                 <span className="font-bold text-success">₹{order.totalAmount.toFixed(2)}</span>
               </div>
               <p className="text-sm text-muted mb-4"><MapPin size={14} className="inline"/> {order.location}</p>
               <button className="btn btn-primary w-full" onClick={() => handleAccept(order._id)}>Accept Order</button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default DeliveryDashboard;
