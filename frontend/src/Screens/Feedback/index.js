import React, { Component } from 'react'
import {Redirect} from "react-router";

class Feedback  extends Component {
    constructor(props) {
        super(props)
        this.state = {
            signedIn: false
        }
    }

    render() {
        if (this.state.signedIn) {
            return <Redirect to={'/'}/>
        } else {
            return (
                <div>
                </div>
            )
        }
    }
}

export default Feedback;
