import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import LabelOutlinedIcon from '@mui/icons-material/Label';
import { IconButton, ListItemIcon } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux'
import { addLabel } from '../redux/labels'
import Autocomplete from '@mui/material/Autocomplete';

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState("")
  const [showText, setShowText] = React.useState(false)
  const [selectedOption, setSelectedOption] = React.useState(null)
  const labels = useSelector((state) => state.label.value)
  const dispatch = useDispatch()
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setShowText(false)
    setSelectedOption(null)
    setOpen(false);
  };

  /*
      CONCEPT: Course
      ACTION: add_label()
      DESC: adds label to a specific course
  */
  const handleCreate = () => {
    dispatch(addLabel({course: props.course, label: searchText != "" ? searchText: selectedOption }))
    setOpen(false)
    setShowText(false)
    setSelectedOption(null)
  }

  const handleLabelClick = () => {
    setShowText(!showText)
  }
  
  React.useEffect(() => {
    if(!showText){
      setSearchText("")
    }
    else {
      setSelectedOption(null)
    }
  }, [showText])


  /*
      CONCEPT: Course
      ACTION: add_label()
      DESC: prompts user to add label to the course they clicked on
            allows them to pick between labels they have specified
            or make a new labels
  */
  return (
    <div>
      <IconButton onClick={handleClickOpen}> 
            <LabelOutlinedIcon/>
        </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Labels</DialogTitle>
        <DialogContent>
          <Autocomplete
                disablePortal
                disabled = {showText}
                value = {selectedOption}
                id="combo-box-demo"
                onChange = {(event, value) => setSelectedOption(value)}
                options={Object.keys(labels).filter((label) => label != "added")}
                sx = {{maxWidth: "100%"}}
                renderInput={(params) => <TextField {...params} label="Label" />}
              />

          <Button style={{marginTop: '10px', width: "100%"}} onClick = {handleLabelClick} variant = "outlined" >Define New Label</Button>
         {showText && <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Label"
            fullWidth
            variant="standard"
            value={searchText}
            onChange = {(event) => setSearchText(event.target.value)}
          />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled = { searchText == "" && selectedOption == null} onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}