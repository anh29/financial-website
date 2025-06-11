import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import EditTransactionModal from './EditTransactionModal'
import styles from './TransactionTable.module.css'
import { Transaction } from '../../types/transaction'
import { getCategoryInfo, categoryColors } from '../../utils/categoryUtils'
import { faChevronRight, faChevronDown, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { format, addDays } from 'date-fns'
import { useLanguage } from '../../context/LanguageContext'

interface TransactionTableProps {
  transactions: Transaction[]
  updatedTransactions: Transaction[]
  onTransactionUpdate?: (updatedTransactions: Transaction[]) => void
  viewMode?: 'compact' | 'detailed'
}

// Helper to group transactions by date string
const groupByDate = (transactions: Transaction[]) => {
  return transactions.reduce((groups: Record<string, Transaction[]>, tx) => {
    const date = tx.date
      ? new Date(tx.date).toLocaleDateString('vi-VN', { weekday: 'long', month: 'long', day: 'numeric' })
      : new Date(tx.created_at || '').toLocaleDateString('vi-VN', { weekday: 'long', month: 'long', day: 'numeric' })
    if (!groups[date]) groups[date] = []
    groups[date].push(tx)
    return groups
  }, {})
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  updatedTransactions,
  onTransactionUpdate,
  viewMode = 'compact'
}) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isModalOpen, setModalOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const transactionMap = new Map<string, Transaction>()
  transactions.forEach((tx) => transactionMap.set(tx.id, tx))
  updatedTransactions.forEach((tx) => transactionMap.set(tx.id, tx)) // updated takes precedence
  const totalTransactions = Array.from(transactionMap.values())
  const grouped = groupByDate(totalTransactions)
  const { t } = useLanguage()

  // Ensure all groups are collapsed initially
  React.useEffect(() => {
    const collapsed: Record<string, boolean> = {}
    Object.keys(grouped).forEach((date) => {
      collapsed[date] = viewMode === 'detailed'
    })
    setExpandedGroups(collapsed)
    // eslint-disable-next-line
  }, [transactions.length, updatedTransactions.length, viewMode])

  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedTransaction(null)
  }

  const handleTransactionUpdate = (updatedTransaction: Transaction) => {
    const updatedTransactions = transactions.map((transaction) =>
      transaction.id === updatedTransaction.id ? updatedTransaction : transaction
    )
    if (onTransactionUpdate) {
      onTransactionUpdate(updatedTransactions)
    }
    handleCloseModal()
  }

  // Helper for summary
  const getSummary = (txs: Transaction[]) => {
    let income = 0,
      expense = 0
    txs.forEach((tx) => {
      if (tx.type === 'income') income += tx.amount
      if (tx.type === 'expense') expense += tx.amount
    })
    return {
      count: txs.length,
      income,
      expense,
      net: income - expense
    }
  }

  const handleToggleGroup = (date: string) => {
    setExpandedGroups((prev) => ({ ...prev, [date]: !prev[date] }))
  }

  return (
    <div className={styles.tableWrapper}>
      {Object.entries(grouped).map(([date, txs]) => {
        const summary = getSummary(txs)
        const expanded = expandedGroups[date] !== false // default expanded
        return (
          <div className={styles.groupCard} key={date}>
            <div className={styles.groupHeader}>
              <button
                className={styles.expandBtn}
                onClick={() => handleToggleGroup(date)}
                aria-label={expanded ? t('transaction', 'collapseGroup') : t('transaction', 'expandGroup')}
              >
                <FontAwesomeIcon
                  icon={expanded ? faChevronDown : faChevronRight}
                  className={styles.chevron + (expanded ? ' ' + styles.chevronExpanded : '')}
                />
              </button>
              <div className={styles.groupDateWrapper}>
                <div className={styles.groupDate}>{date}</div>
                <div className={styles.groupCount}>
                  <span className={styles.groupCountIcon}>👥</span> {summary.count} {t('transaction', 'transactions')}
                </div>
              </div>
              <div className={styles.groupIncome}>
                +{summary.income.toLocaleString('vi-VN', { minimumFractionDigits: 2 })} VND
              </div>
              <div className={styles.groupExpense}>
                -{summary.expense.toLocaleString('vi-VN', { minimumFractionDigits: 2 })} VND
              </div>
              <div className={styles.groupNetAmount + ' ' + (summary.net < 0 ? styles.negative : styles.positive)}>
                {summary.net < 0
                  ? `-${Math.abs(summary.net).toLocaleString('vi-VN', { minimumFractionDigits: 2 })} VND`
                  : `+${summary.net.toLocaleString('vi-VN', { minimumFractionDigits: 2 })} VND`}
                <span className={styles.groupNetLabel}>{t('transaction', 'balance')}</span>
              </div>
            </div>
            <div className={styles.transactionList + ' ' + (expanded ? styles.show : styles.hide)}>
              {expanded &&
                txs.map((transaction) => (
                  <div className={styles.transactionCard} key={transaction.id}>
                    {(() => {
                      const info = getCategoryInfo(transaction.category)
                      const color = categoryColors[transaction.category] || '#e0e0e0'
                      return (
                        <div className={styles.transactionIcon} style={{ background: color + '22', color }}>
                          {info && info.icon ? (
                            <FontAwesomeIcon icon={info.icon} />
                          ) : (
                            <FontAwesomeIcon icon={faPencilAlt} />
                          )}
                        </div>
                      )
                    })()}
                    <div className={styles.transactionMain}>
                      <div className={styles.transactionTitle}>{transaction.description || t('transaction', 'transaction')}</div>
                      {transaction.is_amortized && transaction.amortized_days && transaction.date && (
                        <div className={styles.amortizedInfo}>
                          {t('transaction', 'amortized')} {format(new Date(transaction.date), 'dd/MM/yyyy')} -{' '}
                          {format(
                            addDays(new Date(transaction.date), Number(transaction.amortized_days)),
                            'dd/MM/yyyy'
                          )}
                        </div>
                      )}
                      <div className={styles.transactionTags}>
                        {(() => {
                          const info = getCategoryInfo(transaction.category)
                          const color = categoryColors[transaction.category] || '#e0e0e0'
                          return (
                            <span className={styles.transactionTag} style={{ background: color + '22', color }}>
                              {info ? info.label : transaction.category}
                            </span>
                          )
                        })()}
                        <span className={styles.transactionAccount}>{transaction.source || t('transaction', 'manual')}</span>
                      </div>
                    </div>
                    <div
                      className={
                        styles.transactionAmount +
                        ' ' +
                        (transaction.type === 'income' ? styles.amountIncome : styles.amountExpense)
                      }
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {transaction.amount.toLocaleString('vi-VN', { minimumFractionDigits: 2 })} VND
                    </div>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEditClick(transaction)}
                      aria-label={t('transaction', 'editTransaction')}
                    >
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )
      })}
      {isModalOpen && selectedTransaction && (
        <EditTransactionModal
          transaction={selectedTransaction}
          onClose={handleCloseModal}
          onTransactionUpdated={handleTransactionUpdate}
        />
      )}
    </div>
  )
}

export default TransactionTable
