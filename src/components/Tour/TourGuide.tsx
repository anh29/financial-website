import { StepType, TourProvider, useTour } from '@reactour/tour'
import { TourContext } from '../../utils/tourContext'
import { createTourSteps } from '../../utils/tourSteps'
import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CustomTourContent } from './CustomTourContent'
import { useIsMobile } from '../../utils/helpers'

const TourController = ({ isTourActive }: { isTourActive: boolean }) => {
  const { setSteps, setIsOpen } = useTour()
  const navigate = useNavigate()

  useEffect(() => {
    if (isTourActive) {
      const steps = createTourSteps(navigate)
      if (setSteps) {
        setSteps(steps as StepType[])
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
  const isMobile = useIsMobile()
  const location = useLocation()

  const startTour = useCallback(() => {
    if (!isMobile) {
      setIsTourActive(true)
    }
  }, [isMobile])

  const stopTour = useCallback(() => {
    setIsTourActive(false)
    localStorage.setItem('hasSeenTour', 'true')
  }, [])

  const setTourState = useCallback((state: boolean) => {
    if (!isMobile) {
      setIsTourActive(state)
      if (!state) {
        localStorage.setItem('hasSeenTour', 'true')
      }
    }
  }, [isMobile])

  useEffect(() => {
    // Skip tour on mobile devices
    if (isMobile) {
      localStorage.setItem('hasSeenTour', 'true')
      return
    }

    const hasSeenTour = localStorage.getItem('hasSeenTour')
    const path = location.pathname
    const isAuthOrCustomer = path === '/signin' || path === '/signup' || path.startsWith('/customer')
    if (!hasSeenTour && !isAuthOrCustomer) {
      setIsTourActive(true)
    }
  }, [location.pathname, isMobile])

  // If mobile, just render children without tour functionality
  if (isMobile) {
    return <>{children}</>
  }

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
