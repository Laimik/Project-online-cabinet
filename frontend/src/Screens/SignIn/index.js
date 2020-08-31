import React, { Component } from 'react'
import PropTypes from 'prop-types'
//import { Link } from '@material-ui/core'
import { Link } from 'react-router-dom'
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class SignIn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: ""
        }
    }

    render() {
        return (
            <div>
                <form noValidate autoComplete="off">
                    <TextField required id="standard-required" label="Required" defaultValue="Hello World" />
                    <TextField
                        id="standard-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                    />
                    <Button variant="contained">Default</Button>
                    <Button variant="contained" color="primary">
                        Primary
                    </Button>
                </form>
            </div>
        )
    }
}

export default SignIn;
