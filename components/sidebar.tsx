"use client";

import { usePathname, useRouter } from "next/navigation";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // ← ini WAJIB untuk hamburger/offcanvas

import { useState } from "react";

interface SidebarProps {
  role: string | null;
  onLogout: () => void;
}

export default function Sidebar({ role, onLogout }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "History", path: "/dashboard/history" },
    ...(role === "superadmin"
      ? [{ label: "Manage Admin", path: "/dashboard/superadmin" }]
      : []),
  ];

  return (
    <>
      {/* Topbar untuk mobile */}
      <nav className="navbar bg-primary d-md-none px-3">
        <button
          className="btn btn-outline-light"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileSidebar"
        >
          ☰
        </button>
        <span className="text-white ms-3 fw-bold">Manajemen Rapat Unhas</span>
      </nav>

      {/* Sidebar Offcanvas (mobile) */}
      <div
        className="offcanvas offcanvas-start bg-primary text-white"
        tabIndex={-1}
        id="mobileSidebar"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Menu</h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>
        <div className="offcanvas-body d-flex flex-column">
          {navigationItems.map((item, i) => (
            <button
              key={i}
              className={`btn btn-link text-white text-start ${
                pathname === item.path ? "bg-dark" : ""
              }`}
              onClick={() => {
                router.push(item.path);
                document.body.classList.remove("offcanvas-backdrop");
              }}
            >
              {item.label}
            </button>
          ))}
          <div className="mt-auto">
            <button className="btn btn-danger w-100" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar tetap (desktop) */}
      <aside
        className="d-none d-md-flex flex-column bg-primary text-white p-3"
        style={{ width: "250px", minHeight: "100vh" }}
      >
        <div className="d-flex align-items-center mb-4">
          <img src="/images/Logo-Unhas.png" alt="Logo" style={{ width: "60px" }} />
          <h6 className="ms-2">Manajemen Rapat Unhas</h6>
        </div>
        <nav className="nav flex-column mb-4">
          {navigationItems.map((item, i) => (
            <button
              key={i}
              className={`btn btn-link text-white text-start ${
                pathname === item.path ? "bg-dark" : ""
              }`}
              onClick={() => router.push(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button className="btn btn-danger w-100 mt-auto" onClick={onLogout}>
          Logout
        </button>
      </aside>
    </>
  );
}
