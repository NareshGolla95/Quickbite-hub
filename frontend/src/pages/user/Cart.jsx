import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, MapPin, CreditCard, ArrowLeft } from 'lucide-react';
import useStore from '../../store';
import { API_URL } from "../../api";

const Cart = () => {
  const { cart, user, clearCart } = useStore();
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/user/auth');
      return;
    }
    setLocation(user.location || 'Default Address');
  }, [user]);

  const itemTotal = cart.reduce((acc, c) => acc + (c.item.price * c.quantity), 0);
  const gst = itemTotal * 0.05;
  const deliveryCharges = cart.length > 0 ? 40 : 0;
  const grandTotal = itemTotal + gst + deliveryCharges;

  const handleConfirmOrder = async () => {
    if (cart.length === 0) return;
    try {
      const itemsPayload = cart.map(c => ({ item: c.item._id, quantity: c.quantity, price: c.item.price }));
      await axios.post(`${API_URL}/api/orders`, {
        userId: user.id,
        items: itemsPayload,
        totalAmount: grandTotal,
        location: location,
        userPhone: user.phone
      });
      
      clearCart();
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/user/dashboard');
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center animate-fade-in" style={{ minHeight: '100vh', background: 'var(--dark)' }}>
        <CheckCircle size={100} style={{ color: 'var(--success)', marginBottom: '20px' }} />
        <h1 style={{ color: 'var(--success)' }}>Order Confirmed!</h1>
        <p className="mt-4 text-center" style={{ fontSize: '1.2rem' }}>Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="app-container p-4">
      <nav className="navbar flex items-center mb-4" style={{ borderRadius: '12px' }}>
         <button className="btn text-muted" onClick={() => navigate('/user/dashboard')}><ArrowLeft /> Back to Menu</button>
         <h2>Checkout</h2>
      </nav>

      <div className="flex gap-6 w-full max-w-5xl mx-auto" style={{ flexWrap: 'wrap' }}>
        
        {/* Cart Items */}
        <div className="glass-panel" style={{ flex: 2, minWidth: '300px' }}>
          <h3>Order Details</h3>
          <div className="flex flex-col gap-4 mt-4">
            {cart.length === 0 ? <p className="text-muted">Cart is empty.</p> : cart.map((c, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4" style={{ background: 'var(--dark)', borderRadius: '8px' }}>
                <img src={c.item.image} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} alt={c.item.name} />
                <div style={{ flex: 1 }}>
                  <h4>{c.item.name}</h4>
                  <p className="text-muted">Qty: {c.quantity}</p>
                </div>
                <div className="text-right">
                  <p style={{ fontWeight: 'bold' }}>₹{c.item.price * c.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary & Payment */}
        <div className="glass-panel" style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3>Summary</h3>
          <div className="flex justify-between"><span className="text-muted">Item Subtotal</span><span>₹{itemTotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-muted">GST (5%)</span><span>₹{gst.toFixed(2)}</span></div>
          <div className="flex justify-between"><span className="text-muted">Delivery Charges</span><span>₹{deliveryCharges.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold" style={{ fontSize: '1.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
            <span>Total</span><span style={{ color: 'var(--primary)' }}>₹{grandTotal.toFixed(2)}</span>
          </div>

          <div className="mt-4">
            <h4 className="flex items-center gap-2 mb-2"><MapPin size={16}/> Delivery Location</h4>
            <textarea 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              className="w-full text-sm" 
              style={{ minHeight: '80px' }}
            />
          </div>

          <div className="mt-4 p-4" style={{ background: 'var(--dark-light)', border: '1px solid var(--secondary)', borderRadius: '8px' }}>
            <h4 className="flex items-center gap-2" style={{ color: 'var(--secondary)' }}><CreditCard size={16}/> Payment Method</h4>
            <p className="mt-2 font-bold">Cash on Delivery (COD) Only</p>
          </div>

          <button className="btn btn-primary w-full mt-4" onClick={handleConfirmOrder} disabled={cart.length === 0}>
            Confirm Order
          </button>
        </div>

      </div>
    </div>
  );
};

export default Cart;
