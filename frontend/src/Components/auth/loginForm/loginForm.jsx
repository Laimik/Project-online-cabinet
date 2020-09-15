import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Alert from '@material-ui/lab/Alert';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {signIn,signUp,logOut}from '../../../store/authActions'
async function signInReq(email, password) {
  const response = await fetch(
      `http://localhost:3000/auth/sign_in`, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              
          },
          body: JSON.stringify({
              email,
              password,
          }),
      });

      console.log(response.body)   
  if (response.ok){
      const json = await response.json();
      //await setToken(json.accessToken);
      console.log(json)
      return json
  }
  else return null
}
 async function signUpReq(email, password, name, phoneNumber) {
  const response = await fetch(
      `http://localhost:3000/auth/sign_up`, {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              email,
              password,
              name,
              phone_number: phoneNumber
          }),
      });
  console.log(response.body)
  if (!response.ok){
      //ToDo обработка ошибок регистрации
      //throw new Error( await response.json);
  }
}
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
  authForm:{
    display:"flex",
    flexDirection: "column",
    alignItems:"center",
    justifyContent: "center",
    height:"80vh",
    '& div':{
      marginBottom:'10px'
    }
  },

  authTabsHeader:{
    display:"flex",
    alignSelf:"center",
  },
  badInput:{
    borderColor: "red"
  },

  authAlert:{
    position:"absolute",
    bottom:'10px'
  }
}));

 function LoginForm(props) {
  const classes = useStyles();
  const [value,setValue] = React.useState(0);
  const [emailValue, setEmailValue] = React.useState('');
  const [passwordValue, setPasswordValue] = React.useState('');
  const [passwordDoubleValue, setPasswordDoubleValue] = React.useState('');
  const classBadInput='';
  const [requiredEmpty,setRequiredEmpty]=React.useState(false);
  const [isWrongPassword,setIsWrongPassword]=React.useState(false);
  const [isPasswordEqual,setIsPasswordsEqual]=React.useState(true);
  const [isWrongEmail,setIsWrongEmail]=React.useState(false);
  //console.log(props)
  const handleChange = (event, newValue) => {
    setValue(newValue);
    //console.log(newValue)
  };
  const regExpEmail=/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;
  const handleChangeEmail = (event) => {
    setEmailValue(event.target.value);
    //console.log(event.target.value)
  };
  const handleChangePassword = (event) => {
    setPasswordValue(event.target.value);
    //console.log(event.target.value)
  };
  const handleChangePasswordDouble = (event) => {
    setPasswordDoubleValue(event.target.value);

    //console.log(event.target.value)
  };
//   const handleChange = (event) => {
//     this.setState({ value: event.target.value });

// }
 
const  handleEnter = async(event) =>
  {
    event.preventDefault();
    //console.log("enter " + value + emailValue)
    if (!emailValue || !passwordValue){
      setRequiredEmpty(true)
    } else{
      setRequiredEmpty(false)
      if ( !regExpEmail.test(emailValue)){setIsWrongEmail(true)
        // console.log("email wrong")
          setIsWrongPassword(true)
        }else{
        //  console.log("email ok")
          setIsWrongEmail(false)
          await signIn(emailValue, passwordValue);
          // //this.setState({signedIn: true});
           const token=await signInReq(emailValue, passwordValue);
           props.signIn(emailValue,token);
         
        } 
    }
    
  }
  const handleRegistration = async(event) => {
    event.preventDefault();
    if (!emailValue || !passwordValue || !passwordDoubleValue){
      setRequiredEmpty(true);
    //  console.log("full") 
    } else {
      setRequiredEmpty(false)
      if ( !regExpEmail.test(emailValue)){setIsWrongEmail(true)
      // console.log("email wrong")
      }else{
      //  console.log("email ok")
        setIsWrongEmail(false)
        if (passwordValue!==passwordDoubleValue) {setIsPasswordsEqual(false) 
      //    console.log("pwd no")
        } else {setIsPasswordsEqual(true)
      //    console.log("pwd ok")
          await signUpReq(emailValue, passwordValue,'name', '+7(965)342-76-53');
          // //this.setState({signedIn: true});
           console.log("signed up")
        }
      }     
    }
    
   
  };
  
  return (
    <div className={classes.authTabs}>
      <AppBar position="static"  >
        <Tabs value={value} onChange={handleChange} aria-label="auth and registration tabs" className={classes.authTabsHeader}>
          <Tab label="Вход" {...a11yProps(0)}  />
          <Tab label="Регистрация" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} className={classes.authTabs}>
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

            <FormControlLabel
                control={
                    <Checkbox  name="saveSession" color="primary"/>
                }
                label="Запомнить меня"
            />    
            <Button variant="contained" color="primary" onClick={handleEnter} type="submit">
                Войти
            </Button>
            { requiredEmpty && <Alert className={classes.authAlert} severity="error">Необходимо заполнить все поля</Alert>}
            { (!requiredEmpty && isWrongEmail) && <Alert className={classes.authAlert} severity="error">Email не соответствует формату</Alert>}
            { (!requiredEmpty && !isWrongEmail &&isWrongPassword) && <Alert className={classes.authAlert} severity="error">Неверная пара логин и пароль</Alert>}

        </form>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <form className={classes.authForm} onSubmit={handleRegistration}>
            <TextField
            
            id="reg-email"
            label="Электронная почта"
            variant="outlined"
            onChange={handleChangeEmail}
            value={emailValue}
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
            { requiredEmpty && <Alert className={classes.authAlert}  severity="error">Необходимо заполнить все поля</Alert>}
            { (!requiredEmpty && isWrongEmail) && <Alert className={classes.authAlert} severity="error">Email не соответствует формату</Alert>}
            { (!requiredEmpty && !isWrongEmail &&!isPasswordEqual) && <Alert className={classes.authAlert} severity="error">Пароли не совпадают</Alert>}
        </form>
      </TabPanel>

    </div>
  );
}
const mapStateToProps=(store)=>{
  console.log(store)
  return {
    accessToken: store.accessToken,
    email: store.email
  }
}
const mapDispatchToProps=(dispatch)=>bindActionCreators({signIn,signUp},dispatch)

export default connect(mapStateToProps,mapDispatchToProps)(LoginForm)