import React, { Component } from 'react'
import Avatar from '@material-ui/core/Avatar';

import authGuard from "../../Components/AuthGuard";
import {isAuthenticated} from "../../Services/authService";
import {getProfile} from "../../Services/profileService";
import {getAddresses} from "../../Services/addressService";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
          loading: true,
          profile: null,
          addresses: []
        }
    }

    async componentDidMount() {
        this.setState ({
            loading: false,
            profile: await getProfile(),
            addresses: await getAddresses()
        })
    }

    render() {
        if (this.state.loading) {
            return <Container>
                <CircularProgress/>
            </Container>;
        } else {
            return (
                <div>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg"/>
                    <p>{this.state.profile.name}</p>
                    <p>{this.state.profile.email}</p>
                    <p>{this.state.profile.phone_number}</p>
                    <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Адрес</TableCell>
                                    <TableCell align="right"/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.addresses.map((address) => (
                                    <TableRow key={address.id}>
                                        <TableCell component="th" scope="row">
                                            {address.address + ', ' + address.apartments}
                                        </TableCell>
                                        <TableCell align="right">{}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )
        }
    }
}

export default authGuard(Profile);