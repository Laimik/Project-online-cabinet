import React, { Component } from 'react';
import authGuard from "../../Components/AuthGuard";
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
import {getCounters} from "../../Services/counterService";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import {ExpandLess, ExpandMore, StarBorder} from "@material-ui/icons";
import {getCounterTypes} from "../../Services/counterTypeService";
import Layout from "../Layout";
import styles from "./style.css";
import Button from "@material-ui/core/Button";

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            profile: null,
            addresses: [],
            counter: [],
            counterType: [],
            expandedAddresses: []
        }
    }

    async componentDidMount() {
        this.setState ({
            loading: false,
            profile: await getProfile(),
            addresses: await getAddresses(),
            counters: await getCounters(),
            counterTypes: await getCounterTypes()
        })
    }

    renderAddresses(){
        return (
            <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Адреса
                    </ListSubheader>
                }
            >
                {this.state.addresses.map((address) => {
                    return(
                        <div key={address.id}>
                            <ListItem button onClick={() => {
                                let index = this.state.expandedAddresses.indexOf(address.id);
                                if (index > -1) {
                                    let expandedAddressesCopy = [...this.state.expandedAddresses];
                                    expandedAddressesCopy.splice(index, 1);
                                    this.setState({
                                        expandedAddresses: expandedAddressesCopy
                                    })
                                } else {
                                    this.setState({
                                        expandedAddresses: [...this.state.expandedAddresses, address.id]
                                    })
                                }
                            }}>
                                <ListItemText primary={address.address}/>
                                {this.state.expandedAddresses.indexOf(address.id) > -1 ? <ExpandLess/> : <ExpandMore/>}
                            </ListItem>
                            <Collapse in={this.state.expandedAddresses.indexOf(address.id) > -1}
                                      timeout="auto" unmountOnExit>
                                {this.renderCounter(address)}
                            </Collapse>
                        </div>)
                })}
            </List>
        )
    }

    renderCounter(address){
        return (<TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Тип счетчика</TableCell>
                        <TableCell align="right">Номер счетчика</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.state.counters.map((counter) => {
                        if (address.id === counter.address_id) {
                            return (
                                <TableRow key={counter.id}>
                                    <TableCell component="th" scope="row">
                                        {this.state.counterTypes.find(counterType => counterType.id === counter.counter_type_id).name}
                                    </TableCell>
                                    <TableCell align="right">
                                        {counter.name}
                                    </TableCell>
                                </TableRow>)
                        } else {
                            return null;
                        }

                    } )}
                    <Button color="primary" size={"small"}  className={'buttonNewCounter'} href={`/add_counter?address_id=${address.id}`}>Добавить счетчик</Button>
                </TableBody>
            </Table>
        </TableContainer>)
    }

    render() {
        if (this.state.loading) {
            return <Layout >
                <Container>
                    <CircularProgress className={'circleLoading'}/>
                </Container>
            </Layout>
        } else {
            return (
                <Layout label={'Личный кабинет'}>
                    <div>
                        <div>
                            <p id={"name"}>{this.state.profile.name}</p>
                        </div>
                        <div>
                            <p id={"email"}>{this.state.profile.email}</p>
                            <p>{this.state.profile.phone_number}</p>
                        </div>
                    </div>
                    <div>
                        {this.renderAddresses()}
                    </div>
                    <Button color="primary" className={"buttonNew"} size={"small"} href={'/add_address'}>Добавить адрес</Button>
                </Layout>
            )
        }
    }
}

export default authGuard(Profile);