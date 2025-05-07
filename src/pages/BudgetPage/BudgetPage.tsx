import React, { useState } from 'react'
import styles from './BudgetPage.module.css'
import Tabs from '../../components/BudgetPage/Tabs'
import SetupTab from '../../components/BudgetPage/SetupTab'
import ExistingTab from '../../components/BudgetPage/ExistingTab'
import HistoryTab from '../../components/BudgetPage/HistoryTab'
import OverviewTab from '../../components/BudgetPage/OverviewTab'

const rawExistingBudgets = [
  { category: 'Tiết kiệm', amount: 5000000 },
  { category: 'Quỹ khẩn cấp', amount: 2000000 },
  { category: 'Đầu tư', amount: 3000000 },
  { category: 'Ăn uống', amount: 2000000 },
  { category: 'Đi lại', amount: 1000000 }
]

const pastBudgetsMock = [
  {
    month: '04/2024',
    total: 9000000,
    disposable: 7000000,
    allocations: [
      { category: 'Ăn uống', amount: 3000000 },
      { category: 'Đi lại', amount: 2000000 },
      { category: 'Giải trí', amount: 1000000 }
    ],
    spent: {
      'Ăn uống': 3200000,
      'Đi lại': 1900000,
      'Giải trí': 1200000
    }
  },
  {
    month: '03/2024',
    total: 8500000,
    disposable: 6000000,
    allocations: [
      { category: 'Ăn uống', amount: 2500000 },
      { category: 'Tiết kiệm', amount: 3000000 }
    ],
    spent: {
      'Ăn uống': 2400000,
      'Tiết kiệm': 3000000
    }
  }
]

const BudgetPage = () => {
  const [activeTab, setActiveTab] = useState<'setup' | 'existing' | 'history' | 'overview' | 'comparison'>('setup')
  const [budgetAllocations, setBudgetAllocations] = useState([])
  const [existingBudgets, setExistingBudgets] = useState(rawExistingBudgets)
  const [pastBudgets] = useState(pastBudgetsMock)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)

  const totalBudget = existingBudgets.reduce((sum, item) => sum + item.amount, 0)
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0)

  const totalAllocated = budgetAllocations.reduce((sum, item) => sum + item.amount, 0)
  const remaining = totalBudget - monthlyBudget

  const handleExistingChange = (index, field, value) => {
    const updated = [...existingBudgets]
    updated[index] = {
      ...updated[index],
      [field]: field === 'amount' ? Number(value) : value
    }
    setExistingBudgets(updated)
  }

  const handleAddExisting = () => {
    setExistingBudgets([...existingBudgets, { category: '', amount: 0 }])
  }

  const handleMonthlyBudgetChange = (value: number) => {
    setMonthlyBudget(value)
  }

  const formatCurrency = (value) => value.toLocaleString('vi-VN') + 'đ'

  return (
    <div className={styles.budgetContainer}>
      <h1 className={styles.budgetTitle}>💰 Quản lý Ngân sách</h1>
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === 'setup' && (
        <SetupTab
          totalBudget={totalBudget}
          totalAllocated={totalAllocated}
          remaining={remaining}
          budgetAllocations={budgetAllocations}
          handleAllocationChange={(index, field, value, source) => {
            const updated = [...budgetAllocations]
            if (field === 'amount') {
              updated[index].amount = Number(value)
            } else if (field === 'percent') {
              const percent = Number(value)
              updated[index].percent = percent
              updated[index].amount = Math.round((monthlyBudget * percent) / 100)
            } else {
              updated[index][field] = value
            }
            setBudgetAllocations(updated)
          }}
          handleAddAllocation={(category) => {
            setBudgetAllocations([...budgetAllocations, { category: category || '', amount: 0, percent: 0 }])
          }}
          suggestedCategories={['Ăn uống', 'Đi lại', 'Tiện ích', 'Giải trí', 'Sức khỏe', 'Giáo dục', 'Tiết kiệm']}
          formatCurrency={formatCurrency}
          handleMonthlyBudgetChange={handleMonthlyBudgetChange}
          monthlyBudget={monthlyBudget}
        />
      )}

      {activeTab === 'existing' && (
        <ExistingTab
          existingBudgets={existingBudgets}
          handleExistingChange={handleExistingChange}
          handleAddExisting={handleAddExisting}
        />
      )}

      {activeTab === 'history' && (
        <HistoryTab
          pastBudgets={pastBudgets}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          formatCurrency={formatCurrency}
        />
      )}

      {activeTab === 'overview' && <OverviewTab pastBudgets={pastBudgets} formatCurrency={formatCurrency} />}
    </div>
  )
}

export default BudgetPage
