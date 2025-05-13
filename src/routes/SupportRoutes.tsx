import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Support from '../components/CustomerPage/Support/Support'
import FAQ from '../components/CustomerPage/Support/FAQ/FAQ'
import UserGuide from '../components/CustomerPage/Support/UserGuide/UserGuide'
import Feedback from '../components/CustomerPage/Support/Feedback/Feedback'
import Contact from '../components/CustomerPage/Support/Contact/Contact'

const SupportRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path='/' element={<Support />} />
      <Route path='/faq' element={<FAQ />} />
      <Route path='/guide' element={<UserGuide />} />
      <Route path='/feedback' element={<Feedback />} />
      <Route path='/contact' element={<Contact />} />
    </Routes>
  )
}

export default SupportRoutes
