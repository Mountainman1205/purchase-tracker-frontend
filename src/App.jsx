import { useEffect, useState, useCallback } from "react";
import { initTelegram } from "./telegram";
import { api } from "./api";
import AddPurchase from "./components/AddPurchase";
import PurchaseList from "./components/PurchaseList";
import StatsCharts from "./components/StatsCharts";
import BudgetList from "./components/BudgetList";
import ReceiptUpload from "./components/ReceiptUpload";

const TABS = [
  { id: "home", label: "Главная" },
  { id: "stats", label: "Аналитика" },
  { id: "budgets", label: "Бюджеты" },
];

export default function App() {
  const [tab, setTab] = useState("home");
  const [categories, setCategories] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [summary, setSummary] = useState(null);
  const [budgetsStatus, setBudgetsStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAll = useCallback(async () => {
    try {
      const [cats, purch, stats, budgets] = await Promise.all([
        api.getCategories(),
        api.getPurchases({ limit: 30 }),
        api.getStatsSummary(),
        api.getBudgetsStatus(),
      ]);
      setCategories(cats);
      setPurchases(purch);
      setSummary(stats);
      setBudgetsStatus(budgets);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initTelegram();
    loadAll();
  }, [loadAll]);

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return (
      <div className="loading error">
        Ошибка подключения к серверу.
        <br />
        {error}
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>💰 Трекер покупок</h1>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="app-content">
        {tab === "home" && (
          <>
            <AddPurchase categories={categories} onAdded={loadAll} />
            <PurchaseList purchases={purchases} onChanged={loadAll} />
          </>
        )}
        {tab === "stats" && <StatsCharts summary={summary} />}
        {tab === "budgets" && (
          <BudgetList
            budgetsStatus={budgetsStatus}
            categories={categories}
            onChanged={loadAll}
          />
        )}
      </main>
    </div>
  );
}
