import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import FormDialog from './FormDialog';
import { useSelector} from 'react-redux'
import { useDispatch } from 'react-redux'
import { setActiveClass, addClassToCalendar, removeClass, removeLabel } from '../redux/labels'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';

const columns = [

  { id: 'courseNum', label: 'Course', minWidth: 200},
  { id: 'title', label: 'Title', minWidth: 200},
  {id: 'labels', label: 'Labels', minWidth: 200}
];


export default function StickyHeadTable({courses, gray}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch()
  const keys = useSelector((state) => state.label.keys)

  React.useEffect(() => {
    setPage(0)
  }, [courses])

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function getISO8601Date(dayOfWeek, militaryTime) {
    // Create a new Date object for the current date and time
    const now = new Date();
  
    // Calculate the number of days until the specified day of the week
    let daysUntilTargetDay = dayOfWeek - now.getDay();
  
    // Set the date of the new Date object to the target day of the week
    now.setDate(now.getDate() + daysUntilTargetDay);
  
    // Parse the military time string and set the hours and minutes of the new Date object
    const [hours, minutes] = militaryTime.split(':');
    now.setHours(hours);
    now.setMinutes(minutes);
  
    // Return the formatted date string in ISO 8601 format
    return now.toISOString();
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

  const addClass = (course) => {
    let starts = [];
    let ends = [];
    if (!course.meetingPatterns || course.meetingPatterns.length == 0){
      return
    }
    let days = findAvail(course.meetingPatterns)
    for (let i = 0; i < days.length; i++) {
      starts.push(getISO8601Date(days[i], course.meetingPatterns[0].startTime))
      ends.push(getISO8601Date(days[i], course.meetingPatterns[0].endTime))
    }
    dispatch(addClassToCalendar({id:course.id, course: course, title: course.title, starts, ends})) 
    // addClasstoCalendar
  }

  /*
      CONCEPT: Schedule
      ACTION: delete()
      DESC: removes class from calendar by ID
  */
  const handleRemoveClass = (id) => {
    const prevEvents = JSON.parse(localStorage.getItem("events"))
    localStorage.setItem("events", JSON.stringify(prevEvents.filter((event) => event.groupId != id)))
    dispatch(removeClass(id))
  }
  /*
      CONCEPT: Course
      ACTION: removeLabel()
      DESC: removes label with course id: id
  */
  const handleDelete = (id, label) => {
    dispatch(removeLabel({id, label}))
  };

  //formats data to be displayed in table
  const createData = (course) => {
    // console.log({gray})
    return { courseNum: <div style = {{display: "flex", alignItems: "center"}}> 
                            <IconButton onClick = {() => keys[course.id] && keys[course.id].includes('added') ? handleRemoveClass(course.id) : addClass(course) } variant="outlined" size = "small" color="primary"> 
                            {keys[course.id] && keys[course.id].includes('added') ? <RemoveIcon /> :<AddIcon />}
                            </IconButton> 
                            <FormDialog course = {course} />
                            {`${course.subject} ${course.catalogNumber}`} 
                        </div>, 
            title: course.title, 
            labels: keys[course.id] ? keys[course.id].map((label) => label == "added" ? <Chip label={label} /> : <Chip label={label} onDelete={() => handleDelete(course.id, label)} />): "", 
            id: course.id,
            course: course};
  }

  //sets active class in order to see class descriptions
  const handleClick = (course) => {
    dispatch(setActiveClass(course))
  }
  const processedClasses = courses.map(createData)

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: '40vh' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {processedClasses
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover onClick = {() => handleClick(row.course)} role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell style = {{color: gray.includes(row.id) ? 'gray': 'black'}} key={column.id} align={column.align}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={processedClasses.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}