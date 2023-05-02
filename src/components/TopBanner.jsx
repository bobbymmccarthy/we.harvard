import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import GraduationIcon from '../assets/graduation-cap.png'
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

export default function TopBanner() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
         <img style = {{width: "80px"}} src = {GraduationIcon}></img>
         <Typography variant="h5" component="div" sx={{ flexGrow: 1, marginLeft: 2 }}>
            We.Harvard
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}