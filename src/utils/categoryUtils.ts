import {
  faUtensils,
  faShoppingBag,
  faGamepad,
  faHouse,
  faGraduationCap,
  faChartLine,
  faUsers,
  faPlane,
  faCar,
  faSuitcaseMedical,
  faMoneyBillWave,
  faGift,
  faPiggyBank
} from '@fortawesome/free-solid-svg-icons'

export const expenseCategories = [
  {
    label: 'Ăn uống',
    icon: faUtensils,
    key: 'food'
  },
  {
    label: 'Mua sắm',
    icon: faShoppingBag,
    key: 'shopping'
  },
  {
    label: 'Giải trí',
    icon: faGamepad,
    key: 'entertainment'
  },
  {
    label: 'Nhà cửa',
    icon: faHouse,
    key: 'housing'
  },
  {
    label: 'Giáo dục',
    icon: faGraduationCap,
    key: 'education'
  },
  {
    label: 'Sức khoẻ',
    icon: faSuitcaseMedical,
    key: 'health'
  },
  {
    label: 'Đầu tư',
    icon: faChartLine,
    key: 'investment'
  },
  {
    label: 'Xã hội',
    icon: faUsers,
    key: 'social'
  },
  {
    label: 'Du lịch',
    icon: faPlane,
    key: 'travel'
  },
  {
    label: 'Di chuyển',
    icon: faCar,
    key: 'transportation'
  }
]

export const incomeCategories = [
  {
    label: 'Lương',
    icon: faMoneyBillWave,
    key: 'luong'
  },
  {
    label: 'Quà tặng',
    icon: faGift,
    key: 'quaTang'
  },
  {
    label: 'Tiết kiệm',
    icon: faPiggyBank,
    key: 'tietKiem'
  },
  {
    label: 'Đầu tư',
    icon: faChartLine,
    key: 'dauTu'
  }
]

export const getCategoryInfo = (label: string) => {
  const allCategories = [...expenseCategories, ...incomeCategories]
  const category = allCategories.find((category) => category.label === label)
  if (category) {
    return {
      label: category.label,
      icon: category.icon
    }
  }
  return null
}
