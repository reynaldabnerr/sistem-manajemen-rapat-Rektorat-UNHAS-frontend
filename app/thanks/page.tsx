"use client";

import { useRouter } from "next/navigation";

export default function ThanksPage() {
  const router = useRouter();
  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-body text-center">
          <h2 className="card-title mb-3 text-success">🎉 Terima Kasih!</h2>
          <p className="card-text">Absensi Anda telah berhasil direkam.</p>
          </div>
        </div>
      </div>
  );
}
