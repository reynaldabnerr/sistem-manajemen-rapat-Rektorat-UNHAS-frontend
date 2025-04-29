"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function EditRapatPage() {
  const { rapatId } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    judul_rapat: '',
    tanggal_rapat: '',
    lokasi_rapat: '',
    deskripsi_rapat: ''
  });

  useEffect(() => {
    const fetchRapat = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
      const res = await axios.get(`http://localhost:8000/api/rapat/${rapatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });
      setForm(res.data);
    };

    fetchRapat();
  }, [rapatId]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:8000/api/rapat/${rapatId}`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });
    router.push('/dashboard');
  };

  return (
    <div className="container mt-5">
      <h2>Edit Rapat</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Judul Rapat</label>
          <input type="text" className="form-control" name="judul_rapat" value={form.judul_rapat} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Tanggal Rapat</label>
          <input type="date" className="form-control" name="tanggal_rapat" value={form.tanggal_rapat} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Lokasi Rapat</label>
          <input type="text" className="form-control" name="lokasi_rapat" value={form.lokasi_rapat} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Deskripsi</label>
          <textarea className="form-control" name="deskripsi_rapat" value={form.deskripsi_rapat} onChange={handleChange}></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Update Rapat</button>
      </form>
    </div>
  );
}
