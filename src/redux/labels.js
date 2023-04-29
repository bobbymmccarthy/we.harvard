import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux';

export const labelsSlice = createSlice({
  name: 'labels',
  initialState: {
    value: {},
    keys: {},
    activeLabel: null,
    activeClass: null,
    addedClassInfo: null,
    addedClasses: [],
    eventTimes: [],
    removedClass: null
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
    removeLabel: (state, action) => {
      const {id, label} = action.payload;
      state.keys[id].filter((currLabel) => label != currLabel )
      state.value[label].filter((currId) => id != currId)
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
      // console.log({class: action.payload})
      // state.addedClassInfo = action.payload
      if(!(state.addedClasses.includes(action.payload.id)) && state.addedClasses.length < 10)
      {
        state.addedClassInfo = action.payload
        state.addedClasses.push(action.payload.id)
      }
      
    },
    nullAddedClass: (state) => {
      state.addedClassInfo = null;
    },
    addEventTimes: (state, action) => {
      state.eventTimes = action.payload
    },
    removeClass: (state, action) => {
      state.addedClasses = state.addedClasses.filter((id) => id != action.payload)
      state.removedClass = action.payload
      state.keys[action.payload] = state.keys[action.payload].filter((currLabel) => 'added' != currLabel )
      state.value['added'] = state.value['added'].filter((course) => action.payload != course.id)
      // console.log(state.value['added'])
    },
    nullRemovedClass: (state) => {
      state.removedClass = null;
    }
  }
  
})

// Action creators are generated for each case reducer function
export const { addLabel, setActiveLabel, setActiveClass, addClassToCalendar, nullAddedClass, addEventTimes, removeClass, nullRemovedClass } = labelsSlice.actions

export default labelsSlice.reducer