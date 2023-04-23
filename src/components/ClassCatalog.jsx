// import React from 'react'
// import Class from './Class'

// const ClassCatalog = ({courses}) => {
//   // console.log({courses})
//   return (
//     <div>
//       {courses.map((course) => {
//         return <Class classInfo={course}/>
//       })}
//     </div>
//   )
// }

// export default ClassCatalog

import * as React from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';

const findAvail = (meetingPatterns) => {
  const days = []
  if(meetingPatterns.meetsOnMonday){
      days.push('M');
  }
  if(meetingPatterns.meetsOnTuesday){
      days.push('T');
  }
  if(meetingPatterns.meetsOnWednesday){
      days.push('W');
  }
  if(meetingPatterns.meetsOnThursday){
      days.push('Th');
  }
  if(meetingPatterns.meetsOnFriday){
      days.push('F');
  }
  return days.join(',')
}

function Class(props) {
  const { index, style, classInfo} = props;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText primary={`Item ${index + 1}`} />
      </ListItemButton>
    </ListItem>
  );
}

export default function ClassCatalog() {
  return (
    <Box
      sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}
    >
      <FixedSizeList
        height={400}
        width={360}
        itemSize={46}
        itemCount={200}
        overscanCount={5}
      >
        {Class}
      </FixedSizeList>
    </Box>
  );
}
