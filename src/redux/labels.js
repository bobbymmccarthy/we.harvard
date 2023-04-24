import { createSlice } from '@reduxjs/toolkit'

export const labelsSlice = createSlice({
  name: 'labels',
  initialState: {
    value: {},
    activeLabel: null,
    activeClass: null
  },
  reducers: {
    addLabel: (state, action) => {
      const {course, label} = action.payload;
      if (!(label in state.value)){
        state.value[label] = [course]
      }
      else{
        state.value[label].push(course)
      }
    },
    setActiveLabel: (state, action) => {
        if (action.payload == 'all'){
            state.activeLabel = null
        }
        else{
            state.activeLabel = action.payload
        }
        
    },
    setActiveClass: (state, action) => {
        state.activeClass = action.payload
        
    },
  }
  
})

// Action creators are generated for each case reducer function
export const { addLabel, setActiveLabel, setActiveClass } = labelsSlice.actions

export default labelsSlice.reducer