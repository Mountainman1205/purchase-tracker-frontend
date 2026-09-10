import { useRef, useState } from "react";
import { api } from "../api";

export default function ReceiptUpload({ onSuccess }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    try {
      const purchase = await api.uploadReceipt(file);
      onSuccess?.(purchase);
    } catch (err) {
      setError("Не удалось распознать чек. Попробуй фото почётче.");
      console.error(err);
    } finally {
      setLoading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <button onClick={() => inputRef.current?.click()} disabled={loading}>
        {loading ? "Распознаём..." : "📷 Добавить чек"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleFile}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
