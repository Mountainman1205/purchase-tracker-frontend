import { useState } from "react";
import { api } from "../api";
import { hapticFeedback } from "../telegram";

export default function AddPurchase({ categories, onAdded }) {
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    setSaving(true);
    try {
      await api.createPurchase({
        amount: Number(amount),
        category_id: categoryId || null,
        description: description || null,
      });
      hapticFeedback("medium");
      setAmount("");
      setDescription("");
      onAdded();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card add-purchase" onSubmit={handleSubmit}>
      <div className="row">
        <input
          type="number"
          inputMode="decimal"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="amount-input"
          required
        />
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>
      </div>
      <input
        type="text"
        placeholder="Комментарий (необязательно)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="desc-input"
      />
      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? "Добавляем..." : "Добавить покупку"}
      </button>
    </form>
  );
}
