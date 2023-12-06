import { createSlice } from '@reduxjs/toolkit'


export const userSlice = createSlice({
  name: 'logingUser',
  initialState: {
    value: localStorage.getItem("user")?JSON.parse(localStorage.getItem("user")):null,
  },
  reducers: {
    logedUser: (state,actions) => {
    state.value = actions.payload
    }
    
  }
})

// Action creators are generated for each case reducer function
export const { logedUser } = userSlice.actions

export default userSlice.reducer