import { useEffect, useState, useMemo } from 'react'
import styles from './UpcomingPage.module.css'
import BillDetails from '../../components/UpcomingPage/BillDetails'
import BillListItem from '../../components/UpcomingPage/BillListItem'
import { useUpcoming } from '../../hooks/features/useUpcoming'
import { UpcomingBill } from '../../types/upcoming'
import { FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'
import UpcomingHeader from '../../components/UpcomingPage/UpcomingHeader'
import SummaryCards from '../../components/UpcomingPage/SummaryCards'
import UpcomingFiltersBar from '../../components/UpcomingPage/UpcomingFiltersBar'
import AddBillModal from '../../components/UpcomingPage/AddBillModal'
import MarkAsPaidModal from '../../components/UpcomingPage/MarkAsPaidModal'

const getStatusBadge = (bill: UpcomingBill) => {
  if (bill.is_overdue)
    return (
      <span className={styles.statusOverdue}>
        <FaExclamationTriangle /> Quá hạn
      </span>
    )
  if (bill.payment_status === 'paid')
    return (
      <span className={styles.statusPaid}>
        <FaCheckCircle /> Đã thanh toán
      </span>
    )
  return <span className={styles.statusUnpaid}>Chưa thanh toán</span>
}

const getCategoryBadge = (category: string) => <span className={styles.categoryBadge}>{category}</span>

const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN') + ' đ'

const UpcomingPage = () => {
  const [selectedBill, setSelectedBill] = useState<UpcomingBill | null>(null)
  const { bills, getUpcomingBills, addBillContribution } = useUpcoming()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tất cả')
  const [categoryFilter, setCategoryFilter] = useState('Tất cả')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showMarkAsPaidModal, setShowMarkAsPaidModal] = useState(false)
  const [selectedMarkAsPaidBill, setSelectedMarkAsPaidBill] = useState<UpcomingBill | null>(null)

  useEffect(() => {
    getUpcomingBills()
  }, [getUpcomingBills])

  // Summary card calculations
  const overdueCount = useMemo(() => bills.filter((b) => b.is_overdue).length, [bills])
  const dueSoonCount = useMemo(
    () =>
      bills.filter(
        (b) =>
          b.days_until_due !== null &&
          b.days_until_due >= 0 &&
          b.days_until_due <= 7 &&
          !b.is_overdue &&
          b.payment_status !== 'paid'
      ).length,
    [bills]
  )
  const paidCount = useMemo(() => bills.filter((b) => b.payment_status === 'paid').length, [bills])
  const totalDue = useMemo(
    () => bills.filter((b) => b.payment_status !== 'paid').reduce((sum, b) => sum + b.amount, 0),
    [bills]
  )

  // Filtered bills
  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      const matchesSearch = bill.title.toLowerCase().includes(search.toLowerCase())
      const matchesStatus =
        statusFilter === 'Tất cả' ||
        (statusFilter === 'Đã thanh toán' && bill.payment_status === 'paid') ||
        (statusFilter === 'Chưa thanh toán' && bill.payment_status === 'unpaid')
      const matchesCategory = categoryFilter === 'Tất cả' || bill.category === categoryFilter
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [bills, search, statusFilter, categoryFilter])

  const handleMarkAsPaid = (bill: UpcomingBill) => {
    setSelectedMarkAsPaidBill(bill)
    setShowMarkAsPaidModal(true)
  }

  const handleConfirmMarkAsPaid = async (data: { amount: number; date_paid: string; month_paid: string }) => {
    if (!selectedMarkAsPaidBill) return
    await addBillContribution({
      bill_id: selectedMarkAsPaidBill.bill_id,
      amount: data.amount,
      date_paid: data.date_paid,
      month_paid: data.month_paid
    })
    setShowMarkAsPaidModal(false)
    setSelectedMarkAsPaidBill(null)
  }

  return (
    <div className={styles.upcomingPage}>
      {/* Header */}
      <UpcomingHeader />
      {/* Summary Cards */}
      <SummaryCards
        overdueCount={overdueCount}
        dueSoonCount={dueSoonCount}
        paidCount={paidCount}
        totalDue={totalDue}
        formatCurrency={formatCurrency}
      />
      {/* Search & Filters Bar */}
      <UpcomingFiltersBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
      />

      {/* Bill List */}
      <div className={styles.billList}>
        {filteredBills.map((bill) => (
          <BillListItem
            key={bill.bill_id}
            bill={bill}
            getStatusBadge={getStatusBadge}
            getCategoryBadge={getCategoryBadge}
            formatCurrency={formatCurrency}
            onMarkAsPaid={handleMarkAsPaid}
          />
        ))}
      </div>

      {/* Bill Details Modal */}
      {selectedBill && <BillDetails selectedBill={selectedBill} handleCloseModal={() => setSelectedBill(null)} />}

      <AddBillModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
      <MarkAsPaidModal
        isOpen={showMarkAsPaidModal && !!selectedMarkAsPaidBill}
        onClose={() => {
          setShowMarkAsPaidModal(false)
          setSelectedMarkAsPaidBill(null)
        }}
        onConfirm={handleConfirmMarkAsPaid}
        bill={{
          bill_id: selectedMarkAsPaidBill?.bill_id || '',
          amount: selectedMarkAsPaidBill?.amount || 0,
          date_paid: new Date().toISOString().slice(0, 10),
          month_paid: selectedMarkAsPaidBill?.due_date || '',
          name: selectedMarkAsPaidBill?.title || ''
        }}
      />
      <button className={styles.fab} onClick={() => setShowAddModal(true)}>
        +
      </button>
    </div>
  )
}

export default UpcomingPage
