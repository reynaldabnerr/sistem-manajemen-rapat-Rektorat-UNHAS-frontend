"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function AbsensiPage() {
  const { rapatId } = useParams();
  const router = useRouter();
  const [absensis, setAbsensis] = useState<any[]>([]);
  const [judulRapat, setJudulRapat] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  const [namaPeserta, setNamaPeserta] = useState('');
  const [nipPeserta, setNipPeserta] = useState('');
  const [statusKehadiran, setStatusKehadiran] = useState('Hadir');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const absensiRes = await axios.get(`http://localhost:8000/api/rapat/${rapatId}/absensi`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
        });
        setAbsensis(absensiRes.data);

        const rapatRes = await axios.get(`http://localhost:8000/api/rapat/${rapatId}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
        });
        setJudulRapat(rapatRes.data.judul_rapat);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [rapatId, router]);

  const handleDelete = async (absensiId: number) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/absensi/${absensiId}`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
      });
      setAbsensis(prev => prev.filter(a => a.id !== absensiId));
    } catch (err) {
      console.error('Gagal menghapus:', err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4" style={{ color: 'black' }}>Daftar Absensi Rapat : {judulRapat}</h2>

      {/* Tombol Kembali */}
      <button
        className="btn btn-secondary mb-4"
        onClick={() => router.back()} // Tombol untuk kembali ke halaman sebelumnya
      >
        Kembali
      </button>

      {absensis.length === 0 ? (
        <p>Belum ada peserta absensi.</p>
      ) : (
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
      )}
    </div>
  );
}
