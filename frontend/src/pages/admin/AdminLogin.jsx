import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (
      email === 'quickbitehub95@gmail.com' &&
      password === 'quickbite@95'
    ) {
      sessionStorage.setItem('adminAuth', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials');

      setPassword('');
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center animate-fade-in"
      style={{ minHeight: '100vh' }}
    >
      <form
        onSubmit={handleLogin}
        autoComplete="off"
        className="glass-panel w-full"
        style={{ maxWidth: '400px' }}
      >

        <div className="text-center mb-4">
          <Lock
            size={48}
            style={{
              color: 'var(--primary)',
              margin: '0 auto'
            }}
          />

          <h2>Admin Access</h2>
        </div>

        {error && (
          <div
            style={{
              color: 'var(--primary)',
              marginBottom: '1rem',
              textAlign: 'center'
            }}
          >
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">

          <input
            type="email"
            name="admin_login_email"
            autoComplete="off"
            placeholder="Admin Email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              setError('');
            }}
            required
          />

          <input
            type="password"
            name="admin_login_password"
            autoComplete="new-password"
            placeholder="Password"
            value={password}
            onChange={e => {
              setPassword(e.target.value);
              setError('');
            }}
            required
          />

          <button
            type="submit"
            className="btn btn-primary w-full justify-center"
          >
            Login to Dashboard
          </button>

        </div>

        <button
          type="button"
          className="btn mt-4 w-full justify-center"
          onClick={() => navigate('/')}
        >
          Back to Home
        </button>

      </form>
    </div>
  );
};

export default AdminLogin;