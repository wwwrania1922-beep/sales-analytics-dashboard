import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import {
  TrendingUp, TrendingDown, Wallet, ShoppingBag, Users, Percent,
  Download, Search, Bell, Calendar, BarChart3, MapPin, Package
} from 'lucide-react';

/* ===================== البيانات ===================== */

const PERIODS = {
  week: {
    label: 'آخر 7 أيام',
    trend: [
      { name: 'السبت', current: 42000, previous: 35000 },
      { name: 'الأحد', current: 38000, previous: 36000 },
      { name: 'الاثنين', current: 51000, previous: 40000 },
      { name: 'الثلاثاء', current: 47000, previous: 43000 },
      { name: 'الأربعاء', current: 62000, previous: 48000 },
      { name: 'الخميس', current: 71000, previous: 52000 },
      { name: 'الجمعة', current: 58000, previous: 50000 },
    ],
    orders: 1248, ordersChange: 12.5,
    customers: 842, customersChange: 7.2,
    conversion: 3.8, conversionChange: 0.6,
  },
  month: {
    label: 'آخر 30 يوم',
    trend: [
      { name: 'الأسبوع 1', current: 280000, previous: 240000 },
      { name: 'الأسبوع 2', current: 310000, previous: 265000 },
      { name: 'الأسبوع 3', current: 295000, previous: 280000 },
      { name: 'الأسبوع 4', current: 360000, previous: 300000 },
    ],
    orders: 5320, ordersChange: 9.8,
    customers: 3410, customersChange: 5.4,
    conversion: 3.5, conversionChange: 0.4,
  },
  year: {
    label: 'آخر 12 شهر',
    trend: [
      { name: 'يناير', current: 850000, previous: 720000 },
      { name: 'فبراير', current: 920000, previous: 780000 },
      { name: 'مارس', current: 1010000, previous: 860000 },
      { name: 'أبريل', current: 980000, previous: 840000 },
      { name: 'مايو', current: 1120000, previous: 950000 },
      { name: 'يونيو', current: 1250000, previous: 1010000 },
      { name: 'يوليو', current: 1180000, previous: 1000000 },
      { name: 'أغسطس', current: 1300000, previous: 1090000 },
      { name: 'سبتمبر', current: 1420000, previous: 1180000 },
      { name: 'أكتوبر', current: 1380000, previous: 1150000 },
      { name: 'نوفمبر', current: 1510000, previous: 1240000 },
      { name: 'ديسمبر', current: 1690000, previous: 1380000 },
    ],
    orders: 61200, ordersChange: 18.3,
    customers: 28900, customersChange: 14.1,
    conversion: 3.2, conversionChange: -0.3,
  },
};

const CATEGORIES = [
  { name: 'موبايلات', value: 45, color: '#38bdf8' },
  { name: 'إكسسوارات', value: 22, color: '#818cf8' },
  { name: 'لابتوبات', value: 15, color: '#f43f5e' },
  { name: 'ساعات ذكية', value: 10, color: '#34d399' },
  { name: 'سماعات', value: 8, color: '#facc15' },
];

const GOVERNORATES = [
  { name: 'القاهرة', share: 38 },
  { name: 'الجيزة', share: 24 },
  { name: 'الإسكندرية', share: 17 },
  { name: 'الدقهلية', share: 9 },
  { name: 'سوهاج', share: 7 },
  { name: 'أسيوط', share: 5 },
];

const TOP_PRODUCTS = [
  { name: 'موبايل X200 Pro', category: 'موبايلات', sold: 412, revenue: 6180000 },
  { name: 'سماعة لاسلكية Air', category: 'سماعات', sold: 689, revenue: 1033500 },
  { name: 'ساعة ذكية Fit 5', category: 'ساعات ذكية', sold: 356, revenue: 890000 },
  { name: 'شاحن سريع 65W', category: 'إكسسوارات', sold: 1120, revenue: 560000 },
  { name: 'لابتوب Slim 14', category: 'لابتوبات', sold: 58, revenue: 1450000 },
];

