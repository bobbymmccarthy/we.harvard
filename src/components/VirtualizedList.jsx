import * as React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';
import LabelIcon from '@mui/icons-material/Label';
import LabelOutlinedIcon from '@mui/icons-material/Label';
import { IconButton, ListItemIcon } from '@mui/material';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';


function renderRow(props) {
  const { index, style, courses } = props;
  const course = courses[index];

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
    <Button variant ="contained">+</Button>
      <ListItemButton style = {{position: 'absolute', width: '100%', margin: '100px'}}>
        {/* <p>{course.title}</p> */}
        <ListItemText primary={`${course.subject} ${course.catalogNumber}: ${course.title}`} />
        
        
        {/* <ListItemText primary={course.title} /> */}
      </ListItemButton>
      
      <IconButton style = {{marginRight: '-1000px'}}onClick={(event) => event.stopPropagation()}> 
            <LabelOutlinedIcon/>
        </IconButton>
    </ListItem>
  );
}

export default function VirtualizedList({ courses }) {
  return (
    <Box
      sx={{ width: '100%', height: 500, maxWidth: '40vw', bgcolor: 'background.paper' }}
    >
      <FixedSizeList
        height={400}
        width={'40vw'}
        itemSize={64}
        itemCount={courses.length}
        overscanCount={5}
      >
        {({ index, style }) => renderRow({ index, style, courses })}
      </FixedSizeList>
    </Box>
  );
}
