'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface WeeklyData {
  day: string;
  minutes: number;
  hours: string;
}

interface WeeklyChartProps {
  data: WeeklyData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const hours = Math.floor(data.minutes / 60);
    const mins = data.minutes % 60;
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-title">{data.day}</p>
        <p className="chart-tooltip-value">
          {hours}h {mins > 0 && `${mins}m`} focus time
        </p>
      </div>
    );
  }

  return null;
};

export function WeeklyChart({ data }: WeeklyChartProps) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Focus Time</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" className="chart-orange-fill-gradient-start" />
                <stop offset="95%" className="chart-orange-fill-gradient-end" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              className="text-muted-foreground"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              className="text-muted-foreground"
              tickFormatter={(value) => `${Math.floor(value / 60)}h`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--card) / 0.5)' }} />
            <Area
              type="monotone"
              dataKey="minutes"
              className="chart-orange-stroke"
              fillOpacity={1}
              fill="url(#colorFocus)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