const ORDERS = [
  { id: '#10482', customer: 'أحمد محمود', city: 'القاهرة', product: 'موبايل X200 Pro', amount: 15000, status: 'delivered', date: '24 سبتمبر' },
  { id: '#10481', customer: 'سارة علي', city: 'الإسكندرية', product: 'ساعة ذكية Fit 5', amount: 2500, status: 'shipping', date: '24 سبتمبر' },
  { id: '#10480', customer: 'محمد حسن', city: 'الجيزة', product: 'لابتوب Slim 14', amount: 25000, status: 'delivered', date: '23 سبتمبر' },
  { id: '#10479', customer: 'منة الله خالد', city: 'سوهاج', product: 'سماعة لاسلكية Air', amount: 1500, status: 'pending', date: '23 سبتمبر' },
  { id: '#10478', customer: 'يوسف إبراهيم', city: 'الدقهلية', product: 'شاحن سريع 65W', amount: 500, status: 'cancelled', date: '22 سبتمبر' },
  { id: '#10477', customer: 'نور الهدى أحمد', city: 'القاهرة', product: 'موبايل X200 Pro', amount: 15000, status: 'shipping', date: '22 سبتمبر' },
  { id: '#10476', customer: 'كريم مصطفى', city: 'أسيوط', product: 'ساعة ذكية Fit 5', amount: 2500, status: 'delivered', date: '21 سبتمبر' },
  { id: '#10475', customer: 'هبة سامي', city: 'الجيزة', product: 'سماعة لاسلكية Air', amount: 1500, status: 'delivered', date: '21 سبتمبر' },
];

const STATUS = {
  delivered: { label: 'تم التوصيل', color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)' },
  shipping: { label: 'قيد الشحن', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)' },
  pending: { label: 'قيد المراجعة', color: '#facc15', bg: 'rgba(250, 204, 21, 0.1)' },
  cancelled: { label: 'ملغي', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)' },
};

/* ===================== أدوات مساعدة ===================== */

const fmt = (n) => n.toLocaleString('en-US');
const fmtMoney = (n) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(2)} مليون ج.م`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)} ألف ج.م`;
  return `${fmt(n)} ج.م`;
};
const shortNum = (n) => (n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : n);

/* ===================== الستايل ===================== */

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');

