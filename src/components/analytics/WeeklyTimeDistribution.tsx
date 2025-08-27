'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface TimeData {
  name: string;
  minutes: number;
  color: string;
  hours: string;
}

interface WeeklyTimeDistributionProps {
  data: TimeData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-title">{data.name}</p>
        <p className="chart-tooltip-value">{data.hours}</p>
      </div>
    );
  }

  return null;
};

export function WeeklyTimeDistribution({ data }: WeeklyTimeDistributionProps) {
  const hasData = data && data.length > 0;

  const formatYAxis = (value: number) => {
    return `${Math.floor(value / 60)}h`;
  };

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-border/20">
      <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Time Distribution</h3>
      <div className="h-80">
        {!hasData ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p className="text-6xl mb-2">📊</p>
              <p>No time data for this week yet.</p>
              <p className="text-sm">Complete pomodoro sessions to see your weekly distribution.</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
                tickFormatter={formatYAxis}
              />
              <Tooltip cursor={{ fill: 'hsl(var(--card) / 0.5)' }} content={<CustomTooltip />} />
              <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
