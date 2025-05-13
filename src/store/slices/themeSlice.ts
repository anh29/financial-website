import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Theme } from '../../types'

interface ThemeState {
  theme: Theme
}

const initialState: ThemeState = {
  theme: 'light'
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
      document.documentElement.setAttribute('data-theme', action.payload)
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', state.theme)
    }
  }
})

export const { setTheme, toggleTheme } = themeSlice.actions
export default themeSlice.reducer
