import React from "react";

// Lightweight SVG-based stand-ins for the Recharts components used in Report.jsx.
// Vite aliases "recharts" to this module only when the real dependency is missing,
// allowing local development and CI builds to succeed without the external package.

const createMargin = () => ({ top: 20, right: 20, bottom: 40, left: 40 });

const renderGridLines = (count, innerWidth, innerHeight, margin, color = "#e5e7eb") =>
  Array.from({ length: count }).map((_, index) => {
    const y = margin.top + (innerHeight / (count - 1 || 1)) * index;
    return (
      <line
        key={`grid-${index}`}
        x1={margin.left}
        y1={y}
        x2={margin.left + innerWidth}
        y2={y}
        stroke={color}
        strokeWidth={1}
        strokeDasharray="3 3"
      />
    );
  });

export const ResponsiveContainer = ({ width = "100%", height = 200, children }) => {
  const style = {
    width: width === "100%" ? "100%" : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return <div style={style}>{children}</div>;
};

ResponsiveContainer.displayName = "ResponsiveContainer";

export const Bar = () => null;
Bar.displayName = "Bar";

export const Line = () => null;
Line.displayName = "Line";

export const XAxis = () => null;
XAxis.displayName = "XAxis";

export const YAxis = () => null;
YAxis.displayName = "YAxis";

export const CartesianGrid = () => null;
CartesianGrid.displayName = "CartesianGrid";

export const Tooltip = () => null;
Tooltip.displayName = "Tooltip";

export const BarChart = ({ data = [], children }) => {
  const childArray = React.Children.toArray(children);
  const barChild = childArray.find((child) => child.type === Bar);
  const xAxisChild = childArray.find((child) => child.type === XAxis);
  const hasGrid = childArray.some((child) => child.type === CartesianGrid);

  const dataKey = barChild?.props?.dataKey;
  const xKey = xAxisChild?.props?.dataKey;
  const fill = barChild?.props?.fill || "#2563eb";
  const barRadius = Array.isArray(barChild?.props?.radius)
    ? barChild.props.radius[0] || 0
    : barChild?.props?.radius || 0;

  const margin = createMargin();
  const chartWidth = 400;
  const chartHeight = 240;
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  const values = data.map((item) => Number(item?.[dataKey]) || 0);
  const maxValue = Math.max(...values, 1);
  const tickCount = 5;

  const barSlot = innerWidth / Math.max(data.length, 1);
  const configuredBarSize = barChild?.props?.barSize;
  const barSize = configuredBarSize
    ? Math.min(configuredBarSize, barSlot - 8)
    : Math.max(barSlot * 0.6, 8);
  const offset = (barSlot - barSize) / 2;

  return (
    <svg
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      role="img"
      aria-label="Bar chart"
      style={{ width: "100%", height: "100%" }}
    >
      <rect width={chartWidth} height={chartHeight} fill="#fff" rx={8} ry={8} />

      <line
        x1={margin.left}
        y1={margin.top + innerHeight}
        x2={margin.left + innerWidth}
        y2={margin.top + innerHeight}
        stroke="#111827"
        strokeWidth={1.5}
      />
      <line
        x1={margin.left}
        y1={margin.top}
        x2={margin.left}
        y2={margin.top + innerHeight}
        stroke="#111827"
        strokeWidth={1.5}
      />

      {hasGrid && renderGridLines(tickCount, innerWidth, innerHeight, margin)}

      {Array.from({ length: tickCount }).map((_, index) => {
        const value = Math.round((maxValue / (tickCount - 1 || 1)) * index);
        const y = margin.top + innerHeight - (innerHeight / (tickCount - 1 || 1)) * index;
        return (
          <text
            key={`y-tick-${index}`}
            x={margin.left - 8}
            y={y + 4}
            textAnchor="end"
            fontSize="10"
            fill="#6b7280"
          >
            {value}
          </text>
        );
      })}

      {data.map((item, index) => {
        const value = Number(item?.[dataKey]) || 0;
        const scaledHeight = (value / maxValue) * innerHeight;
        const x = margin.left + index * barSlot + offset;
        const y = margin.top + innerHeight - scaledHeight;

        return (
          <rect
            key={`bar-${index}`}
            x={x}
            y={y}
            width={barSize}
            height={Math.max(scaledHeight, 2)}
            fill={fill}
            rx={barRadius}
            ry={barRadius}
          />
        );
      })}

      {data.map((item, index) => {
        const label = xKey ? item?.[xKey] : index + 1;
        const x = margin.left + index * barSlot + barSlot / 2;
        return (
          <text
            key={`x-label-${index}`}
            x={x}
            y={margin.top + innerHeight + 24}
            textAnchor="middle"
            fontSize="10"
            fill="#4b5563"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
};

BarChart.displayName = "BarChart";

export const LineChart = ({ data = [], children }) => {
  const childArray = React.Children.toArray(children);
  const lineChild = childArray.find((child) => child.type === Line);
  const xAxisChild = childArray.find((child) => child.type === XAxis);
  const hasGrid = childArray.some((child) => child.type === CartesianGrid);

  const dataKey = lineChild?.props?.dataKey;
  const xKey = xAxisChild?.props?.dataKey;
  const stroke = lineChild?.props?.stroke || "#2563eb";
  const strokeWidth = lineChild?.props?.strokeWidth || 2;
  const dotProps = lineChild?.props?.dot || { r: 4, fill: "#fff", stroke };

  const margin = createMargin();
  const chartWidth = 400;
  const chartHeight = 240;
  const innerWidth = chartWidth - margin.left - margin.right;
  const innerHeight = chartHeight - margin.top - margin.bottom;

  const values = data.map((item) => Number(item?.[dataKey]) || 0);
  const maxValue = Math.max(...values, 1);
  const tickCount = 5;

  const points = data.map((item, index) => {
    const value = Number(item?.[dataKey]) || 0;
    const ratio = maxValue === 0 ? 0 : value / maxValue;
    const x = margin.left + (innerWidth / Math.max(data.length - 1, 1)) * index;
    const y = margin.top + innerHeight - ratio * innerHeight;
    return { x, y, value };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${chartWidth} ${chartHeight}`}
      role="img"
      aria-label="Line chart"
      style={{ width: "100%", height: "100%" }}
    >
      <rect width={chartWidth} height={chartHeight} fill="#fff" rx={8} ry={8} />

      <line
        x1={margin.left}
        y1={margin.top + innerHeight}
        x2={margin.left + innerWidth}
        y2={margin.top + innerHeight}
        stroke="#111827"
        strokeWidth={1.5}
      />
      <line
        x1={margin.left}
        y1={margin.top}
        x2={margin.left}
        y2={margin.top + innerHeight}
        stroke="#111827"
        strokeWidth={1.5}
      />

      {hasGrid && renderGridLines(tickCount, innerWidth, innerHeight, margin)}

      {Array.from({ length: tickCount }).map((_, index) => {
        const value = Math.round((maxValue / (tickCount - 1 || 1)) * index);
        const y = margin.top + innerHeight - (innerHeight / (tickCount - 1 || 1)) * index;
        return (
          <text
            key={`line-y-${index}`}
            x={margin.left - 8}
            y={y + 4}
            textAnchor="end"
            fontSize="10"
            fill="#6b7280"
          >
            {value}
          </text>
        );
      })}

      {pathData && (
        <path
          d={pathData}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {points.map((point, index) => (
        <circle
          key={`dot-${index}`}
          cx={point.x}
          cy={point.y}
          r={dotProps?.r || 4}
          fill={dotProps?.fill || "#fff"}
          stroke={dotProps?.stroke || stroke}
          strokeWidth={dotProps?.strokeWidth || 2}
        />
      ))}

      {data.map((item, index) => {
        const label = xKey ? item?.[xKey] : index + 1;
        const x = margin.left + (innerWidth / Math.max(data.length - 1, 1)) * index;
        return (
          <text
            key={`line-x-${index}`}
            x={x}
            y={margin.top + innerHeight + 24}
            textAnchor="middle"
            fontSize="10"
            fill="#4b5563"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
};

LineChart.displayName = "LineChart";
