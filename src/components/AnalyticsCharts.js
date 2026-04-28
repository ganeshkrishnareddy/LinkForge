'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import styles from './AnalyticsCharts.module.css';

const COLORS = ['#7c5cfc', '#00d4c8', '#ff5c72', '#ffc53d', '#38bdf8', '#a78bfa', '#00c9a7'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        <p className={styles.tooltipValue}>{payload[0].value} clicks</p>
      </div>
    );
  }
  return null;
};

export function ClicksAreaChart({ data }) {
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Clicks Over Time</h3>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c5cfc" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c5cfc" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#8585a8' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#8585a8' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#7c5cfc"
              strokeWidth={2}
              fill="url(#colorClicks)"
              dot={{ fill: '#7c5cfc', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: '#9178ff', stroke: '#7c5cfc', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function DevicePieChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Devices</h3>
      <div className={styles.pieWrap}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className={styles.tooltip}>
                      <p className={styles.tooltipLabel}>{payload[0].name}</p>
                      <p className={styles.tooltipValue}>
                        {payload[0].value} ({total ? Math.round((payload[0].value / total) * 100) : 0}%)
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.legend}>
          {data.map((entry, index) => (
            <div key={entry.name} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: COLORS[index % COLORS.length] }}
              />
              <span className={styles.legendLabel}>{entry.name}</span>
              <span className={styles.legendValue}>{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReferrersChart({ data }) {
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Top Referrers</h3>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: '#8585a8' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: '#8585a8' }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              fill="url(#barGradient)"
              radius={[0, 4, 4, 0]}
              barSize={20}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7c5cfc" />
                  <stop offset="100%" stopColor="#00d4c8" />
                </linearGradient>
              </defs>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function BrowsersChart({ data }) {
  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>Browsers</h3>
      <div className={styles.browserList}>
        {data.map((browser, index) => {
          const total = data.reduce((sum, b) => sum + b.value, 0);
          const pct = total ? Math.round((browser.value / total) * 100) : 0;
          return (
            <div key={browser.name} className={styles.browserItem}>
              <div className={styles.browserInfo}>
                <span
                  className={styles.browserDot}
                  style={{ background: COLORS[index % COLORS.length] }}
                />
                <span className={styles.browserName}>{browser.name}</span>
                <span className={styles.browserPct}>{pct}%</span>
              </div>
              <div className={styles.browserBar}>
                <div
                  className={styles.browserBarFill}
                  style={{
                    width: `${pct}%`,
                    background: COLORS[index % COLORS.length],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
