"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
        const token = localStorage.getItem('token');
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

  // const handleTambahPeserta = async (e: any) => {
  //   e.preventDefault();
  //   try {
  //     const token = localStorage.getItem('token');
  //     const res = await axios.post('http://localhost:8000/api/absensi', {
  //       id_rapat: rapatId,
  //       nama_peserta: namaPeserta,
  //       nip_peserta: nipPeserta,
  //       status_kehadiran: statusKehadiran,
  //     }, {
  //       headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
  //     });

  //     // Tambahkan peserta baru ke daftar
  //     setAbsensis(prev => [...prev, res.data]);

  //     // Reset form
  //     setNamaPeserta('');
  //     setNipPeserta('');
  //     setStatusKehadiran('Hadir');
  //     setShowModal(false); // Tutup modal setelah submit
  //   } catch (err) {
  //     console.error('Gagal menambahkan peserta:', err);
  //     alert('Gagal menambahkan peserta');
  //   }
  // };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Daftar Absensi Rapat: {judulRapat}</h2>

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

      {/* 🔥 Tombol Tambah Peserta
      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Tambah Peserta
        </button>
      </div> */}

      {/* 🔥 Modal Form Tambah Peserta */}
      {/* {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content p-4">
              <h5 className="mb-3">Tambah Peserta Manual</h5>
              <form onSubmit={handleTambahPeserta}>
                <div className="mb-3">
                  <label>Nama Peserta</label>
                  <input
                    type="text"
                    className="form-control"
                    value={namaPeserta}
                    onChange={(e) => setNamaPeserta(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>NIP Peserta</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nipPeserta}
                    onChange={(e) => setNipPeserta(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label>Status Kehadiran</label>
                  <select
                    className="form-control"
                    value={statusKehadiran}
                    onChange={(e) => setStatusKehadiran(e.target.value)}
                    required
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Tidak Hadir">Tidak Hadir</option>
                  </select>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-success">
                    Tambah
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
