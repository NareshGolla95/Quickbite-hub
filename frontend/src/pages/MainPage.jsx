import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, ShieldCheck, ShoppingBag, Package } from 'lucide-react';

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center animate-fade-in" style={{ minHeight: '100vh', padding: '2rem' }}>
      
      <div className="text-center mb-10">
        <ChefHat size={80} className="mb-4" style={{ color: 'var(--primary)', margin: '0 auto' }} />
        <h1 className="mb-2" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800 }}>Welcome to <br className="hidden-mobile" /><span style={{ color: 'var(--primary)' }}>Quick Bite Hub</span></h1>
        <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>Your premium online food delivery experience. Select your portal to proceed.</p>
      </div>
        
      <div className="grid-cards p-4" style={{ maxWidth: '1000px', width: '100%', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', padding: 0 }}>
        
        {/* Admin Card */}
        <div 
          className="glass-panel text-center card" 
          onClick={() => navigate('/admin/login')}
          style={{ cursor: 'pointer', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', border: '1px solid rgba(255,107,107,0.2)' }}
        >
          <div className="icon-wrapper" style={{ background: 'rgba(255,107,107,0.1)', padding: '1.5rem', borderRadius: '50%' }}>
             <ShieldCheck size={48} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>Admin</h2>
          <p className="text-muted" style={{ fontSize: '0.95rem' }}>Manage items, users, and feedback</p>
        </div>

        {/* User Card */}
        <div 
          className="glass-panel text-center card" 
          onClick={() => navigate('/user/auth')}
          style={{ cursor: 'pointer', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', border: '1px solid rgba(78,205,196,0.2)' }}
        >
          <div className="icon-wrapper" style={{ background: 'rgba(78,205,196,0.1)', padding: '1.5rem', borderRadius: '50%' }}>
             <ShoppingBag size={48} style={{ color: 'var(--secondary)' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>User</h2>
          <p className="text-muted" style={{ fontSize: '0.95rem' }}>Browse items and place orders</p>
        </div>

        {/* Delivery Card */}
        <div 
          className="glass-panel text-center card" 
          onClick={() => navigate('/delivery/auth')}
          style={{ cursor: 'pointer', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', border: '1px solid rgba(46,213,115,0.2)' }}
        >
          <div className="icon-wrapper" style={{ background: 'rgba(46,213,115,0.1)', padding: '1.5rem', borderRadius: '50%' }}>
             <Package size={48} style={{ color: 'var(--success)' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginTop: '0.5rem' }}>Delivery</h2>
          <p className="text-muted" style={{ fontSize: '0.95rem' }}>Manage and deliver orders</p>
        </div>

      </div>
    </div>
  );
};

export default MainPage;
