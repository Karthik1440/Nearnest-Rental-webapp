import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      alert('❌ Please enter a valid email address');
      return;
    }

    try {
      // Step 1: Register the user
      await axios.post('http://localhost:8000/api/register/', formData);
      alert('✅ Registration successful! Logging you in...');

      // Step 2: Login the user immediately
      const loginRes = await axios.post('http://localhost:8000/api/token/', {
        email: formData.email,
        password: formData.password
      });

      // Step 3: Store token in cookies
      Cookies.set('access', loginRes.data.access);
      Cookies.set('refresh', loginRes.data.refresh);

      // Step 4: Redirect to home/profile
      navigate('/');
    } catch (err) {
      console.error(err.response?.data);
      alert('❌ Registration or login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-md bg-white rounded">
      <h2 className="text-xl font-bold mb-4">Signup</h2>

      <input
        type="text"
        placeholder="Name"
        className="w-full border p-2 mb-2"
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 mb-2"
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 mb-2"
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <input
        type="text"
        placeholder="Phone"
        className="w-full border p-2 mb-4"
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />

      <button
        className="w-full bg-green-500 text-white p-2 rounded"
        onClick={handleSubmit}
      >
        Signup
      </button>
    </div>
  );
}
