"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import React from "react";

export default function EditAbsensiPage() {
  const { absensiId } = useParams(); // ✅ Gunakan absensiId
  const router = useRouter();
  const [form, setForm] = useState({
    nama_peserta: "",
    nip_peserta: "",
    status_kehadiran: "Hadir",
  });

  useEffect(() => {
    const fetchAbsensi = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await axios.get(`http://localhost:8000/api/absensi/${absensiId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        setForm(res.data);
      } catch (err) {
        console.error("Gagal ambil data absensi:", err);
      }
    };

    fetchAbsensi();
  }, [absensiId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8000/api/absensi/${absensiId}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      router.back();
    } catch (err) {
      console.error("Gagal update absensi:", err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Edit Data Absensi</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nama Peserta</label>
          <input
            type="text"
            name="nama_peserta"
            value={form.nama_peserta}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>NIP Peserta</label>
          <input
            type="text"
            name="nip_peserta"
            value={form.nip_peserta}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Status Kehadiran</label>
          <select
            name="status_kehadiran"
            value={form.status_kehadiran}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="Hadir">Hadir</option>
            <option value="Tidak Hadir">Tidak Hadir</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Simpan Perubahan
        </button>
      </form>
    </div>
  );
}
