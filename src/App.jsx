import React, {useEffect, useState, useRef} from "react"
import { createEventId } from './event-utils'
import TextField from '@mui/material/TextField';
import Courses from './courses.json';
import { useSelector, useDispatch} from 'react-redux';
import BasicSelect from "./components/BasicSelect";
import ClassCard from "./components/Class";
import StickyHeadTable from "./components/StickyHeadTable";
import {Grid} from "@mui/material";
import Box from '@mui/material/Box';
import Calendar from "./components/Calendar";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RemoveIcon from '@mui/icons-material/Remove';
import { setActiveLabel } from './redux/labels'
import { removeClass, addLabel, removeLabel, toggleVisibility } from "./redux/labels";
import TopBanner from "./components/TopBanner";

import "./index.css"
const events = [
  {id: createEventId(), title: 'Meeting', start: new Date() }
]




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
  const [displayCourses, setDisplayCourses] = useState(Courses);
  const [displayCatalog, setDisplayCatalog] = useState(null);
  const label = useSelector((state) => state.label.value)
  const activeLabel = useSelector((state) => state.label.activeLabel)
  const activeClass = useSelector((state) => state.label.activeClass)
  const eventTimes = useSelector((state) => state.label.eventTimes)
  const keys = useSelector((state) => state.label.keys)
  const [gray, setGray] = useState([])
  const [searchText, setSearchText] = useState([]);
  const dispatch = useDispatch()

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
    for(let i = 0; i < eventTimes.length; i++){
      if(busy.includes(eventTimes[i].start.day) && !(currStartTime >= eventTimes[i].end.hour || currEndTime <= eventTimes[i].start.hour)){
        return false
      }
    }
    return true
  }

  useEffect(() => {
    setGray(displayCourses.filter((course) => !availableTime(course)).map((course) => course.id))
  }, [eventTimes])


  useEffect(() => {
    if (activeLabel){
      setDisplayCourses(label[activeLabel])
    }
    else {
      setDisplayCourses(Courses)
    }
  }, [activeLabel])


  useEffect(() => {
    setDisplayCatalog(<StickyHeadTable courses = {displayCourses} gray = {gray} />)   
  }, [displayCourses, activeLabel, gray, activeLabel])



 

  useEffect(() => {
    async function fetchData () {
      const query = searchText;
      const response = await fetch(`http://localhost:5001/search?query=${query}`);
      // console.log(response);
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
  
      const record = await response.json();
      console.log({record});
      if (!record) {
        window.alert(`Class from query ${id} not found`);
        navigate("/");
        return;
      }
      setDisplayCourses(record)

    }
    if (searchText != "") {
      fetchData();

    }
  
    return;
  }, [searchText]);

  const handleChange = (event) => {
    dispatch(setActiveLabel(event.target.value))
  };

  const handleRemoveClass = (id) => {
    const prevEvents = JSON.parse(localStorage.getItem("events"))
    localStorage.setItem("events", JSON.stringify(prevEvents.filter((event) => event.groupId != id)))
    dispatch(removeClass(id))
  }

  const handleVisibility = (course) => {
    dispatch(toggleVisibility(course.id))
  }

  const handleGenedFilter = (gened) => {
    console.log(gened)
  }
  
  return (
    <>
      <TopBanner />
      <Grid container spacing = {3} >
        <Grid  item sm = {12} lg = {6} order={{ xs: 2, sm: 2, lg: 1 }}>
            <Calendar  />
            <Box container justifyContent={"center"} style ={{marginTop: '10px'}}>
            {label.added &&
              label.added.map((course) => {
                return <ButtonGroup style = {{margin: '10px'}} variant = "contained" aria-label="contained button group">
                          <Button style = {{maxWidth: "80px"}}>{course.subject} {course.catalogNumber} </Button>
                          <Button onClick = {() => handleVisibility(course)}><VisibilityIcon /></Button>
                          <Button onClick={() => handleRemoveClass(course.id)}><RemoveIcon /> </Button>
                      </ButtonGroup>

              })}


            </Box>
            
        </Grid>
        <Grid item sm = {12} lg = {6} order={{ xs: 2, sm: 1, lg: 2 }}>
          <div>
            <Grid container justifyContent={"center"}>
            <ButtonGroup style = {{marginTop: '25px'}} variant = "outlined" aria-label="contained button group">
                <Button sx = {{fontSize: "12px"}} onClick = {() => handleGenedFilter(0)} >Aesthetics and Culture </Button>
                <Button sx = {{fontSize: "12px"}} onClick = {() => handleGenedFilter(1)}>Ethics and Civics</Button>
                <Button sx = {{fontSize: "12px"}} onClick = {() => handleGenedFilter(2)}> Histories, Societies, and Individuals </Button>
                <Button  sx = {{fontSize: "12px"}}onClick = {() => handleGenedFilter(3)}>Science and Technology in Society</Button>
              </ButtonGroup>
              <Grid item xs= {8}>
                <TextField 
                  id="outlined-basic"
                  label="Search" 
                  variant="outlined" 
                  style = {{marginTop : "10px", width: "100%"}} 
                  value={searchText}
                  onChange={handleSearchTextChange}/>
              </Grid>
              <Grid item>
                <BasicSelect  options={label} handleChange = {handleChange} /> 
              </Grid>
            </Grid>
            
            {/* <h3>{searchText}</h3> */}
            <Box>
              {displayCatalog}
              {activeClass && <ClassCard  course = {activeClass} />}
            </Box>
          </div>
        </Grid>
      </Grid>
    </>
  )
}


export default App
