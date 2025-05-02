"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import React from 'react';

export default function EditRapatPage() {
  const { id } = useParams();
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
      const res = await axios.get(`http://localhost:8000/api/rapat/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });
      setForm(res.data);
    };

    fetchRapat();
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:8000/api/rapat/${id}`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });
    router.push('/dashboard');
  };

  return (
    <div className="container mt-5" style={{ color: 'black' }}>
      <h2>Edit Rapat</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Judul Rapat</label>
          <input
            type="text"
            className="form-control"
            name="judul_rapat"
            value={form.judul_rapat}
            onChange={handleChange}
            style={{ color: 'black' }}
          />
        </div>
        <div className="mb-3">
          <label>Tanggal Rapat</label>
          <input
            type="date"
            className="form-control"
            name="tanggal_rapat"
            value={form.tanggal_rapat}
            onChange={handleChange}
            style={{ color: 'black' }}
          />
        </div>
        <div className="mb-3">
          <label>Lokasi Rapat</label>
          <input
            type="text"
            className="form-control"
            name="lokasi_rapat"
            value={form.lokasi_rapat}
            onChange={handleChange}
            style={{ color: 'black' }}
          />
        </div>
        <div className="mb-3">
          <label>Deskripsi</label>
          <textarea
            className="form-control"
            name="deskripsi_rapat"
            value={form.deskripsi_rapat}
            onChange={handleChange}
            style={{ color: 'black' }}
          />
        </div>

        {/* Tombol Kembali */}
        <div className="d-flex justify-content-between mb-3">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => router.back()}
          >
            Kembali
          </button>
          <button type="submit" className="btn btn-primary">
            Update Rapat
          </button>
        </div>
      </form>
    </div>
  );
}
