import React, {useEffect, useState, useRef} from "react"
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'
import { createEventId } from '../event-utils'
import '../index.css'

import Courses from '../courses.json'

import { useSelector, useDispatch} from 'react-redux'

import { addLabel, addEventTimes, nullAddedClass, nullRemovedClass, removeClass, removeInvisibleEvents } from "../redux/labels";

const events = [
    {id: createEventId(), title: 'Meeting', start: new Date() }
  ]
const weekdays = ["Sunday","Mon","Tue","Wed","Thu","Fri","Saturday"]
const labels = {}

/*
      CONCEPT: Schedule
      ACTION: add_event()
      DESC: allows user to add nonclass events to their schedule via click and drag
  */
const handleDateSelect = (selectInfo) => {
    let title = "busy"
    let calendarApi = selectInfo.view.calendar
    // console.log(calendarApi.getEvents())
    calendarApi.unselect() // clear date selection
    const event = {
        id: createEventId(),
        groupId: 'notCourse',
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      }
    let prevEvents = JSON.parse(localStorage.getItem("events"))
    prevEvents = prevEvents ? prevEvents : []
    prevEvents.push(event)
    // console
    localStorage.setItem("events", JSON.stringify(prevEvents))
    if (title) {
      calendarApi.addEvent(event)
    }
  }

// a custom render function
function renderEventContent(eventInfo) {
    return (
      <div style = {{fontFamily: 'Roboto, sans-serif', overflowY: 'hidden'}}>
        <p style = {{marginTop: '-4px', marginBottom: '-15px'}}>{eventInfo.timeText}</p>
        <h3>{eventInfo.event.title}</h3>
      </div>
    )
  }

const Calendar = () => {
    const calendarRef = useRef(null);
    const [events, setEvents] = useState([]);
    const label = useSelector((state) => state.label.value)
    const keys = useSelector((state) => state.label.keys)
    const activeLabel = useSelector((state) => state.label.activeLabel)
    const addedClass = useSelector((state) => state.label.addedClassInfo)
    const removedClass = useSelector((state) => state.label.removedClass)
    const toggleVisible = useSelector((state) => state.label.toggleVisible)
    const invisibleEvents = useSelector((state) => state.label.invisibleEvents)
    const [classEvents, setClassEvents]  = useState([])
    const dispatch = useDispatch()

    /*
      CONCEPT: Schedule
      ACTION: toggle_visibility()
      DESC: allows users to change the visibility of their classes on the calendar
  */
    useEffect(() => {
      const calendarApi = calendarRef.current.getApi();
      if (toggleVisible.visible){
        invisibleEvents
          .filter((event) => event.groupId == toggleVisible.id)
          .forEach((event) => {
            calendarApi.addEvent(event)
          })
        dispatch(removeInvisibleEvents(toggleVisible.id))
      }
      else{
        calendarApi.getEvents().map((event) => {
          if (event.groupId == toggleVisible.id){
            event.remove()
          }
        })
      }
    }, [toggleVisible])

    useEffect(() => {
      localStorage.setItem("invisibleEvents", JSON.stringify(invisibleEvents))
    }, [invisibleEvents])

    //allow the labels to persist through refresh
    useEffect(() => {
        localStorage.setItem("value", JSON.stringify(label))
        localStorage.setItem("keys", JSON.stringify(keys))
      }, [label])

    //re add events to calendar after refresh
    useEffect(() => {
        // localStorage.clear()
        const calendarApi = calendarRef.current.getApi();
        const events = JSON.parse(localStorage.getItem("events"))
        if (events && calendarApi.getEvents().length == 0){
            for(let i = 0; i < events.length; i ++){
                console.log(events[i])
                calendarApi.addEvent(events[i])
            }
        }
    }, [])

    /*
      CONCEPT: Schedule
      ACTION: delete()
      DESC: deletes all events corresponding to a specific class
  */
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
    
    /*
      CONCEPT: Schedule
      ACTION: delete()
      DESC: deletes events that the user clicked on, deletes singular event if not a course
            but deletes all corresponding events if it is a class
  */
    const handleEventDelete = (clickInfo) => {
        if (clickInfo.event._def.groupId == "notCourse"){
          const events = JSON.parse(localStorage.getItem("events"))
          localStorage.setItem("events", JSON.stringify(events.filter((event) => event.id != clickInfo.event._def.publicId)))
          clickInfo.event.remove()    
        }
        else{
            const prevEvents = JSON.parse(localStorage.getItem("events"))
            localStorage.setItem("events", JSON.stringify(prevEvents.filter((event) => event.groupId != clickInfo.event.groupId)))
            dispatch(removeClass(clickInfo.event.groupId))   
        }
      }
    
    /*
      CONCEPT: Schedule
      ACTION: add_course()
      DESC: adds all of the class events associated with a certain course
     */
    useEffect(() => {
        if(addedClass){
            const events = []
            const fullEvents = []
            const calendarApi = calendarRef.current.getApi();
            for (let i = 0; i < addedClass.starts.length; i++) {
            const eventId = createEventId();
            const event = {
                id: eventId,
                title: `${addedClass.course.subject} ${addedClass.course.catalogNumber}`,
                groupId: addedClass.id,
                start: addedClass.starts[i],
                end: addedClass.ends[i],
                allDay: false,
                color: 'green'
            }
            calendarApi.addEvent(event)
            fullEvents.push(event)
            events.push(eventId)
            
        }
        const prevEvents = JSON.parse(localStorage.getItem("events"));
        localStorage.setItem("events", JSON.stringify(prevEvents ? [ ...prevEvents,...fullEvents] : fullEvents))
        dispatch(addLabel({label: "added", course: addedClass.course}) )
        setClassEvents([...classEvents, ...events])
        dispatch(nullAddedClass())

    }}, [addedClass])

    /*
      CONCEPT: Schedule
      ACTION: filter()
      DESC: helper function to  collect all of the event times of calendar events to allow
            for filtering by availability
  */

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
            height = {'auto'}
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
                <div style = {{margin: '-10px', fontFamily: 'Roboto, sans-serif'}}>
                    <h3>{weekdays[date.getDay()]}</h3>
                </div>
                
              );
            }}
            slotLabelContent={({ date, view }) => {
              const timeText = date.toLocaleTimeString([], { hour: 'numeric', hour12: true, minute: '2-digit' });
              return (
                <div style={{ fontFamily: 'Roboto, sans-serif' }}>
                  {timeText}
                </div>
              );
            }}
          />  
    </>
  )
}

export default Calendar