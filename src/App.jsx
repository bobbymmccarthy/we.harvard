import React, {useEffect, useState, useRef} from "react"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
import { createEventId } from './event-utils'
import TextField from '@mui/material/TextField';
import Courses from './courses.json'
import VirtualizedList from "./components/VirtualizedList";
import { useSelector, useDispatch} from 'react-redux'
import { nullAddedClass } from "./redux/labels";
import BasicSelect from "./components/BasicSelect";
import ClassCard from "./components/Class";
import StickyHeadTable from "./components/StickyHeadTable";
import {Grid} from "@mui/material";
import { addLabel } from "./redux/labels";
import Calendar from "./components/Calendar";
// import ScrollableCardList from "./components/ScrollableCardList";


import "./index.css"
const events = [
  {id: createEventId(), title: 'Meeting', start: new Date() }
]
const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
const labels = {}




// a custom render function
function renderEventContent(eventInfo) {
  return (
    <div>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </div>
  )
}

const findAvail = (meetingPatterns) => {
  const days = []
  // console.log({meetingPatterns})
  if(meetingPatterns[0].meetsOnMonday){
      days.push(1);
  }
  if(meetingPatterns[0].meetsOnTuesday){
      days.push(2);
  }
  if(meetingPatterns[0].meetsOnWednesday){
      days.push(3);
  }
  if(meetingPatterns[0].meetsOnThursday){
      days.push(4);
  }
  if(meetingPatterns[0].meetsOnFriday){
      days.push(5);
  }
  return days
}

function App() {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  // const [eventTimes, setEventTimes] = useState([]);
  const [displayCourses, setDisplayCourses] = useState(Courses);
  const [displayCatalog, setDisplayCatalog] = useState(null);
  const label = useSelector((state) => state.label.value)
  const activeLabel = useSelector((state) => state.label.activeLabel)
  const activeClass = useSelector((state) => state.label.activeClass)
  // const addedClass = useSelector((state) => state.label.addedClassInfo)
  const eventTimes = useSelector((state) => state.label.eventTimes)
  const [gray, setGray] = useState([])
  const dispatch = useDispatch()


  const [searchText, setSearchText] = useState('');

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  }



  const availableTime = (course) => {
    if (!course.meetingPatterns || course.meetingPatterns.length == 0){
      return true
    }
    const busy = findAvail(course.meetingPatterns)
    let currStartTime = parseInt(course.meetingPatterns[0].startTime.substring(0, 2)) + parseInt(course.meetingPatterns[0].startTime.substring(3, 5)) / 60.0 
    let currEndTime = parseInt(course.meetingPatterns[0].endTime.substring(0, 2)) + parseInt(course.meetingPatterns[0].endTime.substring(3, 5)) / 60.0
    // console.log({currStartTime, currEndTime})
    for(let i = 0; i < eventTimes.length; i++){
      if(busy.includes(eventTimes[i].start.day) && !(currStartTime >= eventTimes[i].end.hour || currEndTime <= eventTimes[i].start.hour)){
        return false
      }
    }
    return true
  }

  useEffect(() => {
    console.log('setting gray')
    // console.log('setting gray')
    // console.log()
    // console.log(displayCourses.filter((course) => !availableTime(course)).map((course) => course.id))
    setGray(displayCourses.filter((course) => !availableTime(course)).map((course) => course.id))
    // setDisplayCourses(displayCourses.map((course) => {
    //   return {
    //     ...course,
    //     gray: !availableTime(course)
    //   };
    // }))
  }, [eventTimes])


  useEffect(() => {

    // console.log({activeLabel})
    if (activeLabel){
      setDisplayCourses(label[activeLabel])
    }
    else {
      setDisplayCourses(Courses)
    }
  }, [activeLabel])

  // console.log({gray})
  useEffect(() => {
    // setDisplayCatalog(<VirtualizedList courses={displayCourses}/>)
    setDisplayCatalog(<StickyHeadTable style = {{maxHeight: '100%'}} courses = {displayCourses} gray = {gray} />)
    
  }, [displayCourses, activeLabel, gray])


  
  return (
    <Grid container spacing = {3}>
      <Grid item xs = {6} >
          <Calendar />
      </Grid>
      <Grid item xs = {6}>
        <div>
          {/* <VirtualizedList classInfo={displayCatalog}/> */}
          <Grid container justifyContent={"center"}>
            <Grid item xs= {8}>
              <TextField 
                id="outlined-basic"
                label="Search" 
                variant="outlined" 
                style = {{marginTop : "25px", width: "100%"}} 
                value={searchText}
                onChange={handleSearchTextChange}/>
            </Grid>
            <Grid item>
              <BasicSelect   /> 
            </Grid>
          </Grid>
          
          {/* <h3>{searchText}</h3> */}
          <Grid item height={'60vh'}>
            {displayCatalog}
          </Grid>
          <Grid item>
            {activeClass && <ClassCard course = {activeClass} />}
          </Grid>
        </div>
      </Grid>
    </Grid>
  )
}


export default App
