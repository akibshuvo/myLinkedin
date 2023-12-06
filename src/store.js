import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import activeChatSlices from './slices/activeChatSlice'

export default configureStore({
  reducer: {
    logedUser: userReducer,
    activeChat: activeChatSlices
  }
})