body { margin: 0; background: #030712; }
.dash { direction: rtl; font-family: 'Cairo', Tahoma, sans-serif; background: #030712; min-height: 100vh; color: #f8fafc; padding: 28px; }
.dash * { box-sizing: border-box; }

.topbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 28px; background: rgba(15, 23, 42, 0.6); padding: 16px 24px; border-radius: 20px; border: 1px solid #1e293b; backdrop-filter: blur(10px); }
.brand { display: flex; align-items: center; gap: 14px; }
.brand-logo { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #38bdf8, #6366f1); display: grid; place-items: center; color: #fff; box-shadow: 0 8px 20px rgba(56,189,248,.3); }
.brand h1 { margin: 0; font-size: 22px; font-weight: 800; color: #fff; }
.brand p { margin: 0; font-size: 13px; color: #94a3b8; }

.top-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.period { display: flex; background: #020617; border: 1px solid #1e293b; border-radius: 12px; padding: 4px; }
.period button { border: none; background: transparent; padding: 8px 16px; border-radius: 9px; font-family: inherit; font-size: 13px; font-weight: 600; color: #94a3b8; cursor: pointer; transition: .2s; }
.period button.active { background: linear-gradient(135deg, #38bdf8, #6366f1); color: #fff; box-shadow: 0 4px 12px rgba(56,189,248,.3); }
.icon-btn { width: 42px; height: 42px; border-radius: 12px; border: 1px solid #1e293b; background: #0f172a; display: grid; place-items: center; color: #94a3b8; cursor: pointer; position: relative; transition: .2s; }
.icon-btn:hover { border-color: #38bdf8; color: #38bdf8; }
.icon-btn .dot { position: absolute; top: 9px; left: 10px; width: 8px; height: 8px; background: #f43f5e; border-radius: 50%; border: 2px solid #0f172a; }

.kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 18px; margin-bottom: 22px; }
.card { background: rgba(15, 23, 42, 0.7); border: 1px solid #1e293b; border-radius: 20px; padding: 22px; backdrop-filter: blur(12px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); transition: transform .2s, border-color .2s; }
.card:hover { transform: translateY(-3px); border-color: #38bdf8; }
.kpi-head { display: flex; justify-content: space-between; align-items: flex-start; }
.kpi-icon { width: 46px; height: 46px; border-radius: 14px; display: grid; place-items: center; }
.kpi-title { font-size: 13px; color: #94a3b8; font-weight: 600; margin-bottom: 6px; }
.kpi-value { font-size: 26px; font-weight: 800; margin: 0; color: #fff; }
.kpi-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 14px; }
.change { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 20px; }
.change.up { color: #34d399; background: rgba(52, 211, 153, 0.15); }
.change.down { color: #f43f5e; background: rgba(244, 63, 94, 0.15); }
.muted { color: #64748b; font-size: 12px; }

.row { display: grid; gap: 18px; margin-bottom: 22px; }
.row-2-1 { grid-template-columns: 2fr 1fr; }
.row-1-1 { grid-template-columns: 1fr 1fr; }
.card-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; gap: 10px; flex-wrap: wrap; }
.card-title h3 { margin: 0; font-size: 16px; font-weight: 700; color: #f8fafc; display: flex; align-items: center; gap: 8px; }
.card-title h3 svg { color: #38bdf8; }

.donut-wrap { position: relative; height: 210px; }
.donut-center { position: absolute; inset: 0; display: grid; place-items: center; text-align: center; pointer-events: none; }
.donut-center b { font-size: 18px; font-weight: 800; display: block; color: #fff; }
.legend-list { list-style: none; padding: 0; margin: 12px 0 0; }
.legend-list li { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; font-size: 13px; border-bottom: 1px dashed #1e293b; color: #cbd5e1; }
.legend-list li:last-child { border: none; }
.swatch { width: 10px; height: 10px; border-radius: 3px; display: inline-block; margin-left: 8px; }

.product { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #1e293b; }
.product:last-child { border: none; }
.rank { width: 32px; height: 32px; border-radius: 10px; background: rgba(56, 189, 248, 0.1); color: #38bdf8; font-weight: 800; display: grid; place-items: center; font-size: 13px; flex-shrink: 0; }
.product-info { flex: 1; min-width: 0; }
.product-info b { font-size: 14px; display: block; color: #fff; }
.bar-track { height: 6px; background: #1e293b; border-radius: 6px; margin-top: 6px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 6px; background: linear-gradient(90deg, #38bdf8, #6366f1); }
.product-rev { text-align: left; font-size: 13px; font-weight: 700; color: #38bdf8; white-space: nowrap; }

.table-tools { display: flex; gap: 10px; flex-wrap: wrap; }
.search { display: flex; align-items: center; gap: 8px; background: #020617; border: 1px solid #1e293b; border-radius: 10px; padding: 0 12px; }
.search input { border: none; background: transparent; outline: none; font-family: inherit; font-size: 13px; padding: 9px 0; width: 180px; color: #fff; }
.search input::placeholder { color: #64748b; }
select.filter { border: 1px solid #1e293b; background: #020617; color: #cbd5e1; border-radius: 10px; padding: 9px 12px; font-family: inherit; font-size: 13px; cursor: pointer; outline: none; }
select.filter option { background: #020617; color: #cbd5e1; }
.export-btn { display: flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #38bdf8, #6366f1); color: #fff; border: none; border-radius: 10px; padding: 9px 16px; font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity .2s; }
.export-btn:hover { opacity: 0.9; }

.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 700px; }
th { text-align: right; color: #94a3b8; font-weight: 600; font-size: 12px; padding: 12px; background: #020617; }
th:first-child { border-radius: 0 10px 10px 0; }
th:last-child { border-radius: 10px 0 0 10px; }
td { padding: 14px 12px; border-bottom: 1px solid #1e293b; color: #e2e8f0; }
tr:hover td { background: rgba(30, 41, 59, 0.4); }
.badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; display: inline-block; }
.empty { text-align: center; color: #64748b; padding: 30px; }

.recharts-legend-item-text { color: #cbd5e1 !important; }

@media (max-width: 1000px) {
  .row-2-1, .row-1-1 { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .dash { padding: 16px; }
  .search input { width: 120px; }
}
`;

/* ===================== المكونات ===================== */

function KpiCard({ title, value, change, suffix, icon, color, bg, spark }) {
  const up = change >= 0;
  return (
    <div className="card">
      <div className="kpi-head">
        <div>
          <div className="kpi-title">{title}</div>
          <p className="kpi-value">{value}</p>
        </div>
        <div className="kpi-icon" style={{ background: bg, color }}>{icon}</div>
      </div>
      <div className="kpi-foot">
        <div>
          <span className={`change ${up ? 'up' : 'down'}`}>
            {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {up ? '+' : ''}{change}{suffix}
          </span>
          <div className="muted" style={{ marginTop: 6 }}>مقارنة بالفترة السابقة</div>
        </div>
        <div style={{ width: 90, height: 40 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spark}>
              <Area type="monotone" dataKey="v" stroke={color} fill={color} fillOpacity={0.2} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: '#020617', border: '1px solid #1e293b', color: '#fff', padding: '10px 14px', borderRadius: 10, fontSize: 13, direction: 'rtl', boxShadow: '0 10px 30px rgba(0,0,0,.5)' }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          {p.name}: <b>{typeof p.value === 'number' && p.value > 999 ? fmtMoney(p.value) : fmt(p.value)}</b>
        </div>
      ))}
    </div>
  );
}

const axisTick = { fill: '#94a3b8', fontSize: 12 };

/* ===================== الصفحة الرئيسية ===================== */

export default function App() {
  const [period, setPeriod] = useState('week');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const data = PERIODS[period];

  const stats = useMemo(() => {
    const cur = data.trend.reduce((s, d) => s + d.current, 0);
    const prev = data.trend.reduce((s, d) => s + d.previous, 0);
    return {
      revenue: cur,
      revenueChange: +(((cur - prev) / prev) * 100).toFixed(1),
      avgOrder: Math.round(cur / data.orders),
    };
  }, [data]);

  const makeSpark = (k) => data.trend.map((d, i) => ({ v: d.current * (0.8 + ((i * 7 + k * 3) % 5) / 10) }));

  const governorates = GOVERNORATES.map((g) => ({ ...g, orders: Math.round((data.orders * g.share) / 100) }));
  const maxSold = Math.max(...TOP_PRODUCTS.map((p) => p.sold));

  const filteredOrders = ORDERS.filter((o) => {
    const matchSearch = [o.id, o.customer, o.city, o.product].some((f) => f.includes(search.trim()));
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const exportCSV = () => {
    const header = ['رقم الطلب', 'العميل', 'المحافظة', 'المنتج', 'المبلغ (ج.م)', 'الحالة', 'التاريخ'];
    const rows = filteredOrders.map((o) => [o.id, o.customer, o.city, o.product, o.amount, STATUS[o.status].label, o.date]);
    const csv = '\uFEFF' + [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dash">
      <style>{css}</style>

      {/* الهيدر */}
      <div className="topbar">
        <div className="brand">
          <div className="brand-logo"><BarChart3 size={24} /></div>
          <div>
            <h1>تحليلات المبيعات</h1>
            <p>نظرة شاملة على أداء المتجر — {data.label}</p>
          </div>
        </div>
        <div className="top-actions">
          <div className="period">
            {Object.entries(PERIODS).map(([key, p]) => (
              <button key={key} className={period === key ? 'active' : ''} onClick={() => setPeriod(key)}>
                {p.label}
              </button>
            ))}
          </div>
          <button className="icon-btn" title="التاريخ"><Calendar size={18} /></button>
          <button className="icon-btn" title="الإشعارات"><Bell size={18} /><span className="dot" /></button>
        </div>
      </div>

      {/* كروت المؤشرات */}
      <div className="kpis">
        <KpiCard title="إجمالي الإيرادات" value={fmtMoney(stats.revenue)} change={stats.revenueChange} suffix="%"
          icon={<Wallet size={22} />} color="#38bdf8" bg="rgba(56, 189, 248, 0.12)" spark={makeSpark(0)} />
        <KpiCard title="عدد الطلبات" value={fmt(data.orders)} change={data.ordersChange} suffix="%"
          icon={<ShoppingBag size={22} />} color="#818cf8" bg="rgba(129, 140, 248, 0.12)" spark={makeSpark(1)} />
        <KpiCard title="العملاء الجدد" value={fmt(data.customers)} change={data.customersChange} suffix="%"
          icon={<Users size={22} />} color="#34d399" bg="rgba(52, 211, 153, 0.12)" spark={makeSpark(2)} />
        <KpiCard title="معدل التحويل" value={`${data.conversion}%`} change={data.conversionChange} suffix=" نقطة"
          icon={<Percent size={22} />} color="#facc15" bg="rgba(250, 204, 21, 0.12)" spark={makeSpark(3)} />
      </div>

      {/* الإيرادات + الفئات */}
      <div className="row row-2-1">
        <div className="card">
          <div className="card-title">
            <h3><TrendingUp size={18} /> الإيرادات مقارنة بالفترة السابقة</h3>
            <span className="muted">متوسط قيمة الطلب: <b style={{ color: '#fff' }}>{fmt(stats.avgOrder)} ج.م</b></span>
          </div>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trend} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gCur" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" reversed tick={axisTick} axisLine={false} tickLine={false} />
                <YAxis orientation="right" tickFormatter={shortNum} tick={axisTick} axisLine={false} tickLine={false} width={50} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 13, paddingTop: 10 }} />
                <Area type="monotone" dataKey="previous" name="الفترة السابقة" stroke="#475569" strokeDasharray="5 5" fill="transparent" strokeWidth={2} />
                <Area type="monotone" dataKey="current" name="الفترة الحالية" stroke="#38bdf8" fill="url(#gCur)" strokeWidth={3} activeDot={{ r: 6, fill: '#38bdf8', stroke: '#030712', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-title"><h3><Package size={18} /> المبيعات حسب الفئة</h3></div>
          <div className="donut-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CATEGORIES} dataKey="value" innerRadius={65} outerRadius={92} paddingAngle={3} stroke="none">
                  {CATEGORIES.map((c) => <Cell key={c.name} fill={c.color} />)}
                </Pie>
                <Tooltip
                  formatter={(v) => `${v}%`}
                  contentStyle={{ background: '#020617', border: '1px solid #1e293b', borderRadius: 10, direction: 'rtl' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center">
              <div><b>{fmtMoney(stats.revenue)}</b><span className="muted">إجمالي المبيعات</span></div>
            </div>
          </div>
          <ul className="legend-list">
            {CATEGORIES.map((c) => (
              <li key={c.name}>
                <span><span className="swatch" style={{ background: c.color }} />{c.name}</span>
                <b style={{ color: '#fff' }}>{c.value}%</b>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* المحافظات + أفضل المنتجات */}
      <div className="row row-1-1">
        <div className="card">
          <div className="card-title"><h3><MapPin size={18} /> الطلبات حسب المحافظة</h3></div>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={governorates} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" reversed tick={axisTick} axisLine={false} tickLine={false} tickFormatter={shortNum} />
                <YAxis type="category" dataKey="name" orientation="right" tick={{ fill: '#cbd5e1', fontSize: 13 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(56, 189, 248, 0.06)' }} />
                <Bar dataKey="orders" name="الطلبات" radius={[8, 0, 0, 8]} barSize={18}>
                  {governorates.map((g, i) => <Cell key={g.name} fill={i === 0 ? '#38bdf8' : '#6366f1'} fillOpacity={i === 0 ? 1 : 0.7} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-title"><h3><ShoppingBag size={18} /> المنتجات الأكثر مبيعًا</h3></div>
          {TOP_PRODUCTS.map((p, i) => (
            <div className="product" key={p.name}>
              <div className="rank">{i + 1}</div>
              <div className="product-info">
                <b>{p.name}</b>
                <span className="muted">{p.category} • {fmt(p.sold)} قطعة</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${(p.sold / maxSold) * 100}%` }} /></div>
              </div>
              <div className="product-rev">{fmtMoney(p.revenue)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* جدول الطلبات */}
      <div className="card">
        <div className="card-title">
          <h3><Package size={18} /> أحدث الطلبات</h3>
          <div className="table-tools">
            <div className="search">
              <Search size={16} color="#64748b" />
              <input placeholder="ابحث بالاسم أو المنتج..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">كل الحالات</option>
              {Object.entries(STATUS).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
            </select>
            <button className="export-btn" onClick={exportCSV}><Download size={16} /> تصدير Excel</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>رقم الطلب</th><th>العميل</th><th>المحافظة</th><th>المنتج</th><th>المبلغ</th><th>التاريخ</th><th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={7} className="empty">لا توجد طلبات مطابقة للبحث</td></tr>
              ) : filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700, color: '#38bdf8' }}>{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{o.city}</td>
                  <td>{o.product}</td>
                  <td style={{ fontWeight: 700 }}>{fmt(o.amount)} ج.م</td>
                  <td className="muted">{o.date}</td>
                  <td>
                    <span className="badge" style={{ color: STATUS[o.status].color, background: STATUS[o.status].bg }}>
                      {STATUS[o.status].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}