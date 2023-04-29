import { createSlice } from '@reduxjs/toolkit'

export const labelsSlice = createSlice({
  name: 'labels',
  initialState: {
    value: {},
    keys: {},
    activeLabel: null,
    activeClass: null,
    addedClassInfo: null,
    addedClasses: []
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
      if(!(course.id in state.keys)){
        state.keys[course.id] = [label]
      }
      else{
        state.keys[course.id].push(label)
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
    addClassToCalendar: (state,action) => {
      console.log(action.payload)
      // state.addedClassInfo = action.payload
      if(!(state.addedClasses.includes(action.payload.id)) && state.addedClasses.length < 10)
      {
        state.addedClassInfo = action.payload
        state.addedClasses.push(action.payload.id)
      }
      
    },
    nullAddedClass: (state) => {
      state.addedClassInfo = null;
    }
  }
  
})

// Action creators are generated for each case reducer function
export const { addLabel, setActiveLabel, setActiveClass, addClassToCalendar, nullAddedClass } = labelsSlice.actions

export default labelsSlice.reducer