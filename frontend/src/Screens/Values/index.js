import React, {Component} from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Layout from "../Layout";
import {getAddresses} from "../../Services/addressService";
import {getCounters, sendCounterValues} from "../../Services/counterService";
import {getCounterTypes} from "../../Services/counterTypeService";
import {getCounterValues} from "../../Services/counterValueService";
import authGuard from "../../Components/AuthGuard";
import MenuItem from "@material-ui/core/MenuItem";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import {getCurrentRates, getRate} from "../../Services/rateService";
import style from "./style.css"

class Values extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: props.type,
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
                const allCounters = await getCounters();
                if (allCounters) {
                    const counterType = this.state.counterTypes
                        .find(counterType => counterType.name === this.state.type);

                    const counters = allCounters
                        .filter(counter => counter.counter_type_id === counterType.id
                            && counter.address_id === address.id) || [];

                    const allCounterValues = [];
                    const currentValues = [];
                    for (const counter of counters) {
                        const counterValues = await getCounterValues(counter)
                        allCounterValues.push(...counterValues);
                        const counterCurrentValue = allCounterValues
                            .find(counterValue => counterValue.current &&
                                counterValue.counter_id === counter.id);
                        if (!counterCurrentValue) {
                            currentValues.push({
                                counter_id: counter.id,
                                value: undefined
                            })
                        } else {
                            currentValues.push({...counterCurrentValue});
                        }
                    }

                    this.setState({
                        counterValues: allCounterValues,
                        counters: counters,
                        address: address,
                        currentValues: currentValues
                    })
                }
            }
        }
    }

    async componentDidMount() {
        const addresses = await getAddresses();
        const allCounters = await getCounters();
        const counterTypes = await getCounterTypes();
        const rates = await getRate();
        const allCurrentRates = await getCurrentRates();

        const address = addresses[0];

        const counterType = counterTypes
            .find(counterType => counterType.name === this.state.type);

        const rate = rates
            .find(rate => rate.counter_type_id === counterType.id);

        const counters = allCounters
            .filter(counter => counter.counter_type_id === counterType.id
                && counter.address_id === address.id);

        const currentRates = allCurrentRates
            .find(currentRate => currentRate.counter_type_id === counterType.id);
        console.log(currentRates);

        const allCounterValues = [];
        const currentValues = [];
        for (const counter of counters) {
            const counterValues = await getCounterValues(counter)
            allCounterValues.push(...counterValues);
            const counterCurrentValue = allCounterValues
                .find(counterValue => counterValue.current &&
                    counterValue.counter_id === counter.id);
            if (!counterCurrentValue) {
                currentValues.push({
                    counter_id: counter.id,
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
            counters: counters,
            counterTypes: counterTypes,
            counterValues: allCounterValues,
            rate: rate,
            currentRate: currentRates,
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
                <Layout label={this.state.type}>
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
                        <p className={"rate"}>Стоимость: {this.state.currentRate ? this.state.currentRate.rate : 'Тариф не задан'}</p>
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

export default authGuard(Values);