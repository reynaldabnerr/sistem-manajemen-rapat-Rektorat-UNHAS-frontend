"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { QRCodeCanvas } from 'qrcode.react';

export default function DashboardPage() {
  const [rapats, setRapats] = useState<any[]>([]);
  const [filteredRapats, setFilteredRapats] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedRapat, setSelectedRapat] = useState<any>(null);
  const [copySuccess, setCopySuccess] = useState(""); // State for copy notification
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  useEffect(() => {
    setRole(localStorage.getItem('role'));
  }, []);

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
    const confirmDelete = confirm("Yakin ingin menghapus rapat ini?");
    if (!confirmDelete) return;

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleCopyLink = (linkAbsensi: string) => {
    const fullLink = `http://localhost:3000/absen/${linkAbsensi}`;
    navigator.clipboard.writeText(fullLink)
      .then(() => {
        setCopySuccess("Link berhasil disalin!");
        setTimeout(() => setCopySuccess(""), 2000); // Hide the toast after 2 seconds
      })
      .catch(() => {
        setCopySuccess("Gagal menyalin link.");
        setTimeout(() => setCopySuccess(""), 2000); // Hide the toast after 2 seconds
      });
  };

  return (
    <div className="d-flex">
      <aside
        className="bg-navy text-white p-4 flex-shrink-0"
        style={{
          width: "250px",
          minHeight: "100vh",
          backgroundColor: "#002147",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div className="d-flex align-items-center mb-4">
          <img
            src="/images/Logo-Unhas.png"
            alt="Logo"
            style={{ width: "60px", height: "auto" }}
          />
          <h6 className="ms-2" style={{ fontSize: "0.9rem" }}>
            Manajemen Rapat Unhas
          </h6>
        </div>

        <nav>
          <ul className="nav flex-column gap-2">
            {[
              { label: "Dashboard", path: "/dashboard" },
              { label: "History",   path: "/dashboard/history" },
              // kondisional
              ...(role === "superadmin"
                ? [{ label: "Manage Admin", path: "/dashboard/superadmin" }]
                : []),
            ].map((item, i) => (
              <li key={i} className="nav-item">
                <button
                  className={`btn btn-link text-white w-100 text-start ${
                    pathname === item.path ? 'bg-primary' : ''
                  }`}
                  style={{ textDecoration: "none" }}
                  onClick={() => router.push(item.path)}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#004080")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto">
          <button className="btn btn-danger w-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 p-5 bg-light">
        <div className="container mt-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{ color: "black" }}>Dashboard Admin</h2>
            <div className="d-flex gap-2">
              <button className="btn btn-success" onClick={() => router.push('/dashboard/create')}>
                + Buat Rapat Baru
              </button>
            </div>
          </div>

          <div className="mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Cari judul rapat..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {filteredRapats.length === 0 ? (
            <div className="alert alert-warning text-center">Tidak ada rapat yang ditemukan.</div>
          ) : (
            <div className="row">
              {filteredRapats.map((rapat) => (
                <div key={rapat.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title text-primary">{rapat.judul_rapat}</h5>
                      <p className="card-text text-muted">
                        {rapat.tanggal_rapat} - {rapat.lokasi_rapat}
                      </p>
                      <div className="d-flex flex-wrap gap-2 mt-3">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => router.push(`/dashboard/rapat/${rapat.id}/absensi`)}
                        >
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
                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => router.push(`/dashboard/rapat/${rapat.id}/edit`)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(rapat.id)}
                        >
                          Hapus
                        </button>
                        <button
                          className="btn btn-outline-info btn-sm"
                          onClick={() => setSelectedRapat(rapat)}
                        >
                          Tampilkan QR Code
                        </button>

                        {/* Tombol Copy Link */}
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => handleCopyLink(rapat.link_absensi)}
                        >
                          Copy Link
                        </button>
                      </div>
                    </div>
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
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setSelectedRapat(null)}
                    ></button>
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
                    <button
                      className="btn btn-primary mt-3"
                      onClick={() => handleDownload(selectedRapat.id)}
                    >
                      Download QR Code
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Toast Notification for Copy Link Success */}
        {copySuccess && (
          <div
            className="toast show position-fixed bottom-0 end-0 m-3 bg-success text-white p-3"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            {copySuccess}
          </div>
        )}
      </main>
    </div>
  );
}
