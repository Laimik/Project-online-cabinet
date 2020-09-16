import React, {Component} from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import TableRow from "@material-ui/core/TableRow";
import withStyles from "@material-ui/core/styles/withStyles";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import Layout from "../Layout";
import {getAddresses} from "../../Services/addressService";
import {getCounters, sendCounterValues} from "../../Services/counterService";
import {getCounterTypes} from "../../Services/counterTypeService";
import {createCounterValue, getCounterValues} from "../../Services/counterValueService";
import authGuard from "../../Components/AuthGuard";
import MenuItem from "@material-ui/core/MenuItem";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import {getCurrentRates, getRate} from "../../Services/rateService";
import style from "./style.css"


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

class Gas extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            address: undefined,
            addresses: [],
            counters: [],
            counterType: [],
            counterValues: [],
            rate: [],
            currentRate: [],
            currentValues: []
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

                    const gasCounters = counters
                        .filter(counter => counter.counter_type_id === gasCounterType.id
                            && counter.address_id === address.id) || [];

                    const allCounterValues = [];
                    const currentValues = [];
                    for (const gasCounter of gasCounters) {
                        const counterValues = await getCounterValues(gasCounter)
                        allCounterValues.push(...counterValues);
                        const counterCurrentValue = allCounterValues
                            .find(counterValue => counterValue.current &&
                                counterValue.counter_id === gasCounter.id);
                        if (!counterCurrentValue) {
                            currentValues.push({
                                counter_id: gasCounter.id,
                                value: undefined
                            })
                        } else {
                            currentValues.push({...counterCurrentValue});
                        }
                    }

                    this.setState({
                        counterValues: allCounterValues,
                        counters: gasCounters,
                        address: address,
                        currentValues: currentValues
                    })
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

        const gasCounters = counters
            .filter(counter => counter.counter_type_id === gasCounterType.id
                && counter.address_id === address.id);
        // console.log(gasCounter);

        const gasCurrentRates = currentRates
            .find(currentRate => currentRate.counter_type_id === gasCounterType.id);
        console.log(gasCurrentRates);

        const allCounterValues = [];
        const currentValues = [];
        for (const gasCounter of gasCounters) {
            const counterValues = await getCounterValues(gasCounter)
            allCounterValues.push(...counterValues);
            const counterCurrentValue = allCounterValues
                .find(counterValue => counterValue.current &&
                    counterValue.counter_id === gasCounter.id);
            if (!counterCurrentValue) {
                currentValues.push({
                    counter_id: gasCounter.id,
                    value: undefined
                })
            } else {
                currentValues.push({...counterCurrentValue});
            }
        }

        this.setState({
            loading: false,
            addresses: addresses,
            address: address,
            counters: gasCounters,
            counterTypes: counterTypes,
            counterValues: allCounterValues,
            rate: gasRate,
            currentRate: gasCurrentRates,
            currentValues: currentValues
        })
    }

    submit = async () => {
        await sendCounterValues(this.state.currentValues);
        window.location.reload(false);
    };

    renderCounters() {
        return(<>
            {this.state.counters.map((counter, index) => {
                const counterValues = this.state.counterValues.filter(counterValue => counterValue.counter_id === counter.id);
                const currentCounterValue = this.state.currentValues.find(counterValue => counterValue.counter_id === counter.id);

                return(<div className={"TextField"} key={counter.id}>
                    <span className={"value"}>Номер счетчика  {counter.name}</span>
                    <TextField
                        label="Показание"
                        id="outlined-size-small"
                        variant="outlined"
                        size="small"
                        value={currentCounterValue.value || ''}
                        type="number"
                        onChange={(e) => {
                            const currentValuesCopy = [...this.state.currentValues];
                            for (const currentValue of currentValuesCopy) {
                                if (currentValue.counter_id === counter.id) {
                                    currentValue.value = Number(e.target.value);
                                    if (Number.isNaN(currentValue.value))
                                        currentValue.value = undefined;
                                    break;
                                }
                            }
                            this.setState({currentValues: currentValuesCopy});
                        }}
                    />
                </div>);
            })}
        </>)
    }

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
                                className={"addressSelect"}
                                label="Адрес"
                                fullWidth={true}
                                value={this.state.address.id}
                                onChange={event => this.handleChange(event)}
                            >
                                {this.state.addresses.map(address => {
                                    return <MenuItem key={address.id} value={address.id}>{address.address}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                        <p className={"rate"}>Стоимость: {this.state.currentRate.rate}</p>
                        {this.renderCounters()}
                        <Button variant="contained" color="primary" type={"submit"}>
                            Сохранить показания
                        </Button>
                    </form>
                </Layout>
            )
        }
    }
}

export default authGuard(Gas);