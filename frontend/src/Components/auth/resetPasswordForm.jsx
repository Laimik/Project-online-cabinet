import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Checkbox from '@material-ui/core/Checkbox';
import Alert from '@material-ui/lab/Alert';
import { CallMissedSharp } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({

    resetForm: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "80vh",
      padding:"0 5vw",
      '& div': {
        marginBottom: '10px'
      }
    },
    resetHeader:{
        alignItems:"center"
    },
      
    authAlert: {
      position: "absolute",
      bottom: '10px'
    },
    [theme.breakpoints.up('sm')]:{
      resetForm:{
        width:"60vw",
        height:"50vh",
        margin:"0 auto"
      },

    },
    [theme.breakpoints.up('md')]:{
      resetForm:{
        width:"30vw",
        height:"50vh",
        margin:"0 auto"
      },
    },
  }));
  

export default function ResetPasswordForm(props){
  const classes=useStyles()
  const [newPasswordValue, setNewPasswordValue] = React.useState('');
  const [newPasswordDoubleValue, setNewPasswordDoubleValue] = React.useState('');
  const [codeValue, setCodeValue] = React.useState('');
  const [requiredEmpty, setRequiredEmpty] = React.useState(false);
  const [isBadCode, setIsBadCode] = React.useState(false);
  const [isBadPassword, setIsBadPassword] = React.useState(false);
  const [isPasswordEqual, setIsPasswordsEqual] = React.useState(true);
  const [ isPasswordChanged,setIsPasswordChanged] = React.useState(false);

  const regExpCode=/^[a-zA-Z0-9]{10}$/;
  const handleChangeCode = (event) => {
    setCodeValue(event.target.value);
  };
  const handleChangeNewPassword = (event) => {
    setNewPasswordValue(event.target.value);
  };
  const handleChangeNewPasswordDouble = (event) => {
    setNewPasswordDoubleValue(event.target.value);
  };
  const handleReset = async (event) => {
    setIsPasswordChanged(false);
    
    event.preventDefault();
    if (!codeValue || !newPasswordValue || !newPasswordDoubleValue ) {
      setRequiredEmpty(true);
    } else {
      setRequiredEmpty(false)
      if (!regExpCode.test(codeValue)) {
        setIsBadCode(true)
      } else {
        setIsBadCode(false)
        if (newPasswordValue.length<6) {
          setIsBadPassword(true)
        } else {
          setIsBadPassword(false);
         if (newPasswordValue !== newPasswordDoubleValue) {
              setIsPasswordsEqual(false)
            } else {
              setIsPasswordsEqual(true)
              console.log("меняем пароль на "+newPasswordValue)            }
              setIsPasswordChanged(true)
            }
      }
    }
  };
    return (
    <>
    <AppBar className={classes.resetHeader}>
        <Toolbar>
          <Typography variant="h6">Восстановление пароля</Typography>
        </Toolbar>
      </AppBar>
    <form className={classes.resetForm} onSubmit={handleReset}>

    <TextField
        id="reset-code"
        label="Код для восстановления"
        variant="outlined"
        autoComplete="off"
        onChange={handleChangeCode}
        value={codeValue}
    />
    <TextField
        id="new-password"
        label="Пароль"
        type="password"
        autoComplete="current-password"
        variant="outlined"
        onChange={handleChangeNewPassword}
        value={newPasswordValue}
    />
    <TextField
        id="new-password-repeat"
        label="Повтор пароля"
        type="password"
        autoComplete="current-password"
        variant="outlined"
        onChange={handleChangeNewPasswordDouble}
        value={newPasswordDoubleValue}
    />
    <Button variant="contained" color="primary" type="submit">
      Изменить пароль
    </Button>
    {requiredEmpty &&
              <Alert className={classes.authAlert} severity="error">Необходимо заполнить все поля</Alert>}
              {(!requiredEmpty && isBadCode) &&
              <Alert className={classes.authAlert} severity="error">Код не соответствует формату</Alert>}
              {(!requiredEmpty && !isBadCode && isBadPassword) &&
              <Alert className={classes.authAlert} severity="error">Пароль должен содержать минимум 6 символов</Alert>}
              {(!requiredEmpty && !isBadCode && !isBadPassword &&  !isPasswordEqual) &&
              <Alert className={classes.authAlert} severity="error">Пароли не совпадают</Alert>}
              {(!requiredEmpty && !isBadCode && !isBadPassword &&  isPasswordEqual&&isPasswordChanged) &&
              <Alert className={classes.authAlert} severity="success">Пароль изменен</Alert>}
        </form>
    </>
    )
}