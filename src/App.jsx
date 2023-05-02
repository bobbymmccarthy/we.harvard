import React, {useEffect, useState, useRef} from "react"
import { createEventId } from './event-utils'
import TextField from '@mui/material/TextField';
import Courses from './courses.json';
import { useSelector, useDispatch} from 'react-redux';
import BasicSelect from "./components/BasicSelect";
import ClassCard from "./components/Class";
import StickyHeadTable from "./components/StickyHeadTable";
import {Container, Grid} from "@mui/material";
import Box from '@mui/material/Box';
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
import TopBanner from "./components/TopBanner";
import { toggleVisibility, removeClass } from "./redux/labels";
import Autocomplete from '@mui/material/Autocomplete';


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

function formatAsUrl(str) {
  // Check if the argument is a string
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  
  // Convert the string to lowercase
  let urlStr = str.toLowerCase();
  
  // Replace spaces with dashes
  urlStr = urlStr.replace(/ /g, '-');
  
  // Remove any non-alphanumeric characters
  urlStr = urlStr.replace(/[^a-z0-9-]/g, '');
  
  return urlStr;
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
  const [displayCourses, setDisplayCourses] = useState([]);
  const [displayCatalog, setDisplayCatalog] = useState(null);
  const label = useSelector((state) => state.label.value)
  const activeLabel = useSelector((state) => state.label.activeLabel)
  const activeClass = useSelector((state) => state.label.activeClass)
  const eventTimes = useSelector((state) => state.label.eventTimes)
  const keys = useSelector((state) => state.label.keys)
  const [gray, setGray] = useState([])
  const [searchText, setSearchText] = useState([]);
  const [selectedSubject, setSubject] = useState([]);
  const [selectedGened, setGened] = useState([]);
  const [autocompleteValue, setAutocompleteValue] = useState(null);
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
      setDisplayCatalog([])
    }
  }, [activeLabel])


  useEffect(() => {
    setDisplayCatalog(<StickyHeadTable courses = {displayCourses} gray = {gray} start = {0} />)   
  }, [displayCourses, activeLabel, gray, activeLabel, selectedSubject, selectedGened])




  useEffect(() => {
    async function fetchData () {
      const query = searchText;
      const subject = subjectDescriptions[selectedSubject];
      
      const response = await fetch(`http://localhost:5001/search?query=${query}`);
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
  
      const record = await response.json();
      if (!record) {
        window.alert(`Class from query ${id} not found`);
        navigate("/");
        return;
      }
      setDisplayCourses(record)

    }

    async function fetchSubjectData () {
      const subject = subjectDescriptions[selectedSubject];
      
      // Handle subject change
      if (subject != 'all') {
        const response = await fetch(`http://localhost:5001/subject?type=${subject}`);
        if (!response.ok) {
          const message = `An error has occurred: ${response.statusText}`;
          window.alert(message);
          return;
        }
        const record = await response.json();
        if (!record) {
          window.alert(`Class from query ${id} not found`);
          navigate("/");
          return;
        }
        setDisplayCourses(record)
      }

    }

    async function fetchGenedData () {
      const gened = formatAsUrl(selectedGened);
      
    // Handle subject change
      const response = await fetch(`http://localhost:5001/gened?type=${gened}`);
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
      const record = await response.json();
      if (!record) {
        window.alert(`Class from query ${id} not found`);
        navigate("/");
        return;
      }
      setDisplayCourses(record)

    }

    async function fetchDataSubjectGenedSearch() {
      let subject = "";
      if (typeof selectedSubject === "string" && selectedSubject != "all" && selectedSubject != '') {
        subject = formatAsUrl(subjectDescriptions[selectedSubject]);
      }
      
      const query = searchText;
      
      let gened = "";
      if (typeof selectedGened === "string") {
        gened = formatAsUrl(selectedGened);
      }


      if (subject !== "") {
        const upper_sub = subject.toUpperCase();
        const response = await fetch(`http://localhost:5001/search?query=${query}&subject=${upper_sub}`);
        if (!response.ok) {
          const message = `An error has occurred: ${response.statusText}`;
          window.alert(message);
          return;
        }
        const record = await response.json();
        if (!record) {
          window.alert(`Class from query ${id} not found`);
          navigate("/");
          return;
        }
        setDisplayCourses(record);
      }
      // Handle gened search
      else if (gened !== "") {

        const response = await fetch(`http://localhost:5001/search?query=${query}&GenedType=${gened}`);
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
        setDisplayCourses(record);
      }

      else {
        const response = await fetch(`http://localhost:5001/search?query=${query}`);
        if (!response.ok) {
          const message = `An error has occurred: ${response.statusText}`;
          window.alert(message);
          return;
        }
        const record = await response.json();
        if (!record) {
          window.alert(`Class from query ${id} not found`);
          navigate("/");
          return;
        }
        setDisplayCourses(record);
      } 

    }

    if (searchText != "") {
      fetchDataSubjectGenedSearch();
    }

    if ((selectedSubject != "all" && selectedSubject != "") && searchText == "") {

      fetchSubjectData();
    }
    console.log(selectedGened)
    if (selectedGened != "" && searchText == "") {

      fetchGenedData();
      setGened('');

    }

  
    return;
  }, [searchText, selectedSubject, selectedGened]);

  const handleChangeLabel = (event) => {
    dispatch(setActiveLabel(event.target.value))
  };

  const handleChangeSubject = (value) => {
    setAutocompleteValue(value); // Reset the Autocomplete component
    setSubject(value);
  }

  function handleGenedFilter (genedType) {
    setSearchText('');
    setSubject('');
    setAutocompleteValue(null); // Reset the Autocomplete component
    setGened(genedType);
  }

  const handleVisibility = (course) => {
    dispatch(toggleVisibility(course.id))
  }

  const handleRemoveClass = (id) => {
    const prevEvents = JSON.parse(localStorage.getItem("events"))
    localStorage.setItem("events", JSON.stringify(prevEvents.filter((event) => event.groupId != id)))
    dispatch(removeClass(id))
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
        <Grid item sm = {12} lg = {6} order={{ xs: 1, sm: 1,  lg: 2 }}>
            <Grid container justifyContent={"center"}>
            <ButtonGroup style = {{marginTop: '25px'}} variant = "outlined" aria-label="contained button group">
                <Button sx = {{fontSize: "12px"}} onClick = {() => handleGenedFilter("Aesthetics and Culture")} >Aesthetics and Culture</Button>
                <Button sx = {{fontSize: "12px"}} onClick = {() => handleGenedFilter("Ethics and Civics")}>Ethics and Civics</Button>
                <Button sx = {{fontSize: "12px"}} onClick = {() => handleGenedFilter("Histories, Societies, and Individuals")}>Histories, Societies, and Individuals</Button>
                <Button  sx = {{fontSize: "12px"}}onClick = {() => handleGenedFilter("Science and Technology in Society")}>Science and Technology in Society</Button>
              </ButtonGroup>
              <Grid item xs={12} md={5}>
                <TextField 
                  id="outlined-basic"
                  label="Search" 
                  variant="outlined" 
                  style = {{marginTop : "10px", width: "100%"}} 
                  value={searchText}
                  onChange={handleSearchTextChange}/>
              </Grid>
              <Grid item xs={12} sm ={6} md={3}>
                <BasicSelect  options={label} handleChange = {handleChangeLabel} />
              </Grid>
              <Grid item xs={12} sm ={6} md={4}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={Object.keys(subjectDescriptions)}
                value={autocompleteValue}
                onChange ={(event, newValue) => handleChangeSubject(newValue)}
                sx = {{maxWidth: "100%", marginTop:'10px'}}
                renderInput={(params) => <TextField {...params} label="Subject" />}
              />
              </Grid>
            </Grid>
            
            {/* <h3>{searchText}</h3> */}
            <Box>
              {displayCatalog}
              {activeClass && <ClassCard  course = {activeClass} />}
            </Box>
        </Grid>
      </Grid>
    </>
  )
}


export default App
