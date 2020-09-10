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
import {createCounterValue, getCounterValues} from "../../Services/counterValueService";
import authGuard from "../../Components/AuthGuard";
import MenuItem from "@material-ui/core/MenuItem";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import {getCurrentRates, getRate, getRateById} from "../../Services/rateService";


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
            rate: [],
            currentRate: []
        }
    }

    async handleChange(event) {
        const selectedId = event.target.value;
        for (const address of this.state.addresses) {
            if (selectedId === address.id) {
                const counters = await getCounters();
                if (counters) {
                    const gasCounterType = this.state.counterTypes
                        .find(counterType => counterType.name === 'Газ');

                    const gasCounter = counters
                        .find(counter => counter.counter_type_id === gasCounterType.id
                            && counter.address_id === address.id);
                    // console.log(gasCounter);

                    if (gasCounter) {
                        const counterValues = await getCounterValues(gasCounter);

                        this.setState({
                            counterValues: counterValues,
                            counter: gasCounter,
                            address: address
                        })
                    } else {
                        this.setState({
                            counterValues: [],
                            counter: undefined,
                            address: address
                        })
                    }
                }
            }
        }
    }

    async componentDidMount() {
        const addresses = await getAddresses();
        const counters = await getCounters();
        const counterTypes = await getCounterTypes();
        const rate = await getRate();
        const currentRates = await getCurrentRates();

        const address = addresses[0];

        const gasCounterType = counterTypes
            .find(counterType => counterType.name === 'Газ');
        // console.log(gasCounterType);

        const gasRate = rate
            .find(rate => rate.counter_type_id === gasCounterType.id);

        const gasCounter = counters
            .find(counter => counter.counter_type_id === gasCounterType.id
                && counter.address_id === address.id);
        // console.log(gasCounter);

        const gasCurrentRates = currentRates
            .find(currentRate => currentRate.counter_type_id === gasCounterType.id);
        console.log(gasCurrentRates);
        console.log(gasCounter);

        if (gasCounter) {
            const counterValues = await getCounterValues(gasCounter);

            this.setState({
                loading: false,
                addresses: addresses,
                address: address,
                counter: gasCounter,
                counterTypes: counterTypes,
                counterValues: counterValues,
                rate: gasRate,
                currentRate: gasCurrentRates
            })
        } else {
            this.setState({
                loading: false,
                addresses: addresses,
                address: address,
                counter: undefined,
                counterTypes: counterTypes,
                counterValues: [],
                rate: gasRate,
                currentRate: gasCurrentRates
            })
        }
    }

    submit = async () => {
        console.log(this.state.counter);
        await createCounterValue(this.state.counter, this.state.value);
        //window.location.reload(false);
    };

    render() {
        if (this.state.loading) {
            return <Container>
                <CircularProgress/>
            </Container>;
        } else {
            return (
                <Layout label={'Газ'}>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        await this.submit();}}>
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
                        <p>Стоимость: {this.state.currentRate.rate}</p>
                        <div>
                            <TextField
                                label="Показание"
                                id="outlined-size-small"
                                variant="outlined"
                                size="small"
                                onChange={(e) => {
                                    this.setState({value: e.target.value})
                                }}
                            />
                        </div>
                        <Button variant="contained" color="primary" type={"submit"}>
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