"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

export default function SuperAdminPage() {
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [admins, setAdmins] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });
  const [successMsg, setSuccessMsg] = useState("");
  

  useEffect(() => {
    // hanya dijalankan di client
    setMounted(true);
    setRole(localStorage.getItem("role"));
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (role !== "superadmin") {
      router.push("/dashboard");
    } else {
      fetchAdmins();
    }
  }, [mounted, role]);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(res.data);
    } catch (error) {
      console.error("Gagal memuat data admin:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/admins", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ name: "", email: "", password: "" });
      setSuccessMsg("✅ Admin berhasil ditambahkan!");
      fetchAdmins();
    } catch {
      alert("Gagal menambah admin. Cek data Anda.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus admin ini?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessMsg("✅ Admin berhasil dihapus!");
      fetchAdmins();
    } catch {
      alert("Gagal menghapus admin.");
    }
  };

  const handleEdit = (admin: any) => {
    setEditId(admin.id);
    setEditForm({ name: admin.name, email: admin.email });
  };

  const handleUpdate = async () => {
    if (!editId) return;
    try {
      await axios.put(
        `http://localhost:8000/api/admins/${editId}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMsg("✅ Admin berhasil diperbarui!");
      setEditId(null);
      fetchAdmins();
    } catch {
      alert("Gagal memperbarui admin.");
    }
  };

  if (!mounted) return null; // Hindari hydration error

  return (
    <div className="d-flex">
      {/* Sidebar */}
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
          <img src="/images/Logo-Unhas.png" alt="Logo" style={{ width: "60px" }} />
          <h6 className="ms-2" style={{ fontSize: "0.9rem" }}>
            Manajemen Rapat Unhas
          </h6>
        </div>

        <nav>
          <ul className="nav flex-column gap-2">
            {[
              { label: "Dashboard", path: "/dashboard" },
              { label: "History", path: "/dashboard/history" },
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
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#004080")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
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
        <div className="container">
          <h2 className="mb-4">Kelola Admin</h2>

          {successMsg && (
            <div className="alert alert-success">{successMsg}</div>
          )}

          <form onSubmit={handleAdd} className="mb-5">
            <div className="row g-2">
              <div className="col-md-3">
                <input
                  type="text"
                  placeholder="Nama Admin"
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  type="email"
                  placeholder="Email Admin"
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

          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id}>
                    <td>
                      {editId === admin.id ? (
                        <input
                          type="text"
                          className="form-control"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        />
                      ) : (
                        admin.name
                      )}
                    </td>
                    <td>
                      {editId === admin.id ? (
                        <input
                          type="email"
                          className="form-control"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        />
                      ) : (
                        admin.email
                      )}
                    </td>
                    <td className="text-center">
                      {editId === admin.id ? (
                        <>
                          <button className="btn btn-sm btn-primary me-2" onClick={handleUpdate}>
                            Simpan
                          </button>
                          <button className="btn btn-sm btn-secondary" onClick={() => setEditId(null)}>
                            Batal
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(admin)}>
                            Edit
                          </button>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(admin.id)}>
                            Hapus
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
