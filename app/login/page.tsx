"use client";

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const res = await axios.post('http://localhost:8000/api/login', {
        email,
        password,
      }, {
        headers: { Accept: 'application/json' }
      });
  
      const token = res.data.token;
      const user = res.data.user;
  
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role); // ✅ simpan role jika dibutuhkan
  
      if (user.role === 'superadmin') {
        router.push('/dashboard/superadmin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Email atau password salah!');
    }
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: '400px' }}>
        <h2 className="mb-4 text-center">Login Admin</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required />
          </div>
          {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
}
