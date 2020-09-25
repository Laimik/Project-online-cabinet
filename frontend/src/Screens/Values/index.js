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
import {getCurrentRates} from "../../Services/rateService";
import style from "./style.css"
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";

class Values extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            address: undefined,
            addresses: [],
            counters: [],
            counterTypes: [],
            rates: [],
            currentValues: [],
            submitError: false
        }
    }

    async handleChange(event) {
        const selectedId = event.target.value;
        for (const address of this.state.addresses) {
            if (selectedId === address.id) {
                this.setState({
                    address: address,
                })
            }
        }
    }

    getCounterTypeForType = (type) => {
        return this.state.counterTypes
            .find(counterType => counterType.name === type);
    }

    async componentDidMount() {
        const addresses = await getAddresses();
        const counters = await getCounters();
        const counterTypes = await getCounterTypes();
        const rates = await getCurrentRates();

        const address = addresses[0];
        const counterValues = await getCounterValues();
        const currentValues = [];
        for (const counter of counters) {
            const counterCurrentValue = counterValues
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
            rates: rates,
            currentValues: currentValues
        });
    }

    submit = async () => {
        try {
            const counterValues = this.state.currentValues.filter(currentValue => currentValue.value);
            console.log(counterValues);
            await sendCounterValues(counterValues);
            window.location.reload(false);
        } catch (e) {
            this.setState({submitError: true});
            setTimeout(() => {
                this.setState({submitError: false});
            }, 3000);
        }
    };

    renderRateForType(type) {
        const counterType = this.getCounterTypeForType(type);
        const currentRate = this.state.rates
            .find(currentRate => currentRate.counter_type_id === counterType.id);
        return  currentRate ? currentRate.rate : 'Тариф не задан'
    }

    renderCountersForType(type) {
        const counterType = this.getCounterTypeForType(type);
        const counters = this.state.counters
            .filter(counter => counter.counter_type_id === counterType.id &&
                counter.address_id === this.state.address.id);

        return(<>
            {counters.map((counter) => {
                const currentCounterValue = this.state.currentValues.find(counterValue => counterValue.counter_id === counter.id);

                return(<div className={"TextField"} key={counter.id}>
                    <Typography variant="body1" component="p">Номер счетчика  {counter.name}</Typography>
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
                <Layout label={this.props.types.join(' / ')}>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        await this.submit();
                    }}>
                        <FormControl variant="outlined">
                            <InputLabel htmlFor="outlined-age-native-simple">Адрес</InputLabel>
                            <Select
                                className={"addressSelect"}
                                label="Адрес"
                                // fullWidth={true}
                                value={this.state.address.id}
                                onChange={event => this.handleChange(event)}
                            >
                                <MenuItem value="">
                                </MenuItem>
                                {this.state.addresses.map(address => {
                                    return <MenuItem key={address.id} value={address.id}>{address.address}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                        {this.props.types.map((type, index) => {
                            return(<div key={index}>
                                <Typography variant="subtitle1" component="p">{type}</Typography>
                                <Typography variant="caption" component="p">Стоимость: {this.renderRateForType(type)}</Typography>
                                {this.renderCountersForType(type)}
                            </div>);
                        })}
                        <Button variant="contained" color="primary" type={"submit"}>
                            Сохранить показания
                        </Button>
                    </form>
                    <div hidden={!this.state.submitError}>
                        <Alert severity="error">Что-то пошло не так, попробуйте позже</Alert>
                    </div>
                </Layout>
            )
        }
    }
}

export default authGuard(Values);