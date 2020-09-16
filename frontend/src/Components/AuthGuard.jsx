import {isAuthenticated} from "../Services/authService";
import React from "react";
import {Redirect} from "react-router";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";

export default function authGuard(WrappedComponent) {
    return class extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                loading: true,
                isAuthenticated: undefined
            }
        }

        async componentDidMount() {
            this.setState ({
                loading: false,
                isAuthenticated: await isAuthenticated()
            })
        }

        render() {
            if (this.state.loading){
                return <Container>
                    <CircularProgress />
                </Container>;
            } else {
                return !this.state.isAuthenticated
                    ? <Redirect to={'/sign_in'}/>
                    : <WrappedComponent {...this.props} />;
            }
        }
    }
}