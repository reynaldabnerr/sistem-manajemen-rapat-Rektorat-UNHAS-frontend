"use client";

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <h1 className="mb-4" style={{ color: '#212529', fontWeight: 'bold' }}>
          Selamat Datang di Sistem Manajemen Rapat
        </h1>
        <p className="mb-4" style={{ color: '#495057' }}>
          Kelola rapat dengan mudah dan efisien. Silakan login untuk memulai!
        </p>
        <button onClick={handleLoginClick} className="btn btn-danger btn-lg rounded-pill">
          Masuk ke Login Admin
        </button>
      </div>
    </div>
  );
}
