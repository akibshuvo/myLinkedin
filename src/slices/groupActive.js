import { createSlice } from '@reduxjs/toolkit'


export const groupActive = createSlice({
  name: 'groupChat',
  initialState: {
    value: null
  },
  reducers: {
    groupChat: (state,actions) => {
    state.value = actions.payload
    }
    
  }
})

// Action creators are generated for each case reducer function
export const { groupChat } = groupActive.actions

export default groupActive.reducer