import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export default function StatsCharts({ summary }) {
  if (!summary) return null;

  const { by_category, by_month, total_all_time, total_current_month } = summary;

  return (
    <div className="card">
      <h3>Аналитика</h3>

      <div className="stats-totals">
        <div>
          <span className="stat-label">В этом месяце</span>
          <span className="stat-value">{total_current_month.toFixed(0)} ₽</span>
        </div>
        <div>
          <span className="stat-label">Всего</span>
          <span className="stat-value">{total_all_time.toFixed(0)} ₽</span>
        </div>
      </div>

      {by_category.length > 0 && (
        <>
          <h4>По категориям</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={by_category}
                dataKey="total"
                nameKey="category_name"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                {by_category.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v.toFixed(0)} ₽`} />
            </PieChart>
          </ResponsiveContainer>
          <ul className="legend">
            {by_category.map((c) => (
              <li key={c.category_id ?? "none"}>
                <span className="dot" style={{ background: c.color }} />
                {c.icon} {c.category_name}: <b>{c.total.toFixed(0)} ₽</b>
              </li>
            ))}
          </ul>
        </>
      )}

      {by_month.length > 0 && (
        <>
          <h4>По месяцам</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={by_month}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(v) => `${v.toFixed(0)} ₽`} />
              <Bar dataKey="total" fill="#6C5CE7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
