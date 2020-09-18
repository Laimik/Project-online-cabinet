import React, {Component} from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import authGuard from "../../Components/AuthGuard";
import Layout from "../Layout/index";
import TableValue from "./table";
import FilterGroup from "./FilterGroup";
import SimpleTable from "./table";
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
            selectedCounterTypeIndexes: []
        }
    }

    async componentDidMount() {
        const addresses = await getAddresses();
        const counters = await getCounters();
        const counterTypes = await getCounterTypes();

        this.setState({
            loading: false,
            addresses: addresses,
            counters: counters,
            counterTypes: counterTypes,
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
                                    <SimpleTable/>
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
                                    onSelected={index => {
                                        let selectedAddressIndexes = [...this.state.selectedAddressIndexes];
                                        selectedAddressIndexes.push(index);
                                        this.setState({
                                            selectedAddressIndexes: selectedAddressIndexes
                                        })
                                    }}
                                    onUnSelected={index => {
                                        let selectedAddressIndexes = [...this.state.selectedAddressIndexes];
                                        const indexToRemove = selectedAddressIndexes.indexOf(index);
                                        selectedAddressIndexes.splice(indexToRemove, 1);
                                        this.setState({
                                            selectedAddressIndexes: selectedAddressIndexes
                                        })
                                    }}
                                />
                                <FilterGroup/>
                                <FilterGroup
                                    label={"Тип Счетчика"}
                                    items={this.state.counterTypes.map(counterTypes => { return {
                                        label: counterTypes.name
                                    }})}
                                    selectedIndexes={this.state.selectedCounterTypeIndexes}
                                    onSelected={index => {
                                        let selectedCounterTypeIndexes = [...this.state.selectedCounterTypeIndexes];
                                        selectedCounterTypeIndexes.push(index);
                                        this.setState({
                                            selectedCounterTypeIndexes: selectedCounterTypeIndexes
                                        })
                                    }}
                                    onUnSelected={index => {
                                        let selectedCounterTypeIndexes = [...this.state.selectedCounterTypeIndexes];
                                        const indexToRemove = selectedCounterTypeIndexes.indexOf(index);
                                        selectedCounterTypeIndexes.splice(indexToRemove, 1);
                                        this.setState({
                                            selectedCounterTypeIndexes: selectedCounterTypeIndexes
                                        })
                                    }}
                                />
                                <FilterGroup/>
                                <FilterGroup
                                    label={"Номер Счетчика"}
                                    items={this.state.counters.map(counters => { return {
                                        label: counters.name
                                    }})}
                                    selectedIndexes={this.state.selectedCounterIndexes}
                                    onSelected={index => {
                                        let selectedCounterIndexes = [...this.state.selectedCounterIndexes];
                                        selectedCounterIndexes.push(index);
                                        this.setState({
                                            selectedCounterIndexes: selectedCounterIndexes
                                        })
                                    }}
                                    onUnSelected={index => {
                                        let selectedCounterIndexes = [...this.state.selectedCounterIndexes];
                                        const indexToRemove = selectedCounterIndexes.indexOf(index);
                                        selectedCounterIndexes.splice(indexToRemove, 1);
                                        this.setState({
                                            selectedCounterIndexes: selectedCounterIndexes
                                        })
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

