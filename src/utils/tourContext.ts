import { createContext, useContext } from 'react'

type TourContextType = {
  startTour: () => void
  stopTour: () => void
  isTourActive: boolean
  setTourState: (state: boolean) => void
}

export const TourContext = createContext<TourContextType | null>(null)

export const useTourControl = () => {
  const context = useContext(TourContext)

  if (!context) {
    throw new Error('useTourControl must be used within a TourGuide')
  }
  return context
}
