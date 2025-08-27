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

interface HourlyData {
  hour: string;
  count: number;
  displayHour: string;
}

interface PeakProductivityTimesProps {
  data: HourlyData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-title">{data.displayHour}</p>
        <p className="chart-tooltip-value">
          {data.count} {data.count === 1 ? 'pomodoro' : 'pomodoros'}
        </p>
      </div>
    );
  }

  return null;
};

export function PeakProductivityTimes({ data }: PeakProductivityTimesProps) {
  const hasData = data && data.length > 0;

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-border/20">
      <h3 className="text-lg font-semibold text-foreground mb-4">Peak Productivity Times</h3>
      <div className="h-80">
        {!hasData ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p className="text-6xl mb-2">⏰</p>
              <p>No productivity data yet.</p>
              <p className="text-sm">Complete pomodoro sessions to see your peak times.</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProductivity" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" className="chart-orange-fill-gradient-start" />
                  <stop offset="95%" className="chart-orange-fill-gradient-end" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 87, 51, 0.2)" />
              <XAxis
                dataKey="hour"
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-xs text-muted-foreground"
                allowDecimals={false}
              />
              <Tooltip cursor={{ fill: 'hsl(var(--card) / 0.5)' }} content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                className="chart-orange-stroke"
                fillOpacity={1}
                fill="url(#colorProductivity)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Track when you complete the most pomodoros to plan your important work.
      </p>
    </div>
  );
}
