import { useAppSelector, useAppDispatch } from '../store'
import { addNotification, removeNotification, clearNotifications } from '../store/slices/notificationSlice'
import type { Notification } from '../types'

export const useNotifications = () => {
  const dispatch = useAppDispatch()
  const { notifications } = useAppSelector((state) => state.notifications)

  const showNotification = (message: string, type: Notification['type'] = 'info') => {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date().toISOString(),
    }
    dispatch(addNotification(notification))

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      dispatch(removeNotification(notification.id))
    }, 5000)
  }

  const removeNotificationById = (id: string) => {
    dispatch(removeNotification(id))
  }

  const clearAllNotifications = () => {
    dispatch(clearNotifications())
  }

  return {
    notifications,
    showNotification,
    removeNotification: removeNotificationById,
    clearAllNotifications,
  }
} 