import React, { Component } from 'react'
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Card from "@material-ui/core/Card";
import {CardHeader} from "@material-ui/core";
import {signIn} from "../../Services/authService";
import {Redirect} from "react-router";
import {Link} from "react-router-dom";
import SignIn from "../SignIn";

class Cabinet extends Component {
    constructor(props) {
        super(props)
        this.state = {
            signedIn: false,
            email: "",
            password: ""
        }
    }
}
export default Cabinet;