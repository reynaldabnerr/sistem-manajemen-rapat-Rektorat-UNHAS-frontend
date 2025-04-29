"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';

export default function AbsensiPage() {
  const { id } = useParams();
  const router = useRouter();
  const [absensis, setAbsensis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbsensi = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:8000/api/rapat/${id}/absensi`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        });
        setAbsensis(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAbsensi();
  }, [id]);

  const handleDelete = async (absensiId: number) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/absensi/${absensiId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });
      setAbsensis(prev => prev.filter(a => a.id !== absensiId));
    } catch (err) {
      console.error('Gagal menghapus:', err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Daftar Absensi</h2>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Nama</th>
            <th>NIP</th>
            <th>Status Kehadiran</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {absensis.map((a, i) => (
            <tr key={i}>
              <td>{a.nama_peserta}</td>
              <td>{a.nip_peserta}</td>
              <td>{a.status_kehadiran}</td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => router.push(`/dashboard/absensi/${a.id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(a.id)}
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
