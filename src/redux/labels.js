import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux';

export const labelsSlice = createSlice({
  name: 'labels',
  initialState: {
    value: JSON.parse(localStorage.getItem("value")) ? JSON.parse(localStorage.getItem("value")) : {},
    keys: JSON.parse(localStorage.getItem("keys")) ? JSON.parse(localStorage.getItem("keys")) : {},
    activeLabel: null,
    activeClass: null,
    addedClassInfo: null,
    addedClasses: [],
    eventTimes: JSON.parse(localStorage.getItem("eventTimes")) ? JSON.parse(localStorage.getItem("eventTimes")) : [],
    removedClass: null,
    toggleVisible: {},
    invisibleEvents: JSON.parse(localStorage.getItem("invisibleEvents")) ? JSON.parse(localStorage.getItem("invisibleEvents"))  : []
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
      state.keys[id] = state.keys[id].filter((currLabel) => label != currLabel )
      state.value[label] = state.value[label].filter((course) => course.id != id )
      if (state.value[label].length == 0){
        delete state.value[label]
      }
      // console.log(filteredClasses)
      
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
        localStorage.setItem("addedClasses", JSON.stringify(state.addedClasses))
      }
      
      
    },
    toggleVisibility: (state, action) => {
      const id = action.payload
      const events = JSON.parse(localStorage.getItem("events"))
      if (events.some((event) => event.groupId == id))
      {
        state.toggleVisible = {visible: false, id}
        localStorage.setItem("events", JSON.stringify(events.filter((event) => event.groupId != id)))
        state.invisibleEvents = state.invisibleEvents ? [...state.invisibleEvents, ...events.filter((event) => event.groupId == id)] : events.filter((event) => event.groupId == id)
      }
      else
      {
        state.toggleVisible = {visible: true, id}
      }
    },
    removeInvisibleEvents: (state,action) => {
      const id = action.payload
      const events = JSON.parse(localStorage.getItem("events"))
      localStorage.setItem("events", JSON.stringify([...events,...state.invisibleEvents.filter((event) => event.groupId == id)])) 
      state.invisibleEvents = state.invisibleEvents.filter((event) => event.groupId != id)
    },
    nullAddedClass: (state) => {
      state.addedClassInfo = null;
    },
    addEventTimes: (state, action) => {
      state.eventTimes = action.payload
      localStorage.setItem('eventTimes', JSON.stringify(state.eventTimes))
    },
    removeClass: (state, action) => {
      state.addedClasses = state.addedClasses.filter((id) => id != action.payload)
      state.removedClass = action.payload
      state.keys[action.payload] = state.keys[action.payload].filter((currLabel) => 'added' != currLabel )
      state.value['added'] = state.value['added'].filter((course) => action.payload != course.id)
      if (state.value['added'].length == 0){
        delete state.value["added"]
      }
    },
    nullRemovedClass: (state) => {
      state.removedClass = null;
    }
  }
  
})

// Action creators are generated for each case reducer function
export const {addLabel, 
              setActiveLabel, 
              setActiveClass, 
              addClassToCalendar, 
              toggleVisibility,
              nullAddedClass, 
              addEventTimes, 
              removeClass, 
              nullRemovedClass, 
              removeLabel,
              removeInvisibleEvents} = labelsSlice.actions

export default labelsSlice.reducer