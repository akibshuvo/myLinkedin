import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import activeChatSlices from './slices/activeChatSlice'
import chatgroups from './slices/groupActive'

export default configureStore({
  reducer: {
    logedUser: userReducer,
    activeChat: activeChatSlices,
    groupChat: chatgroups,
  }
})