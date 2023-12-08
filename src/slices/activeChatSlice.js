import { createSlice } from '@reduxjs/toolkit'


export const activeChatSlice = createSlice({
  name: 'activeChat',
  initialState: {
    value: null
  },
  reducers: {
    activeChat: (state,actions) => {
    state.value = actions.payload
    }
    
  }
})

// Action creators are generated for each case reducer function
export const { activeChat } = activeChatSlice.actions

export default activeChatSlice.reducer