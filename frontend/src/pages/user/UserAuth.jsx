import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserCircle } from 'lucide-react';
import useStore from '../../store';

const UserAuth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const initialFormData = {
    name: '',
    email: '',
    password: '',
    phone: '',
    location: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const setUser = useStore(state => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await axios.post(
          'http://localhost:5000/api/auth/login',
          {
            email: formData.email,
            password: formData.password,
            role: 'user'
          }
        );

        setUser(res.data.user);
        sessionStorage.setItem('userToken', res.data.token);
        navigate('/user/dashboard');
      } else {
        const res = await axios.post(
          'http://localhost:5000/api/auth/register',
          {
            ...formData,
            role: 'user'
          }
        );

        setUser(res.data.user);
        sessionStorage.setItem('userToken', res.data.token);
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Authentication failed'
      );

      setFormData({
        ...formData,
        password: ''
      });
    }
  };

  const handleAuthSwitch = () => {
    setIsLogin(!isLogin);
    setFormData(initialFormData);
    setError('');
  };

  return (
    <div
      className="flex flex-col items-center justify-center animate-fade-in"
      style={{ minHeight: '100vh' }}
    >
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="glass-panel w-full"
        style={{ maxWidth: '400px' }}
      >

        <div className="text-center mb-4">
          <UserCircle
            size={48}
            style={{
              color: 'var(--primary)',
              margin: '0 auto'
            }}
          />

          <h2>
            User {isLogin ? 'Login' : 'Registration'}
          </h2>
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

          {!isLogin && (
            <>
              <input
                type="text"
                name="user_full_name"
                autoComplete="off"
                placeholder="Full Name"
                value={formData.name}
                onChange={e => {
                  setFormData({
                    ...formData,
                    name: e.target.value
                  });
                  setError('');
                }}
                required
              />

              <input
                type="tel"
                name="user_phone"
                autoComplete="off"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={e => {
                  setFormData({
                    ...formData,
                    phone: e.target.value
                  });
                  setError('');
                }}
                required
              />

              <input
                type="text"
                name="user_location"
                autoComplete="off"
                placeholder="Delivery Address"
                value={formData.location}
                onChange={e => {
                  setFormData({
                    ...formData,
                    location: e.target.value
                  });
                  setError('');
                }}
                required
              />
            </>
          )}

          <input
            type="email"
            name="user_login_email"
            autoComplete="off"
            placeholder="Email"
            value={formData.email}
            onChange={e => {
              setFormData({
                ...formData,
                email: e.target.value
              });
              setError('');
            }}
            required
          />

          <input
            type="password"
            name="user_login_password"
            autoComplete="new-password"
            placeholder="Password"
            value={formData.password}
            onChange={e => {
              setFormData({
                ...formData,
                password: e.target.value
              });
              setError('');
            }}
            required
          />

          <button
            type="submit"
            className="btn btn-primary w-full justify-center"
          >
            {isLogin ? 'Login' : 'Create Account'}
          </button>

        </div>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={handleAuthSwitch}
            style={{ color: 'var(--secondary)' }}
          >
            {isLogin
              ? "Don't have an account? Register"
              : 'Already have an account? Login'}
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

export default UserAuth;