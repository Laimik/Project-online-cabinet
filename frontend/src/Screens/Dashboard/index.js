import React, {Component} from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import authGuard from "../../Components/AuthGuard";
import Layout from "../Layout/index";
import FilterGroup from "./FilterGroup";
import ValuesTable from "./ValuesTable";
import {getAddresses} from "../../Services/addressService";
import {getCounters} from "../../Services/counterService";
import {getCounterTypes} from "../../Services/counterTypeService";
import {getCurrentRates} from "../../Services/rateService";
import {getCounterValues} from "../../Services/counterValueService";


class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            addresses: [],
            selectedAddressIndexes: [],
            counters: [],
            selectedCounterIndexes: [],
            counterTypes: [],
            selectedCounterTypeIndexes: [],
            counterValues: [],
            rates: []
        }
    }

    async componentDidMount() {
        const addresses = await getAddresses();
        const counters = await getCounters();
        const counterTypes = await getCounterTypes();
        const rates = await getCurrentRates();
        const counterValues = await getCounterValues();

        this.setState({
            loading: false,
            addresses: addresses,
            counters: counters,
            counterTypes: counterTypes,
            counterValues: counterValues,
            rates: rates
        });
    }

    async applyFilters(selectedAddressIndexes, selectedCounterTypeIndexes, selectedCounterIndexes) {
        let options = {
            addresses: [],
            counterTypes: [],
            counters: []
        };
        for (const index of selectedAddressIndexes) {
            options.addresses.push(this.state.addresses[index]);
        }
        for (const index of selectedCounterTypeIndexes){
            options.counterTypes.push(this.state.counterTypes[index]);
        }
        for (const index of selectedCounterIndexes){
            options.counters.push(this.state.counters[index]);
        }

        const counterValues = await getCounterValues(options);
        this.setState({
            counterValues: counterValues
        });
    }

    render() {
        return (
            <Layout label={'Дашборд'}>
                <Container maxWidth="lg">
                    <Grid container spacing={3} alignItems="stretch">
                        {/* Chart */}
                        <Grid container spacing={3} item xs={8} md={8} lg={9}>
                            <Grid item xs={12} md={12} lg={12}>
                                <Paper style={{height: 240}}>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <Paper>
                                    <ValuesTable
                                        counterValues={this.state.counterValues}
                                        counters={this.state.counters}
                                        rates={this.state.rates}
                                        types={this.state.counterTypes}
                                    />
                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid item xs={4} md={4} lg={3}>
                            <Paper>
                                <FilterGroup
                                    label={"Адреса"}
                                    items={this.state.addresses.map(address => { return {
                                        label: address.address
                                    }})}
                                    selectedIndexes={this.state.selectedAddressIndexes}
                                    onSelected={async (index) => {
                                        let selectedAddressIndexes = [...this.state.selectedAddressIndexes];
                                        selectedAddressIndexes.push(index);
                                        this.setState({
                                            selectedAddressIndexes: selectedAddressIndexes
                                        });
                                        await this.applyFilters(selectedAddressIndexes,
                                            this.state.selectedCounterTypeIndexes,
                                            this.state.selectedCounterIndexes);
                                    }}
                                    onUnSelected={async (index) => {
                                        let selectedAddressIndexes = [...this.state.selectedAddressIndexes];
                                        const indexToRemove = selectedAddressIndexes.indexOf(index);
                                        selectedAddressIndexes.splice(indexToRemove, 1);
                                        this.setState({
                                            selectedAddressIndexes: selectedAddressIndexes
                                        });
                                        await this.applyFilters(selectedAddressIndexes,
                                            this.state.selectedCounterTypeIndexes,
                                            this.state.selectedCounterIndexes);
                                    }}
                                />
                                <FilterGroup/>
                                <FilterGroup
                                    defaultChecked
                                    label={"Тип Счетчика"}
                                    items={this.state.counterTypes.map(counterTypes => { return {
                                        label: counterTypes.name
                                    }})}
                                    selectedIndexes={this.state.selectedCounterTypeIndexes}
                                    onSelected={async (index) => {
                                        let selectedCounterTypeIndexes = [...this.state.selectedCounterTypeIndexes];
                                        selectedCounterTypeIndexes.push(index);
                                        this.setState({
                                            selectedCounterTypeIndexes: selectedCounterTypeIndexes
                                        });
                                        await this.applyFilters(
                                            this.state.selectedAddressIndexes,
                                            selectedCounterTypeIndexes,
                                            this.state.selectedCounterIndexes);
                                    }}
                                    onUnSelected={async (index) => {
                                        let selectedCounterTypeIndexes = [...this.state.selectedCounterTypeIndexes];
                                        const indexToRemove = selectedCounterTypeIndexes.indexOf(index);
                                        selectedCounterTypeIndexes.splice(indexToRemove, 1);
                                        this.setState({
                                            selectedCounterTypeIndexes: selectedCounterTypeIndexes
                                        });
                                        await this.applyFilters(
                                            this.state.selectedAddressIndexes,
                                            selectedCounterTypeIndexes,
                                            this.state.selectedCounterIndexes);
                                    }}
                                />
                                <FilterGroup/>
                                <FilterGroup
                                    defaultChecked
                                    label={"Номер Счетчика"}
                                    items={this.state.counters.map(counters => { return {
                                        label: counters.name
                                    }})}
                                    selectedIndexes={this.state.selectedCounterIndexes}
                                    onSelected={async (index)=> {
                                        let selectedCounterIndexes = [...this.state.selectedCounterIndexes];
                                        selectedCounterIndexes.push(index);
                                        this.setState({
                                            selectedCounterIndexes: selectedCounterIndexes
                                        });
                                        await this.applyFilters(
                                            this.state.selectedAddressIndexes,
                                            this.state.selectedCounterTypeIndexes,
                                            selectedCounterIndexes
                                        );
                                    }}
                                    onUnSelected={async (index)=> {
                                        let selectedCounterIndexes = [...this.state.selectedCounterIndexes];
                                        const indexToRemove = selectedCounterIndexes.indexOf(index);
                                        selectedCounterIndexes.splice(indexToRemove, 1);
                                        this.setState({
                                            selectedCounterIndexes: selectedCounterIndexes
                                        });
                                        await this.applyFilters(
                                            this.state.selectedAddressIndexes,
                                            this.state.selectedCounterTypeIndexes,
                                            selectedCounterIndexes
                                        );
                                    }}
                                />
                                <FilterGroup/>
                            </Paper>
                        </Grid>
                        {/* Recent Orders */}
                    </Grid>
                </Container>
            </Layout>
        );
    }
}


export default authGuard(Dashboard);

