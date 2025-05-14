import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Support from '../components/features/Support/Support'
import { FAQ } from '../components/features/Support/FAQ/FAQ'
import { Feedback } from '../components/features/Support/Feedback/Feedback'
import { UserGuide } from '../components/features/Support/UserGuide/UserGuide'
import { Contact } from '../components/features/Support/Contact/Contact'

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
