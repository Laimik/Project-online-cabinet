import React, { Component } from 'react'
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Card from "@material-ui/core/Card";
import styles from "./styles.css";
import {CardHeader} from "@material-ui/core";
import {signIn} from "../../Services/authService";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";

class SignIn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            signedIn: false,
            email: "",
            password: ""
        }
    }

    submit = async () => {
       await signIn(this.state.email, this.state.password);
       this.setState({signedIn: true});
    };

    render() {
        if (this.state.signedIn) {
            return <Redirect to={'/'}/>
        } else {
            return (
                <div id={"signInContainer"}>
                    <form noValidate autoComplete="off" onSubmit={async (e) => {
                        e.preventDefault();
                        await this.submit();
                    }}>
                        <Card>
                            <CardHeader title={'Форма входа'}/>
                            <CardContent>
                                <TextField
                                    required
                                    id="standard-required"
                                    label="Email"
                                    onChange={(e) => {
                                        this.setState({email: e.target.value})
                                    }}
                                />
                                <TextField
                                    required
                                    id="standard-password-input"
                                    label="Пароль"
                                    type="password"
                                    autoComplete="current-password"
                                    onChange={(e) => {
                                        this.setState({password: e.target.value})
                                    }}
                                />
                            </CardContent>
                            <CardActions>
                                <Link to="/sign_up" >
                                    <Button size="small">Регистрация</Button>
                                </Link>
                                <Button size="small" color="primary" type={"submit"}>
                                    Вход
                                </Button>
                            </CardActions>
                        </Card>
                    </form>
                </div>
            )
        }
    }
}

export default SignIn;
