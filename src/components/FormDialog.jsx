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
import {  useDispatch } from 'react-redux'
import { addLabel } from '../redux/labels'

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [searchText, setSearchText] = React.useState("")
  const dispatch = useDispatch()
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = () => {
    dispatch(addLabel({course: props.course, label: searchText}))
    setOpen(false)
  }
  

  return (
    <div>
      <IconButton onClick={handleClickOpen}> 
            <LabelOutlinedIcon/>
        </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Labels</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create or Select a Label for this Class
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Label"
            fullWidth
            variant="standard"
            value={searchText}
            onChange = {(event) => setSearchText(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}