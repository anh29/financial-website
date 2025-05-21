import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Support from '../components/CustomerComponents/SupportSection/Support'
import { FAQ } from '../components/CustomerComponents/SupportSection/FAQ/FAQ'
import { Feedback } from '../components/CustomerComponents/SupportSection/Feedback/Feedback'
import { UserGuide } from '../components/CustomerComponents/SupportSection/UserGuide/UserGuide'
import { Contact } from '../components/CustomerComponents/SupportSection/Contact/Contact'

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
