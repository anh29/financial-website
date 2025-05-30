import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Notification } from '../../types'

interface NotificationState {
  notifications: Notification[]
}

const initialState: NotificationState = {
  notifications: []
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload)
    },
    clearNotifications: (state) => {
      state.notifications = []
    }
  }
})

export const { addNotification, removeNotification, clearNotifications } = notificationSlice.actions
export default notificationSlice.reducer
