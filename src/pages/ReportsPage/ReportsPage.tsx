import React, { useState } from 'react'
import styles from './ReportsPage.module.css'
import IncomeVsExpenses from '../../components/Reports/IncomeVsExpenses'
import SpendingBreakdown from '../../components/Reports/SpendingBreakdown'
import SpendingOverTime from '../../components/Reports/SpendingOverTime'
import SavingsTrends from '../../components/Reports/SavingsTrends'
import TopCategories from '../../components/Reports/TopCategories'
import { jsPDF } from 'jspdf'

// Mock data for demonstration
const mockData = {
  summary: {
    totalIncome: 8500,
    totalExpenses: 6200,
    netSavings: 2300,
    savingsRate: 27,
    topExpenseCategory: 'Housing',
    topIncomeSource: 'Salary',
    monthOverMonth: 5.2,
    yearOverYear: 12.8
  },
  timeRange: 'Last 30 Days',
  lastUpdated: '2024-03-15',
  // Add raw data for each component
  rawData: {
    incomeVsExpenses: {
      income: [
        { month: 'Jan', amount: 8000 },
        { month: 'Feb', amount: 8500 },
        { month: 'Mar', amount: 9000 }
      ],
      expenses: [
        { month: 'Jan', amount: 6000 },
        { month: 'Feb', amount: 6200 },
        { month: 'Mar', amount: 6500 }
      ]
    },
    spendingBreakdown: [
      { category: 'Housing', amount: 2000, percentage: 32 },
      { category: 'Food', amount: 800, percentage: 13 },
      { category: 'Transport', amount: 600, percentage: 10 },
      { category: 'Entertainment', amount: 400, percentage: 6 },
      { category: 'Others', amount: 2400, percentage: 39 }
    ],
    spendingOverTime: [
      { date: '2024-03-01', amount: 200 },
      { date: '2024-03-02', amount: 150 },
      { date: '2024-03-03', amount: 300 }
    ],
    savingsTrends: [
      { month: 'Jan', amount: 2000 },
      { month: 'Feb', amount: 2300 },
      { month: 'Mar', amount: 2500 }
    ],
    topCategories: [
      { category: 'Housing', amount: 2000, trend: 'up' },
      { category: 'Food', amount: 800, trend: 'down' },
      { category: 'Transport', amount: 600, trend: 'stable' }
    ]
  }
}

