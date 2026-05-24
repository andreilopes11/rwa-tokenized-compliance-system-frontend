"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export type PortfolioChartPoint = {
  name: string;
  value: number;
};

type PortfolioChartProps = {
  data: PortfolioChartPoint[];
};

export function PortfolioChart({ data }: PortfolioChartProps) {
  return (
    <ResponsiveContainer height={220} width="100%">
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value) => formatCurrency(Number(value), "EUR", "en-GB")} />
        <Bar dataKey="value" fill="#0f766e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function formatCurrency(value: number, currency = "EUR", locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits: 2,
    style: "currency"
  }).format(value);
}
