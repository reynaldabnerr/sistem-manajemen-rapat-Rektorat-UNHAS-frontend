"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PublicAbsensiPage() {
  const params = useParams();
  const linkAbsensi = params.linkAbsensi as string;
  const router = useRouter();

  const [rapatInfo, setRapatInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [namaPeserta, setNamaPeserta] = useState("");
  const [nipPeserta, setNipPeserta] = useState("");
  const [statusKehadiran, setStatusKehadiran] = useState("Hadir");

  const [submitLoading, setSubmitLoading] = useState(false); // 🔥 Spinner loading submit

  useEffect(() => {
    const fetchRapat = async () => {
      if (!linkAbsensi) {
        setError("Link absensi tidak valid.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:8000/api/absensi-link/${linkAbsensi}`);
        setRapatInfo(res.data);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Link absensi tidak ditemukan atau sudah tidak berlaku.");
      } finally {
        setLoading(false);
      }
    };

    fetchRapat();
  }, [linkAbsensi]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitLoading(true); // Mulai spinner

    try {
      await axios.post(`http://localhost:8000/api/absensi-link/${linkAbsensi}`, {
        id_rapat: rapatInfo.id,
        nama_peserta: namaPeserta,
        nip_peserta: nipPeserta,
        status_kehadiran: statusKehadiran,
      });

      router.push('/thanks');
    } catch (err) {
      console.error("Gagal submit absensi:", err);
      setError("Gagal submit absensi. Coba lagi.");
    } finally {
      setSubmitLoading(false); // Selesai spinner
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Absensi Rapat: {rapatInfo.judul_rapat}</h2>

      <form onSubmit={handleSubmit}>
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

        <button type="submit" className="btn btn-primary w-100" disabled={submitLoading}>
          {submitLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Mengirim...
            </>
          ) : (
            "Submit Absensi"
          )}
        </button>
      </form>
    </div>
  );
}
