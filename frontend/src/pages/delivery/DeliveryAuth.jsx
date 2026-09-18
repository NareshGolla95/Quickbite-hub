import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bike } from 'lucide-react';
import useStore from '../../store';
import { API_URL } from "../../api";

const DeliveryAuth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const initialFormData = {
    name: '',
    email: '',
    password: '',
    phone: '',
    bikeNumber: '',
    photo: 'avatar.png'
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
          `${API_URL}/api/auth/login`,
          {
            email: formData.email,
            password: formData.password,
            role: 'delivery'
          }
        );

        setUser(res.data.user);
        sessionStorage.setItem('deliveryToken', res.data.token);
        navigate('/delivery/dashboard');
      } else {
        const res = await axios.post(
          `${API_URL}/api/auth/register`,
          {
            ...formData,
            role: 'delivery'
          }
        );

        setUser(res.data.user);
        sessionStorage.setItem('deliveryToken', res.data.token);
        navigate('/delivery/dashboard');
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
          <Bike
            size={48}
            style={{
              color: 'var(--secondary)',
              margin: '0 auto'
            }}
          />

          <h2>
            Delivery {isLogin ? 'Login' : 'Registration'}
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
                name="delivery_full_name"
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
                name="delivery_phone"
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
                name="delivery_bike_number"
                autoComplete="off"
                placeholder="Bike Number"
                value={formData.bikeNumber}
                onChange={e => {
                  setFormData({
                    ...formData,
                    bikeNumber: e.target.value
                  });
                  setError('');
                }}
                required
              />
            </>
          )}

          <input
            type="email"
            name="delivery_login_email"
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
            name="delivery_login_password"
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
            className="btn btn-secondary w-full justify-center"
          >
            {isLogin ? 'Login' : 'Register as Partner'}
          </button>

        </div>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={handleAuthSwitch}
            style={{ color: 'var(--primary)' }}
          >
            {isLogin
              ? 'Join the fleet? Register'
              : 'Already a partner? Login'}
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

export default DeliveryAuth;