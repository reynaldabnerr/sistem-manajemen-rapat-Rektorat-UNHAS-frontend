"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';

export default function DashboardPage() {
  const [rapats, setRapats] = useState<any[]>([]);
  const [filteredRapats, setFilteredRapats] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRapat, setSelectedRapat] = useState<any>(null);
  const [copySuccess, setCopySuccess] = useState(""); // ✅ State untuk notifikasi copy
  const router = useRouter();

  useEffect(() => {
    const fetchRapats = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await axios.get('http://localhost:8000/api/rapat', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        });
        setRapats(res.data);
        setFilteredRapats(res.data);
      } catch (err) {
        console.error(err);
        router.push('/login');
      }
    };

    fetchRapats();
  }, [router]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);

    if (keyword.trim() === "") {
      setFilteredRapats(rapats);
    } else {
      const filtered = rapats.filter((rapat: any) =>
        rapat.judul_rapat.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredRapats(filtered);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus rapat ini?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/rapat/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });
      const updated = rapats.filter(r => r.id !== id);
      setRapats(updated);
      setFilteredRapats(updated);
    } catch (err) {
      console.error("Gagal menghapus rapat:", err);
    }
  };

  const handleDownload = (id: number) => {
    const canvas = document.getElementById(`qrcode-${id}`) as HTMLCanvasElement;
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `qrcode-rapat-${id}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleCopyLink = (linkAbsensi: string) => {
    const fullLink = `http://localhost:3000/absen/${linkAbsensi}`;
    navigator.clipboard.writeText(fullLink)
      .then(() => {
        setCopySuccess("Link berhasil disalin!");
        setTimeout(() => setCopySuccess(""), 2000);
      })
      .catch(() => {
        setCopySuccess("Gagal menyalin link.");
        setTimeout(() => setCopySuccess(""), 2000);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard Admin</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-success" onClick={() => router.push('/dashboard/create')}>
            + Buat Rapat Baru
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Cari judul rapat..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {filteredRapats.length === 0 ? (
        <p>Tidak ada rapat yang ditemukan.</p>
      ) : (
        <div className="list-group">
          {filteredRapats.map((rapat) => (
            <div key={rapat.id} className="list-group-item mb-4">
              <h5>{rapat.judul_rapat}</h5>
              <p>{rapat.tanggal_rapat} - {rapat.lokasi_rapat}</p>

              <div className="d-flex gap-2 mt-2 flex-wrap">
                <button className="btn btn-outline-primary btn-sm" onClick={() => router.push(`/dashboard/rapat/${rapat.id}/absensi`)}>
                  Lihat Absensi
                </button>

                <a
                  href={`http://localhost:8000/api/rapat/${rapat.id}/rekap`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-success btn-sm"
                >
                  Rekap PDF
                </a>

                <button className="btn btn-outline-warning btn-sm" onClick={() => router.push(`/dashboard/rapat/${rapat.id}/edit`)}>
                  Edit
                </button>

                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(rapat.id)}>
                  Hapus
                </button>

                <button className="btn btn-outline-info btn-sm" onClick={() => setSelectedRapat(rapat)}>
                  Tampilkan QR Code
                </button>

                {/* 🔥 Tombol Copy Link */}
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleCopyLink(rapat.link_absensi)}
                >
                  Copy Link
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal QR Code */}
      {selectedRapat && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">QR Code - {selectedRapat.judul_rapat}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedRapat(null)}></button>
              </div>
              <div className="modal-body text-center">
                <QRCodeCanvas
                  id={`qrcode-${selectedRapat.id}`}
                  value={`http://localhost:3000/absen/${selectedRapat.link_absensi}`}
                  size={200}
                  level="H"
                  includeMargin
                />
                <br />
                <button className="btn btn-primary mt-3" onClick={() => handleDownload(selectedRapat.id)}>
                  Download QR Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Notifikasi Copy */}
      {copySuccess && (
        <div className="toast show position-fixed bottom-0 end-0 m-3 bg-success text-white p-3">
          {copySuccess}
        </div>
      )}
    </div>
  );
}
