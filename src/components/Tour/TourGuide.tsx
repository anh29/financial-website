import { TourProvider, useTour } from '@reactour/tour'
import { TourContext } from '../../utils/tourContext'
import { createTourSteps } from '../../utils/tourSteps'
import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomTourContent } from './CustomTourContent'

const TourController = ({ isTourActive }: { isTourActive: boolean }) => {
  const { setSteps, setIsOpen } = useTour()
  const navigate = useNavigate()

  useEffect(() => {
    if (isTourActive) {
      const steps = createTourSteps(navigate)
      if (setSteps) {
        setSteps(steps)
      }
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [isTourActive, navigate, setSteps, setIsOpen])

  return null
}

export const TourGuide = ({ children }: { children: React.ReactNode }) => {
  const [isTourActive, setIsTourActive] = useState(false)

  const startTour = useCallback(() => setIsTourActive(true), [])
  const stopTour = useCallback(() => setIsTourActive(false), [])
  const setTourState = useCallback((state: boolean) => setIsTourActive(state), [])

  return (
    <TourProvider
      steps={[]} // steps dynamically updated
      className='custom-tour'
      showNavigation={false}
      showBadge={false}
      ContentComponent={(props) => <CustomTourContent {...props} setTourState={setTourState} />}
      styles={{
        popover: (base) => ({
          ...base,
          backgroundColor: '#fde1c8',
          borderRadius: '28px',
          maxWidth: '480px',
          boxShadow: '0 6px 18px rgba(0,0,0,0.1)'
        })
      }}
    >
      <TourContext.Provider value={{ startTour, stopTour, isTourActive, setTourState }}>
        <TourController isTourActive={isTourActive} />
        {children}
      </TourContext.Provider>
    </TourProvider>
  )
}
