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
        Description
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