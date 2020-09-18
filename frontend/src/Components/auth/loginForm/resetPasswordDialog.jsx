import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  resetButton:{
    marginTop:"20px"
  }
}));
export default function ResetPasswordDialog(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen} className={classes.resetButton}>
        Восстановить пароль
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Восстановление пароля"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Отправить инструкцию по восстановльнию пароля на адрес {props.email}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Нет
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Да
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}