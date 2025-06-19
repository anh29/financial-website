import { useEffect, useState, useMemo } from 'react'
import styles from './UpcomingPage.module.css'
import BillDetails from '../../components/UpcomingPage/BillDetails'
import BillListItem from '../../components/UpcomingPage/BillListItem'
import { useUpcoming } from '../../hooks/features/useUpcoming'
import { UpcomingBill } from '../../types/upcoming'
import { FaExclamationTriangle, FaCheckCircle, FaInbox } from 'react-icons/fa'
import UpcomingHeader from '../../components/UpcomingPage/UpcomingHeader'
import SummaryCards from '../../components/UpcomingPage/SummaryCards'
import UpcomingFiltersBar from '../../components/UpcomingPage/UpcomingFiltersBar'
import AddBillModal from '../../components/UpcomingPage/AddBillModal'
import MarkAsPaidModal from '../../components/UpcomingPage/MarkAsPaidModal'
import { LoadingSpinner } from '../../components/common'
import { FloatingActionButton } from '../../components/common/FloatingActionButton/FloatingActionButton'
import { useNotifications } from '../../hooks/useNotifications'

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

const UpcomingPage = () => {
  const [selectedBill, setSelectedBill] = useState<UpcomingBill | null>(null)
  const { bills, isLoading, error, getUpcomingBills, addBillContribution } = useUpcoming()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tất cả')
  const [categoryFilter, setCategoryFilter] = useState('Tất cả')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showMarkAsPaidModal, setShowMarkAsPaidModal] = useState(false)
  const [selectedMarkAsPaidBill, setSelectedMarkAsPaidBill] = useState<UpcomingBill | null>(null)
  const { showNotification } = useNotifications()

  useEffect(() => {
    getUpcomingBills()
  }, [getUpcomingBills])

  // Show error notification if there's an error
  useEffect(() => {
    if (error) {
      showNotification('Không thể tải danh sách hóa đơn. Vui lòng thử lại.', 'error')
    }
  }, [error, showNotification])

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
    
    try {
      await addBillContribution({
        bill_id: selectedMarkAsPaidBill.bill_id,
        amount: data.amount,
        date_paid: data.date_paid,
        month_paid: data.month_paid
      })
      showNotification('Đã xác nhận thanh toán thành công', 'success')
      await getUpcomingBills() // Refresh the bills list
    } catch (error) {
      showNotification('Không thể xác nhận thanh toán. Vui lòng thử lại.', 'error')
    } finally {
      setShowMarkAsPaidModal(false)
      setSelectedMarkAsPaidBill(null)
    }
  }

  const handleRetry = () => {
    getUpcomingBills()
  }

  // Loading state
  if (isLoading && bills.length === 0) {
    return (
      <div className={`${styles.upcomingPage} bills-section`}>
        <div className='upcoming-section'>
          <UpcomingHeader />
          <div className={styles.loadingContainer}>
            <LoadingSpinner size="large" />
            <p>Đang tải danh sách hóa đơn...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error && bills.length === 0) {
    return (
      <div className={`${styles.upcomingPage} bills-section`}>
        <div className='upcoming-section'>
          <UpcomingHeader />
          <div className={styles.errorContainer}>
            <FaExclamationTriangle className={styles.errorIcon} />
            <h3>Không thể tải dữ liệu</h3>
            <p>Có lỗi xảy ra khi tải danh sách hóa đơn. Vui lòng thử lại.</p>
            <button onClick={handleRetry} className={styles.retryButton}>
              Thử lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.upcomingPage} bills-section`}>
      <div className='upcoming-section'>
        {/* Header */}
        <UpcomingHeader />
        {/* Summary Cards */}
        <SummaryCards
          overdueCount={overdueCount}
          dueSoonCount={dueSoonCount}
          paidCount={paidCount}
          totalDue={totalDue}
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

        {/* Loading overlay for refresh */}
        {isLoading && bills.length > 0 && (
          <div className={styles.loadingOverlay}>
            <LoadingSpinner size="medium" />
          </div>
        )}

        {/* Bill List */}
        <div className={styles.billList}>
          {filteredBills.length === 0 ? (
            <div className={styles.emptyState}>
              <FaInbox className={styles.emptyIcon} />
              <h3>Không có hóa đơn nào</h3>
              <p>
                {search || statusFilter !== 'Tất cả' || categoryFilter !== 'Tất cả'
                  ? 'Không tìm thấy hóa đơn phù hợp với bộ lọc hiện tại.'
                  : 'Bạn chưa có hóa đơn nào. Hãy thêm hóa đơn đầu tiên!'}
              </p>
              {!search && statusFilter === 'Tất cả' && categoryFilter === 'Tất cả' && (
                <button onClick={() => setShowAddModal(true)} className={styles.addFirstBillButton}>
                  Thêm hóa đơn đầu tiên
                </button>
              )}
            </div>
          ) : (
            filteredBills.map((bill) => (
              <BillListItem
                key={bill.bill_id}
                bill={bill}
                getStatusBadge={getStatusBadge}
                getCategoryBadge={getCategoryBadge}
                onMarkAsPaid={handleMarkAsPaid}
              />
            ))
          )}
        </div>

        {/* Bill Details Modal */}
        {selectedBill && <BillDetails selectedBill={selectedBill} handleCloseModal={() => setSelectedBill(null)} />}

        <AddBillModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
          onSuccess={getUpcomingBills}
        />
      </div>

      <FloatingActionButton onClick={() => setShowAddModal(true)} />

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
    </div>
  )
}

export default UpcomingPage
