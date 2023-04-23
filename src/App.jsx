import React, {useEffect, useState, useRef} from "react"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
import { createEventId } from './event-utils'
import TextField from '@mui/material/TextField';
import Courses from './courses.json'
import ClassCatalog from "./components/ClassCatalog";
import VirtualizedList from "./components/VirtualizedList";
import FormDialog from './FormDialog';
// import ScrollableCardList from "./components/ScrollableCardList";


import "./index.css"
const events = [
  {id: createEventId(), title: 'Meeting', start: new Date() }
]
const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
const labels = {}
const handleDateSelect = (selectInfo) => {
  let title = "busy"
  let calendarApi = selectInfo.view.calendar
  calendarApi.unselect() // clear date selection
  if (title) {
    calendarApi.addEvent({
      id: createEventId(),
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay
    })
  }
}


const handleEventDelete = (clickInfo) => {
  // if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
  //   clickInfo.event.remove()
  // }
  clickInfo.event.remove()
}

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
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventTimes, setEventTimes] = useState([]);
  const [displayCourses, setDisplayCourses] = useState(Courses);
  const [displayCatalog, setDisplayCatalog] = useState(null);

  const [searchText, setSearchText] = useState('');

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  }

  const handleEventClick = (clickInfo) => {
    setSelectedEventId(clickInfo.event.id);
  }

  const availableTime = (course) => {
    // console.log(course.meetingPatterns)
    if (!course.meetingPatterns || course.meetingPatterns.length == 0){
      return true
    }
    const busy = findAvail(course.meetingPatterns)
    let currStartTime = parseInt(course.meetingPatterns[0].startTime.substring(0, 2)) + parseInt(course.meetingPatterns[0].startTime.substring(3, 5)) / 60.0 
    let currEndTime = parseInt(course.meetingPatterns[0].endTime.substring(0, 2)) + parseInt(course.meetingPatterns[0].endTime.substring(3, 5)) / 60.0
    // console.log({currStartTime, currEndTime})
    for(let i = 0; i < eventTimes.length; i++){
      // console.log(eventTimes[i].start.day, busy, eventTimes[i].start.day in busy)
      if(busy.includes(eventTimes[i].start.day) && !(currStartTime >= eventTimes[i].end.hour || currEndTime <= eventTimes[i].start.hour)){
        return false
      }
    }
    return true
  }

  useEffect(() => {
    setDisplayCourses(Courses.filter((course) => {
      // console.log(availableTime(course), course.title)
      return availableTime(course)
    }))
  }, [eventTimes])
  const catalog = null;
  // useEffect(() => {
  //   events.forEach((event) => {
  //     console.log(event)
  //     console.log(`Event "${event.title}" starts at ${weekdays[event.start.getDay()]}, ${event.start.getHours() + event.start.getMinutes()/ 60.0} and ends at ${weekdays[event.end.getDay()]}, ${event.end.getHours() + event.end.getMinutes()/ 60.0}`);
  //   });
  // }, [events]);
  useEffect(() => {
    setDisplayCatalog(<VirtualizedList courses={displayCourses}/>)
  }, [displayCourses])
  // console.log(eventTimes)
  useEffect(() => {
    const calendarApi = calendarRef.current.getApi();

    function handleEventChange() {
      const clientEvents = calendarApi.getEvents();
      const currEventTimes = clientEvents.map((event) => {
         return {start: {day: event.start.getDay(), hour : event.start.getHours() + event.start.getMinutes()/ 60.0}, end: {day: event.end.getDay(), hour: event.end.getHours() + event.end.getMinutes()/ 60.0}}
      });
      setEventTimes(currEventTimes)
      setEvents(clientEvents);
    }

    calendarApi.on('eventAdd', handleEventChange);
    calendarApi.on('eventChange', handleEventChange);
    calendarApi.on('eventRemove', handleEventChange);

    return () => {
      calendarApi.off('eventAdd', handleEventChange);
      calendarApi.off('eventChange', handleEventChange);
      calendarApi.off('eventRemove', handleEventChange);
    };
  }, []);
  
  return (
    <div style={{display: 'flex'}}>
      <div className="calendar-container">
        <FullCalendar
          className = {"calendar"}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView='timeGridWeek'
          headerToolbar={{
            left: "",
            center: "",
            right: ""
          }}
          allDaySlot ={false}
          editable={true}
          selectable = {true}
          selectMirror={true}
          select={handleDateSelect}
          weekends={false}
          events={events}
          ref={calendarRef}
          slotMinTime='09:00:00'
          slotMaxTime='20:00:00'
          eventClick={handleEventDelete}
          eventContent={renderEventContent}
          dayHeaderContent={({ date }, b, c) => {
            return (
              <h3>{weekdays[date.getDay()]}</h3>
            );
          }}
        />
        
      </div>
      <div>
        {/* <VirtualizedList classInfo={displayCatalog}/> */}
        <TextField 
          id="outlined-basic"
          label="Search" 
          variant="outlined" 
          style = {{marginTop : "25px"}} 
          value={searchText}
          onChange={handleSearchTextChange}/>
        {/* <h3>{searchText}</h3> */}
        {displayCatalog}
      </div>
      
    </div>
  )
}


export default App
