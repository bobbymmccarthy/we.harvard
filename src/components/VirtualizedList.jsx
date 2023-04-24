import * as React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import Button from '@mui/material/Button';
import FormDialog from './FormDialog';
import {  useDispatch } from 'react-redux'
import { setActiveClass } from '../redux/labels'

function renderRow(props) {
  const { index, style, courses } = props;
  const course = courses[index];
  const dispatch = useDispatch();
  const handleClick = (course) => {
    dispatch(setActiveClass(course))
  }
  

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
    <Button variant ="contained">+</Button>
        <ListItemButton style = {{position: 'absolute', width: '100%', margin: '100px'}} onClick = {() => handleClick(course)}>
        {/* <p>{course.title}</p> */}
        <ListItemText style = {{color: course.gray ? 'gray': 'black'}}primary={`${course.subject} ${course.catalogNumber}: ${course.title}`} />
        
        
        {/* <ListItemText primary={course.title} /> */}
      </ListItemButton>
      
      <FormDialog course = {course} />
    </ListItem>
  );
}

export default function VirtualizedList({ courses}) {
  return (
    <Box
      sx={{ width: '100%', height: 500, minWidth: '40vw', bgcolor: 'background.paper', border: 1, borderRadius: 1 }}
    >
      <FixedSizeList
        height={500}
        width={'100%'}
        itemSize={64}
        itemCount={courses.length}
        overscanCount={5}
      >
        {({ index, style }) => renderRow({ index, style, courses})}
      </FixedSizeList>
    </Box>
  );
}
