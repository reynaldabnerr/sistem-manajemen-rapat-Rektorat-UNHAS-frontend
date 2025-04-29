"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CreateRapatPage() {
  const [judul, setJudul] = useState('');
  const [tanggal, setTanggal] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token tidak ditemukan. Silakan login ulang.');
        return;
      }

      await axios.post('http://localhost:8000/api/rapat', {
        judul_rapat: judul,
        tanggal_rapat: tanggal,
        lokasi_rapat: lokasi,
        deskripsi_rapat: deskripsi,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        }
      });

      router.push('/dashboard'); // setelah sukses tambah rapat, balik ke dashboard
    } catch (err) {
      console.error(err);
      setError('Gagal menambahkan rapat. Pastikan semua data sudah benar.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Tambah Rapat Baru</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Judul Rapat</label>
          <input
            type="text"
            className="form-control"
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Tanggal Rapat</label>
          <input
            type="date"
            className="form-control"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Lokasi Rapat</label>
          <input
            type="text"
            className="form-control"
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Deskripsi Rapat</label>
          <textarea
            className="form-control"
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
          ></textarea>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-success w-100">Tambah Rapat</button>
      </form>
    </div>
  );
}
