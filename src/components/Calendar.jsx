import React, {useEffect, useState, useRef} from "react"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
import { createEventId } from '../event-utils'

import Courses from '../courses.json'

import { useSelector, useDispatch} from 'react-redux'

import { addLabel, addEventTimes, nullAddedClass, nullRemovedClass, removeClass } from "../redux/labels";

const events = [
    {id: createEventId(), title: 'Meeting', start: new Date() }
  ]
const weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]
const labels = {}

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

const handleDateSelect = (selectInfo) => {
    let title = "busy"
    let calendarApi = selectInfo.view.calendar
    calendarApi.unselect() // clear date selection
  
    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        groupId: 'notCourse',
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }

  const availableTime = (course, eventTimes) => {
    // console.log(course.meetingPatterns)
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

// a custom render function
function renderEventContent(eventInfo) {
    return (
      <div>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </div>
    )
  }

const Calendar = () => {
    const calendarRef = useRef(null);
    const [events, setEvents] = useState([]);
    const [eventTimes, setEventTimes] = useState([]);
    const [displayCourses, setDisplayCourses] = useState(Courses);
    const [displayCatalog, setDisplayCatalog] = useState(null);
    const label = useSelector((state) => state.label.value)
    const activeLabel = useSelector((state) => state.label.activeLabel)
    const activeClass = useSelector((state) => state.label.activeClass)
    const addedClass = useSelector((state) => state.label.addedClassInfo)
    const addedClasses = useSelector((state) => state.label.addedClasses)
    const removedClass = useSelector((state) => state.label.removedClass)
    const [classEvents, setClassEvents]  = useState([])
    
    const dispatch = useDispatch()

    useEffect(() => {
        if(removedClass)
        {
            const calendarApi = calendarRef.current.getApi();
            const events = calendarApi.getEvents()
            for (let i = 0; i < events.length; i++){
                if (events[i]._def.groupId == removedClass){
                    events[i].remove()
                }
            }
            dispatch(nullRemovedClass())
        }
    }, [removedClass])
    

    const handleEventDelete = (clickInfo) => {
        // if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'?`)) {
        //   clickInfo.event.remove()
        // }
        if (clickInfo.event._def.groupId == "notCourse"){
          clickInfo.event.remove()
        }
        else{
            dispatch(removeClass(clickInfo.event.groupId))
            
        }
        
      }
    useEffect(() => {

        if(addedClass){
            const events = []
            const calendarApi = calendarRef.current.getApi();
            for (let i = 0; i < addedClass.starts.length; i++) {
            const eventId = createEventId();
            // console.log(addedClass.starts[i])
            calendarApi.addEvent({
                id: eventId,
                title: addedClass.title,
                groupId: addedClass.id,
                start: addedClass.starts[i],
                end: addedClass.ends[i],
                allDay: false,
                color: 'green'
            })
            
            events.push(eventId)
            
        }
        dispatch(addLabel({label: "added", course: addedClass.course}) )
        setClassEvents([...classEvents, ...events])
        dispatch(nullAddedClass())

    }}, [addedClass])


    // useEffect(() => {
    //     for (let i = 0; i < displayCourses.length; i++){
    //         if (!availableTime(course, eventTimes)){
    //             gray.add(displayCourses)
    //         }
    //         else {
    //             gray.remove(displayCourses)
    //         }
    //     }
    //     setDisplayCourses(displayCourses.map((course) => {
    //         return {
    //         ...course,
    //         gray: !availableTime(course, eventTimes)
    //         };
    //     }))
    // }, [eventTimes])

    useEffect(() => {
        if (activeLabel){
            setDisplayCourses(label[activeLabel])
        }
        else {
            setDisplayCourses(Courses)
        }
    }, [activeLabel])

    // useEffect(() => {
    // // setDisplayCatalog(<VirtualizedList courses={displayCourses}/>)
    // setDisplayCatalog(<StickyHeadTable style = {{maxHeight: '100%'}} courses = {displayCourses} />)
    
    // }, [displayCourses, activeLabel])

    useEffect(() => {
    const calendarApi = calendarRef.current.getApi();

    function handleEventChange() {
        const clientEvents = calendarApi.getEvents();
        const currEventTimes = clientEvents.map((event) => {
            return {start: {day: event.start.getDay(), 
                    hour : event.start.getHours() + event.start.getMinutes()/ 60.0}, 
                    end: {day: event.end.getDay(), 
                    hour: event.end.getHours() + event.end.getMinutes()/ 60.0}}
        });
        dispatch(addEventTimes(currEventTimes))
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
    <>
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
            slotMinTime='08:00:00'
            slotMaxTime='20:00:00'
            eventClick={handleEventDelete}
            eventContent={renderEventContent}
            dayHeaderContent={({ date }, b, c) => {
              return (
                <h3>{weekdays[date.getDay()]}</h3>
              );
            }}
          />  
    </>
  )
}

export default Calendar