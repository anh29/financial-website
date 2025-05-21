import { useEffect, useRef, useState } from 'react'

interface UseAnimationProps {
  threshold?: number
  rootMargin?: string
  animationClass?: string
}

export const useAnimation = ({
  threshold = 0.1,
  rootMargin = '0px',
  animationClass = 'animate-in'
}: UseAnimationProps = {}) => {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    const currentElement = elementRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [threshold, rootMargin])

  return {
    ref: elementRef,
    className: isVisible ? animationClass : ''
  }
}
