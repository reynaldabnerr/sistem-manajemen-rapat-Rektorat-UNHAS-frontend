"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SuperAdminPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const fetchAdmins = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:8000/api/admins", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins(res.data);
    } catch (error) {
      console.error("Gagal memuat data admin:", error);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "superadmin") {
      router.push("/dashboard");
    } else {
      fetchAdmins(); // ✅ hanya fetch kalau role benar
    }
  }, [router]);

  const handleAdd = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:8000/api/admins", form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setForm({ name: "", email: "", password: "" });
    fetchAdmins();
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (confirm("Yakin hapus admin ini?")) {
      await axios.delete(`http://localhost:8000/api/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAdmins();
    }
  };

  return (
    <div className="container mt-5">
      <h2>Kelola Admin</h2>

      <form onSubmit={handleAdd} className="mb-4">
        <div className="row g-2">
          <div className="col-md-3">
            <input
              type="text"
              placeholder="Nama"
              className="form-control"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="email"
              placeholder="Email"
              className="form-control"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <button type="submit" className="btn btn-success w-100">
              Tambah Admin
            </button>
          </div>
        </div>
      </form>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.name}</td>
              <td>{admin.email}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(admin.id)}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
