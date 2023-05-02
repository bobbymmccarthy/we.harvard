import React, {useEffect, useState, useRef} from "react"
import { createEventId } from './event-utils'
import TextField from '@mui/material/TextField';
import Courses from './courses.json';
import { useSelector, useDispatch} from 'react-redux';
import BasicSelect from "./components/BasicSelect";
import ClassCard from "./components/Class";
import StickyHeadTable from "./components/StickyHeadTable";
import {Grid} from "@mui/material";
import Calendar from "./components/Calendar";
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RemoveIcon from '@mui/icons-material/Remove';
import { setActiveLabel } from './redux/labels'
import subjectDescriptions from './subject_description.json';



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
  const [selectedSubject, setSubject] = useState([]);
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
    setDisplayCatalog(<StickyHeadTable style = {{maxHeight: '100%'}} courses = {displayCourses} gray = {gray} />)   
  }, [displayCourses, activeLabel, gray, activeLabel])




  useEffect(() => {
    async function fetchData () {
      const query = searchText;
      const subject = subjectDescriptions[selectedSubject];
      console.log(subject);
      
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

    async function fetchSubjectData () {
      const subject = subjectDescriptions[selectedSubject];
      console.log(subject);
      
      // Handle subject change
      if (subject != 'all') {
        const response = await fetch(`http://localhost:5001/subject?type=${subject}`);
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

    }

    async function fetchDataSubjectGenedSearch () {
      const subject = subjectDescriptions[selectedSubject];
      const query = searchText;
      console.log(subject);
      
      // Handle subject change
      if (subject != 'all') {
        const response = await fetch(`http://localhost:5001/search?query=${query}&subject=${subject}`);
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

    }

    if (searchText != "" && selectedSubject == "all") {
      fetchData();
    }

    if (selectedSubject != "all" && searchText == "") {
      fetchSubjectData();
    }

    if (selectedSubject != "all" && searchText != "") {
      // console.log('inside fetch')
      fetchDataSubjectGenedSearch();
    }
  
    return;
  }, [searchText, selectedSubject]);

  const handleChangeLabel = (event) => {
    dispatch(setActiveLabel(event.target.value))
  };

  const handleChangeSubject = (event) => {
    setSubject(event.target.value);
  }
  
  return (
    <Grid container spacing = {3}>
      <Grid  item xs = {6} >
          <Calendar  />
          {label.added &&
            label.added.map((course) => {
              return <ButtonGroup variant = "contained" aria-label="contained button group">
                      <Button>{course.subject} {course.catalogNumber} </Button>
                      <Button onClick = {() => handleVisibility(course)}><VisibilityIcon /></Button>
                      <Button onClick={() => handleRemoveClass(course.id)}><RemoveIcon /> </Button>
                    </ButtonGroup>
            })}
          
      </Grid>
      <Grid item xs = {6}>
        <div>
          <Grid container justifyContent={"center"}>
          <ButtonGroup variant = "outlined" aria-label="contained button group">
              <Button onClick = {() => handleGenedFilter(0)} >Aesthetics and Culture </Button>
              <Button onClick = {() => handleGenedFilter(1)}>Ethics and Civics</Button>
              <Button onClick = {() => handleGenedFilter(2)}> Histories, Societies, and Individuals </Button>
              <Button onClick = {() => handleGenedFilter(3)}>Science and Technology in Society</Button>
            </ButtonGroup>
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
              <BasicSelect  options={label} handleChange = {handleChangeLabel} /> 
            </Grid>
            <Grid item>
              <BasicSelect  options={subjectDescriptions} handleChange = {handleChangeSubject} /> 
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