const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [reportType, setReportType] = useState('summary')
  const [isDownloading, setIsDownloading] = useState(false)

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const generateCSV = () => {
    const sections = [
      {
        title: 'Summary',
        data: [
          ['Metric', 'Value', 'Period', 'Last Updated'],
          ['Total Income', `$${mockData.summary.totalIncome}`, mockData.timeRange, formatDate(mockData.lastUpdated)],
          [
            'Total Expenses',
            `$${mockData.summary.totalExpenses}`,
            mockData.timeRange,
            formatDate(mockData.lastUpdated)
          ],
          ['Net Savings', `$${mockData.summary.netSavings}`, mockData.timeRange, formatDate(mockData.lastUpdated)],
          ['Savings Rate', `${mockData.summary.savingsRate}%`, mockData.timeRange, formatDate(mockData.lastUpdated)],
          [
            'Month Over Month Growth',
            `${mockData.summary.monthOverMonth}%`,
            mockData.timeRange,
            formatDate(mockData.lastUpdated)
          ],
          [
            'Year Over Year Growth',
            `${mockData.summary.yearOverYear}%`,
            mockData.timeRange,
            formatDate(mockData.lastUpdated)
          ]
        ]
      },
      {
        title: 'Income vs Expenses',
        data: [
          ['Month', 'Income', 'Expenses'],
          ...mockData.rawData.incomeVsExpenses.income.map((item, index) => [
            item.month,
            item.amount,
            mockData.rawData.incomeVsExpenses.expenses[index].amount
          ])
        ]
      },
      {
        title: 'Spending Breakdown',
        data: [
          ['Category', 'Amount', 'Percentage'],
          ...mockData.rawData.spendingBreakdown.map((item) => [item.category, item.amount, `${item.percentage}%`])
        ]
      },
      {
        title: 'Spending Over Time',
        data: [['Date', 'Amount'], ...mockData.rawData.spendingOverTime.map((item) => [item.date, item.amount])]
      },
      {
        title: 'Savings Trends',
        data: [['Month', 'Amount'], ...mockData.rawData.savingsTrends.map((item) => [item.month, item.amount])]
      },
      {
        title: 'Top Categories',
        data: [
          ['Category', 'Amount', 'Trend'],
          ...mockData.rawData.topCategories.map((item) => [item.category, item.amount, item.trend])
        ]
      }
    ]

    return sections
      .map((section) => {
        const sectionHeader = `\n${section.title}\n`
        const sectionData = section.data.map((row) => row.join(',')).join('\n')
        return sectionHeader + sectionData
      })
      .join('\n')
  }

  const generateExcel = () => {
    // For now, we'll return CSV format as Excel
    return generateCSV()
  }

  const generatePDF = () => {
    const doc = new jsPDF()
    let yPosition = 20
    const lineHeight = 7
    const margin = 20

    // Add title
    doc.setFontSize(20)
    doc.text('Financial Report', margin, yPosition)
    yPosition += lineHeight * 2

    // Add period and last updated
    doc.setFontSize(12)
    doc.text(`Period: ${mockData.timeRange}`, margin, yPosition)
    yPosition += lineHeight
    doc.text(`Last Updated: ${formatDate(mockData.lastUpdated)}`, margin, yPosition)
    yPosition += lineHeight * 2

    // Add summary section
    doc.setFontSize(16)
    doc.text('Summary', margin, yPosition)
    yPosition += lineHeight * 1.5

    doc.setFontSize(12)
    const summaryItems = [
      `Total Income: $${mockData.summary.totalIncome}`,
      `Total Expenses: $${mockData.summary.totalExpenses}`,
      `Net Savings: $${mockData.summary.netSavings}`,
      `Savings Rate: ${mockData.summary.savingsRate}%`,
      `Month Over Month Growth: ${mockData.summary.monthOverMonth}%`,
      `Year Over Year Growth: ${mockData.summary.yearOverYear}%`
    ]

    summaryItems.forEach((item) => {
      if (yPosition > doc.internal.pageSize.height - margin) {
        doc.addPage()
        yPosition = margin
      }
      doc.text(item, margin, yPosition)
      yPosition += lineHeight
    })
    yPosition += lineHeight

    // Add Income vs Expenses section
    doc.setFontSize(16)
    doc.text('Income vs Expenses', margin, yPosition)
    yPosition += lineHeight * 1.5

    doc.setFontSize(12)
    mockData.rawData.incomeVsExpenses.income.forEach((item, index) => {
      if (yPosition > doc.internal.pageSize.height - margin) {
        doc.addPage()
        yPosition = margin
      }
      doc.text(`${item.month}:`, margin, yPosition)
      yPosition += lineHeight
      doc.text(`Income: $${item.amount}`, margin + 10, yPosition)
      yPosition += lineHeight
      doc.text(`Expenses: $${mockData.rawData.incomeVsExpenses.expenses[index].amount}`, margin + 10, yPosition)
      yPosition += lineHeight
    })
    yPosition += lineHeight

    // Add Spending Breakdown section
    doc.setFontSize(16)
    doc.text('Spending Breakdown', margin, yPosition)
    yPosition += lineHeight * 1.5

    doc.setFontSize(12)
    mockData.rawData.spendingBreakdown.forEach((item) => {
      if (yPosition > doc.internal.pageSize.height - margin) {
        doc.addPage()
        yPosition = margin
      }
      doc.text(`${item.category}: $${item.amount} (${item.percentage}%)`, margin, yPosition)
      yPosition += lineHeight
    })
    yPosition += lineHeight

    // Add Key Insights section
    doc.setFontSize(16)
    doc.text('Key Insights', margin, yPosition)
    yPosition += lineHeight * 1.5

    doc.setFontSize(12)
    const insights = [
      `Top Expense Category: ${mockData.summary.topExpenseCategory}`,
      `Primary Income Source: ${mockData.summary.topIncomeSource}`
    ]

    insights.forEach((insight) => {
      if (yPosition > doc.internal.pageSize.height - margin) {
        doc.addPage()
        yPosition = margin
      }
      doc.text(insight, margin, yPosition)
      yPosition += lineHeight
    })

    return doc.output('arraybuffer')
  }

  const handleDownloadReport = async (type: string) => {
    try {
      setIsDownloading(true)
      let content: string | ArrayBuffer
      let filename: string
      let mimeType: string

      switch (type) {
        case 'csv':
          content = generateCSV()
          filename = `financial-report-${selectedPeriod}.csv`
          mimeType = 'text/csv;charset=utf-8'
          break
        case 'excel':
          content = generateExcel()
          filename = `financial-report-${selectedPeriod}.csv`
          mimeType = 'text/csv;charset=utf-8'
          break
        case 'pdf':
          content = generatePDF()
          filename = `financial-report-${selectedPeriod}.pdf`
          mimeType = 'application/pdf'
          break
        default:
          throw new Error('Unsupported report type')
      }

      // Create a blob with the correct MIME type
      const blob = new Blob([content], { type: mimeType })

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob)

      // Create a temporary link element
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.download = filename

      // Append to body, click, and remove
      document.body.appendChild(link)
      link.click()

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }, 100)
    } catch (error) {
      console.error('Error downloading report:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className={styles.reportsPage}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Financial Reports</h1>
          <p className={styles.subtitle}>Track and analyze your financial performance</p>
        </div>
        <div className={styles.actions}>
          <select
            className={styles.periodSelect}
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value='7d'>Last 7 Days</option>
            <option value='30d'>Last 30 Days</option>
            <option value='90d'>Last 90 Days</option>
            <option value='1y'>Last Year</option>
            <option value='custom'>Custom Range</option>
          </select>
          <button
            className={styles.downloadBtn}
            onClick={() => handleDownloadReport(reportType)}
            disabled={isDownloading}
          >
            {isDownloading ? 'Downloading...' : 'Download Report 📊'}
          </button>
        </div>
      </div>

      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <h3>Total Income</h3>
          <p className={styles.amount}>${mockData.summary.totalIncome.toLocaleString()}</p>
          <span className={`${styles.trend} ${styles.positive}`}>
            +{mockData.summary.monthOverMonth}% vs last month
          </span>
        </div>
        <div className={styles.summaryCard}>
          <h3>Total Expenses</h3>
          <p className={styles.amount}>${mockData.summary.totalExpenses.toLocaleString()}</p>
          <span className={`${styles.trend} ${styles.negative}`}>
            -{mockData.summary.monthOverMonth}% vs last month
          </span>
        </div>
        <div className={styles.summaryCard}>
          <h3>Net Savings</h3>
          <p className={styles.amount}>${mockData.summary.netSavings.toLocaleString()}</p>
          <span className={`${styles.trend} ${styles.positive}`}>+{mockData.summary.savingsRate}% savings rate</span>
        </div>
        <div className={styles.summaryCard}>
          <h3>Year Over Year</h3>
          <p className={styles.amount}>{mockData.summary.yearOverYear}%</p>
          <span className={`${styles.trend} ${styles.positive}`}>Overall growth</span>
        </div>
      </div>

      <div className={styles.reportTabs}>
        <button
          className={`${styles.tab} ${reportType === 'summary' ? styles.active : ''}`}
          onClick={() => setReportType('summary')}
        >
          Summary
        </button>
        <button
          className={`${styles.tab} ${reportType === 'detailed' ? styles.active : ''}`}
          onClick={() => setReportType('detailed')}
        >
          Detailed Analysis
        </button>
        <button
          className={`${styles.tab} ${reportType === 'trends' ? styles.active : ''}`}
          onClick={() => setReportType('trends')}
        >
          Trends
        </button>
      </div>

      <div className={styles.reportContent}>
        <div className={styles.mainCharts}>
          <div className={styles.chartContainer}>
            <h3>Income vs Expenses</h3>
            <IncomeVsExpenses />
          </div>
          <div className={styles.chartContainer}>
            <h3>Spending Over Time</h3>
            <SpendingOverTime />
          </div>
        </div>

        <div className={styles.secondaryCharts}>
          <div className={styles.chartContainer}>
            <h3>Spending Breakdown</h3>
            <SpendingBreakdown />
          </div>
          <div className={styles.chartContainer}>
            <h3>Top Categories</h3>
            <TopCategories />
          </div>
          <div className={styles.chartContainer}>
            <h3>Savings Trends</h3>
            <SavingsTrends />
          </div>
        </div>
      </div>

      <div className={styles.insights}>
        <h2>Key Insights</h2>
        <div className={styles.insightsGrid}>
          <div className={styles.insightCard}>
            <h4>Top Expense Category</h4>
            <p>{mockData.summary.topExpenseCategory}</p>
            <span className={styles.insightDetail}>Consider reviewing your spending in this category</span>
          </div>
          <div className={styles.insightCard}>
            <h4>Primary Income Source</h4>
            <p>{mockData.summary.topIncomeSource}</p>
            <span className={styles.insightDetail}>Your main source of income</span>
          </div>
          <div className={styles.insightCard}>
            <h4>Savings Rate</h4>
            <p>{mockData.summary.savingsRate}%</p>
            <span className={styles.insightDetail}>You're saving more than the average</span>
          </div>
          <div className={styles.insightCard}>
            <h4>Last Updated</h4>
            <p>{new Date(mockData.lastUpdated).toLocaleDateString()}</p>
            <span className={styles.insightDetail}>Data is current</span>
          </div>
        </div>
      </div>

      <div className={styles.reportActions}>
        <button className={styles.actionBtn} onClick={() => handleDownloadReport('pdf')} disabled={isDownloading}>
          {isDownloading ? 'Downloading...' : 'Download PDF Report'}
        </button>
        <button className={styles.actionBtn} onClick={() => handleDownloadReport('excel')} disabled={isDownloading}>
          {isDownloading ? 'Downloading...' : 'Download Excel Report'}
        </button>
        <button className={styles.actionBtn} onClick={() => handleDownloadReport('csv')} disabled={isDownloading}>
          {isDownloading ? 'Downloading...' : 'Download CSV Data'}
        </button>
      </div>
    </div>
  )
}

export default ReportsPage
