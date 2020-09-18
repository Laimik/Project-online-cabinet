import React from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Checkbox from '@material-ui/core/Checkbox';
import Alert from '@material-ui/lab/Alert';

import {Redirect} from "react-router";
import {signIn,signUp} from "../../../Services/authService"

import ResetPasswordDialog from "./resetPasswordDialog"

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  authTabs: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    // maxWidth:"80%",
    // margin:"10% auto"

  },
  authForm: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
    '& div': {
      marginBottom: '10px'
    }
  },

  authTabsHeader: {
    display: "flex",
    alignSelf: "center",
  },
  badInput: {
    borderColor: "red"
  },

  authAlert: {
    position: "absolute",
    bottom: '10px'
  },
  [theme.breakpoints.up('sm')]:{
    authTabsBody:{
      width:"60vw",
      height:"50vh",
      margin:"0 auto"
    },
  },
  [theme.breakpoints.up('md')]:{
    authTabsBody:{
      width:"30vw",
      height:"50vh",
      margin:"0 auto"
    },
  },
}));

export default function LoginForm(props) {
  //component state
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [emailValue, setEmailValue] = React.useState('');
  const [passwordValue, setPasswordValue] = React.useState('');
  const [passwordDoubleValue, setPasswordDoubleValue] = React.useState('');
  const [nameValue, setNameValue] = React.useState('');
  const [phoneValue, setPhoneValue] = React.useState('');
  const classBadInput = '';
  const [requiredEmpty, setRequiredEmpty] = React.useState(false);
  const [isWrongPassword, setIsWrongPassword] = React.useState(false);
  const [isPasswordEqual, setIsPasswordsEqual] = React.useState(true);
  const [isWrongEmail, setIsWrongEmail] = React.useState(false);
  const [isWrongName, setIsWrongName] = React.useState(false);
  const [isWrongPhone, setIsWrongPhone] = React.useState(false);
  const [isUserExist, setIsUserExist] = React.useState(false);
  const [isRegistred, setIsRegistred] = React.useState(false);
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const regExpEmail = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;
  const regExpName = /^[a-zA-Zа-яА-я\s]+$/;
  const regExpPhone = /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/;
  ;
  const handleChangeEmail = (event) => {
    setEmailValue(event.target.value);
  };
  const handleChangePassword = (event) => {
    setPasswordValue(event.target.value);
  };
  const handleChangePasswordDouble = (event) => {
    setPasswordDoubleValue(event.target.value);
  };
  const handleChangeName = (event) => {
    setNameValue(event.target.value);
  };
  const handleChangePhone = (event) => {
    setPhoneValue(event.target.value);
  };

  const handleEnter = async (event) => {
    event.preventDefault();
    if (!emailValue || !passwordValue) {
      setRequiredEmpty(true)
    } else {
      setRequiredEmpty(false)
      if (!regExpEmail.test(emailValue)) {
        setIsWrongEmail(true)

      } else {
        setIsWrongEmail(false)
        await signIn(emailValue, passwordValue);
        const token = await signIn(emailValue, passwordValue);
        if (token) {
          setIsWrongPassword(false);
          setIsSignedIn(true);
        } else {
          setIsWrongPassword(true)
        }
      }
    }

  }
  const handleRegistration = async (event) => {
    setIsUserExist(false);
    setIsRegistred(false);
    event.preventDefault();
    if (!emailValue || !passwordValue || !passwordDoubleValue || !nameValue || !phoneValue) {
      setRequiredEmpty(true);
    } else {
      setRequiredEmpty(false)
      if (!regExpEmail.test(emailValue)) {
        setIsWrongEmail(true)
      } else {
        setIsWrongEmail(false)
        if (!regExpName.test(nameValue)) {
          setIsWrongName(true)
        } else {
          setIsWrongName(false);
          if (!regExpPhone.test(phoneValue)) {
            setIsWrongPhone(true)
          } else {
            setIsWrongPhone(false);
            if (passwordValue !== passwordDoubleValue) {
              setIsPasswordsEqual(false)
            } else {
              setIsPasswordsEqual(true)
              const result = await signUp(emailValue, passwordValue, nameValue, phoneValue);
              if (result === "registred") {
                setIsRegistred(true);
              } else if (result === "dublicate") {
                setIsUserExist(true);
              }
            }
          }
        }
      }
    }
  };
  if (isSignedIn) {
    return <Redirect to={'/'}/>
  } else {
    return (
        <div className={classes.authTabs}>
          <AppBar position="static">
            <Tabs value={value} onChange={handleChange} aria-label="auth and registration tabs"
                  className={classes.authTabsHeader}>
              <Tab label="Вход" {...a11yProps(0)} />
              <Tab label="Регистрация" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0} className={classes.authTabsBody}>
            <form className={classes.authForm} onSubmit={handleEnter}>
              <TextField
                  id="auth-email"
                  label="Электронная почта"
                  variant="outlined"
                  onChange={handleChangeEmail}
                  value={emailValue}
                  required
              />
              <TextField
                  id="auth-password"
                  label="Пароль"
                  type="password"
                  autoComplete="current-password"
                  variant="outlined"
                  onChange={handleChangePassword}
                  value={passwordValue}
                  className={classBadInput}
                  required
              />

              {/* <FormControlLabel
                  control={
                    <Checkbox name="saveSession" color="primary"/>
                  }
                  label="Запомнить меня"
              /> */}
              <Button variant="contained" color="primary" onClick={handleEnter} type="submit">
                Войти
              </Button>
              {(!requiredEmpty && !isWrongEmail && isWrongPassword) &&
              <ResetPasswordDialog email={emailValue}/>}
              {requiredEmpty &&
              <Alert className={classes.authAlert} severity="error">Необходимо заполнить все поля</Alert>}
              {(!requiredEmpty && isWrongEmail) &&
              <Alert className={classes.authAlert} severity="error">Email не соответствует формату</Alert>}
              {(!requiredEmpty && !isWrongEmail && isWrongPassword) &&
              <Alert className={classes.authAlert} severity="error">Неверная пара логин и пароль</Alert>}
              
            </form>
          </TabPanel>
          <TabPanel value={value} index={1} className={classes.authTabsBody}>
            <form className={classes.authForm} onSubmit={handleRegistration}>
              <TextField
                  id="reg-email"
                  label="Электронная почта"
                  variant="outlined"
                  onChange={handleChangeEmail}
                  value={emailValue}
              />
              <TextField
                  id="reg-name"
                  label="Имя"
                  variant="outlined"
                  onChange={handleChangeName}
                  value={nameValue}
              />
              <TextField
                  id="reg-phone"
                  label="Телефон"
                  variant="outlined"
                  onChange={handleChangePhone}
                  value={phoneValue}
              />
              <TextField
                  id="reg-password"
                  label="Пароль"
                  type="password"
                  autoComplete="current-password"
                  variant="outlined"
                  className={classBadInput}
                  onChange={handleChangePassword}
                  value={passwordValue}
              />
              <TextField
                  id="reg-password-repeat"
                  label="Повтор пароля"
                  type="password"
                  autoComplete="current-password"
                  variant="outlined"
                  className={classBadInput}
                  onChange={handleChangePasswordDouble}
                  value={passwordDoubleValue}
              />
              <Button variant="contained" color="primary" type="submit">
                Регистрация
              </Button>
              {requiredEmpty &&
              <Alert className={classes.authAlert} severity="error">Необходимо заполнить все поля</Alert>}
              {(!requiredEmpty && isWrongEmail) &&
              <Alert className={classes.authAlert} severity="error">Email не соответствует формату</Alert>}
              {(!requiredEmpty && !isWrongEmail && isWrongName) &&
              <Alert className={classes.authAlert} severity="error">Недопустимое имя</Alert>}
              {(!requiredEmpty && !isWrongEmail && !isWrongName && isWrongPhone) &&
              <Alert className={classes.authAlert} severity="error">Телефон должен соответствовать
                формату:+7(ХХХ)ХХХ-ХХ-ХХ</Alert>}
              {(!requiredEmpty && !isWrongEmail && !isWrongName && !isWrongPhone && !isPasswordEqual) &&
              <Alert className={classes.authAlert} severity="error">Пароли не совпадают</Alert>}
              {(isUserExist) &&
              <Alert className={classes.authAlert} severity="error">Такой пользователь уже зарегистрирован</Alert>}
              {(isRegistred) &&
              <Alert className={classes.authAlert} severity="success">Новый пользователь зарегистрирован</Alert>}
            </form>
          </TabPanel>
        </div>
    );
  }
}
