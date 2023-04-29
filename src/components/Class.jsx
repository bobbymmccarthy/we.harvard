import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSelector} from 'react-redux'

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const weekdays = ["S","M","Tu","W","Th","F","S"]

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

  function convertTime(militaryTime) {
    var time = militaryTime.split(':');
    var hours = parseInt(time[0]);
    var minutes = time[1];
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    var standardTime = hours + ':' + minutes + ' ' + ampm;
    return standardTime;
  }

function removeTags(str) {
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString();
          
    // Regular expression to identify HTML tags in
    // the input string. Replacing the identified
    // HTML tag with a null string.
    return str.replace( /(<([^>]+)>)/ig, '');
}

export default function ClassCard() {
   
  const activeClass = useSelector((state) => state.label.activeClass)
//   console.log(activeClass)
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card variant="outlined">
      <CardContent>
      <Typography variant="h5" component="div">
        {activeClass.subject} {activeClass.catalogNumber}: {activeClass.title}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        {activeClass.meetingPatterns && activeClass.meetingPatterns[0] ? `${findAvail(activeClass.meetingPatterns).map((day) => weekdays[day]).join("")} ${convertTime(activeClass.meetingPatterns[0].startTime)}-${convertTime(activeClass.meetingPatterns[0].endTime)}` : "TBA"}
      </Typography>
      <Typography variant="body2">
        {removeTags(activeClass.description)}
      </Typography>
    </CardContent>
    {/* <CardActions>
      <Button size="small">Learn More</Button>
    </CardActions> */}
      </Card>
    </Box>
  );
}