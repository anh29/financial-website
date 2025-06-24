import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { PieLabelRenderProps } from 'recharts/types/polar/Pie'
import type { MonthlyCategoryExpenses } from '../../types/transaction'

const categoryColors = {
  'Giải trí': '#8b5cf6',
  'Giáo dục': '#06b6d4',
  'Mua sắm': '#f59e0b',
  'Ăn uống': '#10b981',
  'Di chuyển': '#ef4444'
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount)
}

const formatMonthVN = (monthStr: string) => {
  const date = new Date(monthStr + '-01')
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  return `Tháng ${month}, ${year}`
}

const ICONS = [
  <span role="img" aria-label="income">💵</span>,
  <span role="img" aria-label="expense">💸</span>,
  <span role="img" aria-label="saving">💰</span>
]

const ARROW = (diff: number) =>
  diff > 0 ? <span style={{ color: '#16a34a', marginLeft: 4 }}>▲</span> :
  diff < 0 ? <span style={{ color: '#dc2626', marginLeft: 4 }}>▼</span> : <span style={{ marginLeft: 4 }}>→</span>

export default function AnalyticsDashboard({ monthlyCategoryExpenses }: { monthlyCategoryExpenses: MonthlyCategoryExpenses[] }) {
  // Handle empty data
  if (!monthlyCategoryExpenses || monthlyCategoryExpenses.length === 0) {
    return (
      <div style={{
        maxWidth: 600,
        margin: '60px auto',
        padding: '32px 16px',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 1px 4px #e2e8f0',
        textAlign: 'center',
        color: '#64748b',
        fontFamily: 'Inter, Arial, sans-serif',
      }}>
        <h2 style={{ fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>Chưa có dữ liệu phân tích</h2>
        <p>Hãy thêm giao dịch để xem phân tích chi tiêu của bạn.</p>
      </div>
    );
  }

  const [currentIndex, setCurrentIndex] = useState(monthlyCategoryExpenses.length - 1)
  const currentMonth = monthlyCategoryExpenses[currentIndex]
  const prevMonth = monthlyCategoryExpenses[currentIndex - 1]

  const handleNext = () => {
    if (currentIndex < monthlyCategoryExpenses.length - 1) setCurrentIndex((i) => i + 1)
  }

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1)
  }

  const percentage = (amount: number) => ((amount / currentMonth.totalSpent) * 100).toFixed(1)

  const changeArrow = (current: number, prev: number) => {
    if (prev == null) return '-'
    const diff = current - prev
    return (
      <span>
        {ARROW(diff)}
        <span style={{ color: diff > 0 ? '#16a34a' : diff < 0 ? '#dc2626' : '#64748b', marginLeft: 4 }}>
          {formatCurrency(Math.abs(diff))}
        </span>
      </span>
    )
  }

  // Custom label for Pie chart
  const renderCustomizedLabel = (props: PieLabelRenderProps) => {
    const RADIAN = Math.PI / 180;
    // Coerce all to numbers for arithmetic
    const cx = Number(props.cx ?? 0);
    const cy = Number(props.cy ?? 0);
    const midAngle = Number(props.midAngle ?? 0);
    const innerRadius = Number(props.innerRadius ?? 0);
    const outerRadius = Number(props.outerRadius ?? 0);
    const percent = Number(props.percent ?? 0);
    const name = props.name ?? '';
    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill={categoryColors[name as keyof typeof categoryColors] || '#64748b'}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={15}
        fontWeight={600}
      >
        {`${name}: ${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  // Responsive styles
  const cardStyle = {
    background: '#fff',
    padding: 16,
    borderRadius: 12,
    boxShadow: '0 1px 4px #e2e8f0',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    minWidth: 0,
    transition: 'box-shadow 0.2s',
    cursor: 'pointer'
  }

  return (
    <div style={{
      maxWidth: 900,
      margin: '0 auto',
      padding: '24px 8px',
      fontFamily: 'Inter, Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        flexWrap: 'wrap'
      }}>
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: 'none',
            background: currentIndex === 0 ? '#e5e7eb' : '#1abc9c',
            color: currentIndex === 0 ? '#94a3b8' : '#fff',
            fontWeight: 600,
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s'
          }}
        >
          ⬅️ Tháng trước
        </button>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 700,
          color: '#0f172a',
          margin: 0,
          textAlign: 'center',
          flex: 1
        }}>
          {formatMonthVN(currentMonth.month)}
        </h2>
        <button
          onClick={handleNext}
          disabled={currentIndex === monthlyCategoryExpenses.length - 1}
          style={{
            padding: '8px 16px',
            borderRadius: 8,
            border: 'none',
            background: currentIndex === monthlyCategoryExpenses.length - 1 ? '#e5e7eb' : '#1abc9c',
            color: currentIndex === monthlyCategoryExpenses.length - 1 ? '#94a3b8' : '#fff',
            fontWeight: 600,
            cursor: currentIndex === monthlyCategoryExpenses.length - 1 ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s'
          }}
        >
          Tháng sau ➡️
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        marginTop: 16
      }}>
        {['Thu nhập', 'Chi tiêu', 'Tiết kiệm'].map((label, idx) => {
          const value = [
            currentMonth.totalIncome,
            currentMonth.totalSpent,
            currentMonth.totalIncome - currentMonth.totalSpent
          ][idx]
          const prev =
            prevMonth &&
            [prevMonth.totalIncome, prevMonth.totalSpent, prevMonth.totalIncome - prevMonth.totalSpent][idx]
          const isPositive = idx !== 1
          return (
            <div
              key={label}
              style={{
                ...cardStyle,
                borderLeft: `6px solid ${isPositive ? '#10b981' : '#ef4444'}`,
                boxShadow: '0 2px 8px #e0e7ef',
                minHeight: 100
              }}
            >
              <div style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                {ICONS[idx]} {label}
              </div>
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: isPositive ? '#16a34a' : '#dc2626'
                }}
              >
                {formatCurrency(value)}
              </div>
              <div style={{ fontSize: '0.95rem', color: '#64748b', marginTop: 4 }}>
                {changeArrow(value, prev)}
              </div>
            </div>
          )
        })}
      </div>

      {/* Pie Chart */}
      <div style={{ height: 340, marginTop: 36, background: '#f9fafb', borderRadius: 16, padding: 16 }}>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={currentMonth.categories.map((c: any) => ({ name: c.category, value: c.amount }))}
              cx='50%'
              cy='50%'
              innerRadius={70}
              outerRadius={110}
              dataKey='value'
              label={renderCustomizedLabel}
              isAnimationActive={true}
            >
              {currentMonth.categories.map((entry: any, index: any) => (
                <Cell key={`cell-${index}`} fill={categoryColors[entry.category as keyof typeof categoryColors] || '#94a3b8'} />
              ))}
            </Pie>
            <Tooltip formatter={(v: any) => formatCurrency(v)} />
            <Legend verticalAlign='bottom' height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown */}
      <div style={{
        marginTop: 32,
        background: '#fff',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 1px 4px #e2e8f0'
      }}>
        <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: 12, color: '#0f172a' }}>
          Phân tích chi tiêu theo danh mục
        </h3>
        {currentMonth.categories.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>Chưa có dữ liệu cho tháng này</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {currentMonth.categories.map((cat: any) => {
              const percent = percentage(cat.amount)
              return (
                <li
                  key={cat.category}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid #e5e7eb',
                    gap: 12
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: categoryColors[cat.category as keyof typeof categoryColors] || '#94a3b8',
                      display: 'inline-block'
                    }} />
                    <span style={{ fontWeight: 600, color: '#0f172a', minWidth: 80 }}>{cat.category}</span>
                    <span style={{
                      background: '#f1f5f9',
                      color: '#334155',
                      borderRadius: 8,
                      padding: '2px 8px',
                      fontSize: '0.85rem',
                      marginLeft: 8
                    }}>{percent}%</span>
                  </div>
                  <div style={{ flex: 1, margin: '0 12px' }}>
                    <div style={{
                      background: '#e5e7eb',
                      borderRadius: 8,
                      height: 8,
                      width: '100%'
                    }}>
                      <div style={{
                        width: `${percent}%`,
                        background: categoryColors[cat.category as keyof typeof categoryColors] || '#94a3b8',
                        height: '100%',
                        borderRadius: 8,
                        transition: 'width 0.3s'
                      }} />
                    </div>
                  </div>
                  <div style={{ fontWeight: 600, color: '#0f172a', minWidth: 110, textAlign: 'right' }}>
                    {formatCurrency(cat.amount)}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
