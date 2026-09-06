import { useState } from "react";
import { api } from "../api";

export default function BudgetList({ budgetsStatus, categories, onChanged }) {
  const [showForm, setShowForm] = useState(false);
  const [limitAmount, setLimitAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [period, setPeriod] = useState("month");

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!limitAmount) return;
    await api.createBudget({
      limit_amount: Number(limitAmount),
      category_id: categoryId || null,
      period,
    });
    setLimitAmount("");
    setCategoryId("");
    setShowForm(false);
    onChanged();
  };

  const handleDelete = async (id) => {
    await api.deleteBudget(id);
    onChanged();
  };

  return (
    <div className="card">
      <div className="row-between">
        <h3>Бюджеты</h3>
        <button className="btn-link" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Отмена" : "+ Добавить"}
        </button>
      </div>

      {showForm && (
        <form className="budget-form" onSubmit={handleCreate}>
          <input
            type="number"
            placeholder="Лимит, ₽"
            value={limitAmount}
            onChange={(e) => setLimitAmount(e.target.value)}
            required
          />
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Все категории</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="month">На месяц</option>
            <option value="week">На неделю</option>
          </select>
          <button type="submit" className="btn-primary">
            Создать
          </button>
        </form>
      )}

      {budgetsStatus.length === 0 && !showForm && (
        <p className="empty-state">Лимиты не заданы. Добавьте, чтобы отслеживать траты.</p>
      )}

      <ul className="budget-list">
        {budgetsStatus.map((bs) => {
          const isOver = bs.percent_used >= 100;
          const isWarn = bs.percent_used >= 80 && !isOver;
          return (
            <li key={bs.budget.id} className="budget-item">
              <div className="row-between">
                <span>
                  {bs.budget.category ? `${bs.budget.category.icon} ${bs.budget.category.name}` : "💼 Общий бюджет"}
                  {" "}
                  ({bs.budget.period === "month" ? "месяц" : "неделя"})
                </span>
                <button className="btn-delete" onClick={() => handleDelete(bs.budget.id)}>
                  ✕
                </button>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-fill ${isOver ? "over" : isWarn ? "warn" : ""}`}
                  style={{ width: `${Math.min(bs.percent_used, 100)}%` }}
                />
              </div>
              <div className="budget-numbers">
                <span>{bs.spent.toFixed(0)} ₽ из {bs.budget.limit_amount.toFixed(0)} ₽</span>
                <span>{bs.percent_used}%</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
