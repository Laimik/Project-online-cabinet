import React, {Component} from "react";
import {Redirect} from "react-router";
import SignIn from "../SignIn";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import withStyles from "@material-ui/core/styles/withStyles";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Layout from "../Layout";
import {getProfile} from "../../Services/profileService";
import {getAddresses} from "../../Services/addressService";
import {getCounters} from "../../Services/counterService";
import {getCounterTypes} from "../../Services/counterTypeService";
import {getCounterValues} from "../../Services/counterValueService";
import authGuard from "../../Components/AuthGuard";
import MenuItem from "@material-ui/core/MenuItem";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import {getRate, getRateById} from "../../Services/rateService";


const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

function createData(address, date, value, pay) {
    return { address, date, value, pay };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
];

class Gas extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            address: undefined,
            addresses: [],
            counter: [],
            counterType: [],
            counterValue: [],
            rate: []
        }
    }

    handleChange(event) {
        const selectedId = event.target.value;
        for (const address of this.state.addresses) {
            if (selectedId === address.id) {
                this.setState({
                    address: address
                });
            }
        }
    }

    async componentDidMount() {
        const addresses = await getAddresses();
        const counters = await getCounters();
        const counterTypes = await getCounterTypes();
        const rate = await getRate()

        const address = addresses[0];
        const gasCounterType = counterTypes
            .find(counterType => counterType.name === 'Газ');
        // console.log(gasCounterType);

        const gasCounter = counters
            .find(counter => counter.counter_type_id === gasCounterType.id
                && counter.address_id === address.id);
        // console.log(gasCounter);

        const counterValues = await getCounterValues(gasCounter);
        // console.log(counterValues);

        const gasRate = rate
            .find(rate => rate.counter_type_id === gasCounterType.id);

        this.setState({
            loading: false,
            addresses: addresses,
            address: address,
            counters: counters,
            counterTypes: counterTypes,
            counterValues: counterValues,
            rate: gasRate
        })
    }

    render() {
        if (this.state.loading) {
            return <Container>
                <CircularProgress/>
            </Container>;
        } else {
            return (
                <Layout label={'Газ'}>
                    <form>
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="outlined-age-native-simple">Адрес</InputLabel>
                            <Select
                                label="Адрес"
                                value={this.state.address.id}
                                onChange={event => this.handleChange(event)}
                            >
                                {this.state.addresses.map(address => {
                                    return <MenuItem key={address.id} value={address.id}>{address.address}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                        <p>Стоимость: {this.state.rate}</p>
                        <div>
                            <TextField
                                label="Показание"
                                id="outlined-size-small"
                                variant="outlined"
                                size="small"
                            />
                        </div>
                        <Button variant="contained" color="primary">
                            Добавить показания
                        </Button>
                        <TableContainer component={Paper}>
                            <Table aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="right">Дата</StyledTableCell>
                                        <StyledTableCell align="right">Показание</StyledTableCell>
                                        <StyledTableCell align="right">Оплачено</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <StyledTableRow key={row.address}>
                                            <StyledTableCell align="right">{row.date}</StyledTableCell>
                                            <StyledTableCell align="right">{row.value}</StyledTableCell>
                                            <StyledTableCell align="right">{row.pay}</StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </form>
                </Layout>
            )
        }
    }
}

export default authGuard(Gas);