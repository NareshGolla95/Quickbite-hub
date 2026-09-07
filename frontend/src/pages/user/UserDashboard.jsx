import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, ShoppingCart, LogOut, CheckCircle, Star } from 'lucide-react';
import useStore from '../../store';

const UserDashboard = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orders, setOrders] = useState([]);
  const [feedbackOrder, setFeedbackOrder] = useState(null);

  const [showFeedbacksModal, setShowFeedbacksModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [allFeedbacks, setAllFeedbacks] = useState([]);

  const [feedback, setFeedback] = useState({ restaurantRating: 5, deliveryRating: 5, foodQuestions: '', feedbackText: '' });

  const navigate = useNavigate();
  const { user, logout, addToCart } = useStore();

  useEffect(() => {
    if (!user) {
      navigate('/user/auth');
      return;
    }
    fetchItems();
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/items');
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      if (!user) return;
      const res = await axios.get(`http://localhost:5000/api/orders/user/${user.id}`);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    sessionStorage.removeItem('userToken');
    navigate('/');
  };

  const openItemPanel = (item) => {
    setSelectedItem(item);
    setQuantity(1);
  };

  const confirmAddToCart = () => {
    addToCart(selectedItem, quantity);
    setSelectedItem(null);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/feedbacks', {
        user: user.id,
        order: feedbackOrder._id,
        ...feedback
      });
      setFeedbackOrder(null);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const loadAllFeedbacks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/feedbacks');
      setAllFeedbacks(res.data);
      setShowFeedbacksModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-brand">QuickBite Hub</div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 hidden-mobile" style={{ background: 'var(--dark-light)', borderRadius: '20px', padding: '5px 15px' }}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search items..."
              style={{ border: 'none', background: 'transparent', padding: '5px', width: '150px' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-outline" style={{ padding: '8px' }} onClick={loadAllFeedbacks}>Reviews</button>
          <button className="btn btn-outline" style={{ padding: '8px' }} onClick={() => setShowOrdersModal(true)}>My Orders</button>
          <span className="hidden-mobile" style={{ color: 'var(--primary)' }}>Hello, {user?.name}</span>
          <button className="btn btn-primary" onClick={() => navigate('/user/cart')}><ShoppingCart size={16} /></button>
          <button className="btn btn-outline" onClick={handleLogout}><LogOut size={16} /></button>
        </div>
      </nav>

      <div className="p-4 flex gap-4 w-full h-full relative" style={{ flex: 1 }}>
        <div className="w-full flex-col gap-4">

          {/* Active Orders Section was Moved to Modal */}

          {/* Menu Items */}
          <h3>Menu Items</h3>
          <div className="grid-cards mt-4">
            {filteredItems.map(item => (
              <div key={item._id} className="card" style={{ cursor: 'pointer' }} onClick={() => openItemPanel(item)}>
                <img src={item.image} alt={item.name} className="card-img" />
                <div className="card-body">
                  <h4>{item.name}</h4>
                  <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '8px' }}>₹{item.price}</p>
                  <p className="text-muted text-sm mt-2">{item.stock > 0 ? `In Stock` : 'Out of Stock'}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Side Panel for Item Add */}
        {selectedItem && (
          <div className="glass-panel animate-fade-in"
            style={{
              position: 'fixed',
              right: 0,
              top: 0,
              height: '100vh',
              width: '350px',
              zIndex: 1000,
              borderRadius: '16px 0 0 16px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}>
            <button className="btn btn-outline mb-4 w-min" onClick={() => setSelectedItem(null)}>✕</button>
            <img src={selectedItem.image} alt={selectedItem.name} style={{ width: '100%', borderRadius: '12px', height: '200px', objectFit: 'cover' }} />
            <h2 className="mt-4">{selectedItem.name}</h2>
            <h3 style={{ color: 'var(--primary)' }} className="mt-2">₹{selectedItem.price}</h3>

            <div
              style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}
              className="mt-4 flex flex-col gap-4">
              <label>Quantity:</label>
              <div className="flex gap-4 items-center">
                <button className="btn btn-outline" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{quantity}</span>
                <button className="btn btn-outline" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>

              <div className="p-4" style={{ background: 'var(--dark)', borderRadius: '8px' }}>
                <div className="flex justify-between"><span className="text-muted">Item Total</span><span>₹{selectedItem.price * quantity}</span></div>
                <div className="flex justify-between mt-2"><span className="text-muted">GST (5%)</span><span>₹{(selectedItem.price * quantity * 0.05).toFixed(2)}</span></div>
                <div className="flex justify-between mt-2"><span className="text-muted">Delivery Charges</span><span>₹40.00</span></div>
                <div className="flex justify-between mt-2 font-bold" style={{ fontSize: '1.2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
                  <span>Net amount</span>
                  <span style={{ color: 'var(--primary)' }}>₹{(selectedItem.price * quantity * 1.05 + 40).toFixed(2)}</span>
                </div>
              </div>

              <div style={{ padding: '10px', borderTop: '1px solid var(--glass-border)' }}>
                <button className="btn btn-primary w-full" onClick={confirmAddToCart}>
                  Continue & Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Modal Overlay */}
        {feedbackOrder && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <div className="glass-panel animate-fade-in" style={{ width: '90%', maxWidth: '500px' }}>
              <h2 className="mb-4">Leave Feedback</h2>
              <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-4">
                <div>
                  <label>Restaurant Rating (out of 5)</label>
                  <input type="number" min="1" max="5" value={feedback.restaurantRating} onChange={e => setFeedback({ ...feedback, restaurantRating: e.target.value })} className="w-full" required />
                </div>
                <div>
                  <label>Delivery Rating (out of 5)</label>
                  <input type="number" min="1" max="5" value={feedback.deliveryRating} onChange={e => setFeedback({ ...feedback, deliveryRating: e.target.value })} className="w-full" required />
                </div>
                <div>
                  <label>Food Quality Comments</label>
                  <input type="text" value={feedback.foodQuestions} onChange={e => setFeedback({ ...feedback, foodQuestions: e.target.value })} className="w-full" placeholder="Was the food hot? Tasty?" />
                </div>
                <div>
                  <label>Detailed Feedback (Max 100 words)</label>
                  <textarea value={feedback.feedbackText} onChange={e => setFeedback({ ...feedback, feedbackText: e.target.value })} className="w-full" rows="3" required></textarea>
                </div>
                <div className="flex gap-4">
                  <button type="button" className="btn btn-outline flex-1" onClick={() => setFeedbackOrder(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary flex-1">Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View All Feedbacks */}
        {showFeedbacksModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <div className="glass-panel animate-fade-in flex-col" style={{ width: '90%', maxWidth: '600px', maxHeight: '80vh', display: 'flex' }}>
              <div className="flex justify-between items-center mb-4">
                <h2>Customer Reviews</h2>
                <button className="btn btn-outline" onClick={() => setShowFeedbacksModal(false)}>✕</button>
              </div>
              <div style={{ overflowY: 'auto', flex: 1, paddingRight: '10px' }} className="flex-col gap-4 pr-2">
                {allFeedbacks.length === 0 ? <p className="text-muted">No reviews yet.</p> :
                  allFeedbacks.map(f => (
                    <div key={f._id} className="p-4 rounded mb-4" style={{ background: 'var(--dark-light)', borderLeft: '4px solid var(--primary)' }}>
                      <h4 className="font-bold">{f.user?.name || 'Anonymous User'}</h4>
                      <div className="flex gap-4 mt-2 mb-2 text-sm text-yellow-500 font-bold" style={{ color: 'gold' }}>
                        <span>Food: {f.restaurantRating}★</span>
                        <span>Delivery: {f.deliveryRating}★</span>
                      </div>
                      <p className="text-sm text-muted">{f.feedbackText}</p>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}

        {/* My Orders Modal */}
        {showOrdersModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <div className="glass-panel animate-fade-in flex-col" style={{ width: '90%', maxWidth: '800px', maxHeight: '80vh', display: 'flex' }}>
              <div className="flex justify-between items-center mb-4">
                <h2>My Orders</h2>
                <button className="btn btn-outline" onClick={() => setShowOrdersModal(false)}>✕</button>
              </div>
              <div style={{ overflowY: 'auto', flex: 1, paddingRight: '10px' }}>
                {orders.length === 0 ? <p className="text-muted">You have no orders yet.</p> : (
                  <div className="grid-cards">
                    {orders.map(order => (
                      <div key={order._id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                        <div className="flex justify-between items-center mb-2">
                          <span style={{ fontWeight: 'bold' }}>Status: <span style={{ color: order.status === 'Completed' ? 'var(--success)' : 'var(--primary)' }}>{order.status}</span></span>
                          {['Accepted', 'Reached'].includes(order.status) && (
                            <span style={{ color: 'var(--secondary)' }}>Code: {order.confirmationCode}</span>
                          )}
                          {order.status === 'Waiting' && <span className="text-muted text-sm">Processing</span>}
                        </div>
                        {order.deliveryPerson && (
                          <div className="mb-2 p-2" style={{ background: 'var(--dark-light)', borderRadius: '8px' }}>
                            <p className="text-sm">Delivery By: {order.deliveryPerson.name}</p>
                            <p className="text-sm">Phone: {order.deliveryPerson.phone}</p>
                          </div>
                        )}
                        <div style={{ flex: 1 }}>
                          <p className="font-bold text-sm mb-2 mt-2">Order Breakdown:</p>
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
                          <div className="flex justify-between font-bold text-lg pt-2" style={{ borderTop: '1px solid var(--glass-border)' }}>
                            <span>Total Amount</span>
                            <span style={{ color: 'var(--primary)' }}>₹{order.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                        {order.status === 'Completed' && !order.feedbackSubmitted && (
                          <button className="btn btn-outline mt-2 w-full" onClick={() => {
                            setFeedbackOrder(order);
                            setShowOrdersModal(false);
                          }}>
                            Leave Feedback
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default UserDashboard;
