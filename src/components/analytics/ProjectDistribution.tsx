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

interface ProjectData {
  name: string;
  minutes: number;
  color: string;
  hours: string;
}

interface ProjectDistributionProps {
  data: ProjectData[];
}

export function ProjectDistribution({ data }: ProjectDistributionProps) {
  const formatTooltip = (value: number, name: string) => {
    const hours = Math.floor(value / 60);
    const mins = value % 60;
    return [`${hours}h ${mins}m`, 'Focus Time'];
  };

  const formatYAxis = (value: number) => {
    return `${Math.floor(value / 60)}h`;
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Project Time Distribution</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              className="text-muted-foreground"
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              className="text-muted-foreground"
              tickFormatter={formatYAxis}
            />
            <Tooltip
              formatter={formatTooltip}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))',
              }}
            />
            <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        {data.map((project, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: project.color }} />
            <span className="text-sm text-muted-foreground">
              {project.name} ({project.hours})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
