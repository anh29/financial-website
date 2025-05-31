import { useEffect, useState } from 'react'
import styles from './BudgetPage.module.css'
import Tabs from '../../components/BudgetPage/Tabs'
import SetupTab from '../../components/BudgetPage/SetupTab'
import ExistingTab from '../../components/BudgetPage/ExistingTab'
import HistoryTab from '../../components/BudgetPage/HistoryTab'
import OverviewTab from '../../components/BudgetPage/OverviewTab'
import AddBudgetModal from '../../components/BudgetPage/AddBudgetModal'
import { useBudgets } from '../../hooks/features/useBudgets'
import { Budget, BudgetAllocation } from '../../types/budgets'
import { LoadingSpinner } from '../../components/common'
import { createBudget } from '../../services/features/budgetService'
import { FloatingActionButton } from '../../components/common/FloatingActionButton/FloatingActionButton'

const BudgetPage = () => {
  const {
    budgets,
    income,
    pastBudgets,
    fetchBudgets,
    isLoading,
    fetchHistoricalExpenditures,
    fetchMonthlyBudgetAllocations,
    saveMonthlyBudgetAllocationHandler,
    getRemainingBudgetHandler,
    remainingBudget
  } = useBudgets()

  useEffect(() => {
    fetchBudgets()
  }, [fetchBudgets])

  const month = new Date().toISOString().slice(0, 7)

  const [budgetAllocations, setBudgetAllocations] = useState<BudgetAllocation[]>([])
  const [monthlyBudget, setMonthlyBudget] = useState<number>(0)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    const fetchAllocations = async () => {
      const monthlyBudget = await fetchMonthlyBudgetAllocations(month)
      setMonthlyBudget(monthlyBudget?.amount)
      setBudgetAllocations(monthlyBudget?.allocations)
    }
    fetchAllocations()
  }, [month, fetchMonthlyBudgetAllocations])

  useEffect(() => {
    const fetchHistoricalData = async () => {
      await fetchHistoricalExpenditures()
    }
    fetchHistoricalData()
  }, [fetchHistoricalExpenditures])

  useEffect(() => {
    const fetchRemainingBudget = async () => {
      const previousMonth = new Date(new Date(month).setMonth(new Date(month).getMonth() - 1)).toISOString().slice(0, 7)
      await getRemainingBudgetHandler(previousMonth)
    }
    fetchRemainingBudget()
  }, [month, getRemainingBudgetHandler])

  const [activeTab, setActiveTab] = useState<'setup' | 'existing' | 'history' | 'overview' | 'comparison'>('setup')
  const [existingBudgets, setExistingBudgets] = useState<Budget[]>(budgets)
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [savings, setSavings] = useState<number>(0)
  const [isBudgetSaved, setIsBudgetSaved] = useState(false)

  useEffect(() => {
    setExistingBudgets(budgets)
  }, [budgets])

  const totalBudget = existingBudgets.reduce((sum, item) => sum + item.amount, 0) + (income?.amount || 0)
  const totalAllocated = budgetAllocations?.reduce((sum, item) => sum + item.amount, 0) || 0
  const remainingMonthlyBudget = monthlyBudget - savings - totalAllocated
  const remaining = totalBudget - monthlyBudget

  const handleSaveAllocationBudget = async (newAllocation: BudgetAllocation[]) => {
    try {
      const payload = newAllocation.map((allocation) => ({
        monthly_budget_id: month,
        description: allocation.description,
        amount: allocation.amount
      }))

      await saveMonthlyBudgetAllocationHandler(payload)

      setIsBudgetSaved(true)
      setBudgetAllocations((prev) => [...prev, ...newAllocation])
    } catch (error) {
      console.error('Lỗi khi lưu phân bổ mới:', error)
    }
  }

  const handleMonthlyBudgetChange = (value: number) => {
    setMonthlyBudget(value)
  }

  const handleAddBudget = async (newBudgets: Budget[]) => {
    try {
      await createBudget(newBudgets)
      await fetchBudgets() // Refresh the budgets list
    } catch (error) {
      console.error('Lỗi khi tạo ngân sách mới:', error)
    }
  }

  const formatCurrency = (value?: number) => (value ? value.toLocaleString('vi-VN') + 'đ' : '0đ')

  const mappedPastBudgets = pastBudgets.map((budget) => ({
    ...budget,
    spent: Object.fromEntries(Object.entries(budget.spent).map(([key, value]) => [key, value || 0]))
  }))

  return (
    <div className={styles.budgetPage} data-tour='budget-page'>
      <h1 className={styles.budgetTitle}>💰 Quản lý Ngân sách</h1>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
        </div>
      ) : (
        <div className='budget-section'>
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === 'setup' && (
            <div className='budget-progress'>
              <SetupTab
                totalBudget={totalBudget}
                totalAllocated={totalAllocated}
                remaining={remaining}
                remainingMonthlyBudget={remainingMonthlyBudget}
                budgetAllocations={budgetAllocations}
                suggestedCategories={['Ăn uống', 'Đi lại', 'Tiện ích', 'Giải trí', 'Sức khỏe', 'Giáo dục', 'Tiết kiệm']}
                formatCurrency={formatCurrency}
                handleMonthlyBudgetChange={handleMonthlyBudgetChange}
                monthlyBudget={monthlyBudget}
                savings={savings}
                handleSavingsChange={setSavings}
                handleSaveBudget={(newAllocation: BudgetAllocation[]) => handleSaveAllocationBudget(newAllocation)}
                isBudgetSaved={isBudgetSaved}
                remainingBudget={remainingBudget}
              />
            </div>
          )}

          {activeTab === 'existing' && (
            <div className='budget-categories'>
              <ExistingTab income={income} existingBudgets={existingBudgets} />
            </div>
          )}

          {activeTab === 'history' && (
            <HistoryTab
              pastBudgets={mappedPastBudgets}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              formatCurrency={formatCurrency}
            />
          )}

          {activeTab === 'overview' && <OverviewTab pastBudgets={mappedPastBudgets} />}
        </div>
      )}

      <AddBudgetModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleAddBudget} />

      <FloatingActionButton onClick={() => setShowAddModal(true)} />
    </div>
  )
}

export default BudgetPage
