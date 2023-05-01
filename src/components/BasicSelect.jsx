import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useSelector, useDispatch } from 'react-redux'

export default function BasicSelect({options, handleChange}) {
//   const [age, setAge] = React.useState('');
  const labels = useSelector((state) => state.label.value)
  const dispatch = useDispatch()
  

  return (
    <Box sx={{ minWidth: 120 }} style = {{marginTop : "25px"}}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Labels</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
        //   value={age}
          defaultValue={""}
          label="Age"
          onChange={handleChange}
        >
            <MenuItem value={"all"}>all</MenuItem>
          {Object.keys(options).map((option) => {
            return <MenuItem value={option}>{option}</MenuItem>
          })}
        </Select>
      </FormControl>
    </Box>
  );
}