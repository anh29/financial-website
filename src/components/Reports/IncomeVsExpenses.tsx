// IncomeVsExpenses.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartCard from '../Shared/ChartCard';

const IncomeVsExpenses = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      { label: 'Income', data: [3000, 3100, 3200, 2800, 3400], backgroundColor: '#2ecc71' },
      { label: 'Expenses', data: [2200, 2500, 2100, 2600, 2300], backgroundColor: '#e74c3c' }
    ]
  };
  return <ChartCard title="Income vs Expenses"><Bar data={data} /></ChartCard>;
};
export default IncomeVsExpenses;
