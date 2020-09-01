import React, { Component } from 'react'
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Card from "@material-ui/core/Card";
import styles from "./styles.css";
import {CardHeader} from "@material-ui/core";
import {signIn, signUp} from "../../Services/authService";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";

class SignUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            signedIn: false,
            email: "",
            password: "",
            name: "",
            phoneNumber: ""
        }
    }

    submit = async () => {
        await signUp(this.state.email, this.state.password, this.state.name, this.state.phoneNumber);
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
                            <CardHeader title={'Форма регистрации'}/>
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
                                <TextField
                                    required
                                    id="standard-required"
                                    label="Имя"
                                    onChange={(e) => {
                                        this.setState({name: e.target.value})
                                    }}
                                />
                                <TextField
                                    required
                                    id="standard-required"
                                    label="Номер Телефона"
                                    onChange={(e) => {
                                        this.setState({phoneNumber: e.target.value})
                                    }}
                                />
                            </CardContent>
                            <CardActions>
                                <Link to="/sign_in">
                                    <Button size="small">Вход</Button>
                                </Link>
                                <Button size="small" color="primary" type={"submit"}>
                                    Зарегестрироваться
                                </Button>
                            </CardActions>
                        </Card>
                    </form>
                </div>
            )
        }
    }
}

export default SignUp;
