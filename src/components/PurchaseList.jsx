import { api } from "../api";

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }) +
    " · " +
    d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

export default function PurchaseList({ purchases, onChanged }) {
  const handleDelete = async (id) => {
    await api.deletePurchase(id);
    onChanged();
  };

  if (purchases.length === 0) {
    return <p className="empty-state">Пока нет покупок. Добавьте первую выше 👆</p>;
  }

  return (
    <div className="card">
      <h3>Последние покупки</h3>
      <ul className="purchase-list">
        {purchases.map((p) => (
          <li key={p.id} className="purchase-item">
            <span className="p-icon" style={{ background: p.category?.color || "#999" }}>
              {p.category?.icon || "❔"}
            </span>
            <div className="p-info">
              <div className="p-top">
                <span className="p-category">{p.category?.name || "Без категории"}</span>
                <span className="p-amount">{p.amount.toFixed(0)} ₽</span>
              </div>
              <div className="p-bottom">
                <span className="p-desc">{p.description || "—"}</span>
                <span className="p-date">{formatDate(p.date)}</span>
              </div>
            </div>
            <button className="btn-delete" onClick={() => handleDelete(p.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
