import React, {Component} from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import authGuard from "../../Components/AuthGuard";
import Layout from "../Layout/index";
import FilterGroup from "./FilterGroup";
import HistoryTable from "./HistoryTable";
import {getAddresses} from "../../Services/addressService";
import {getCounters} from "../../Services/counterService";
import {getCounterTypes} from "../../Services/counterTypeService";
import {CardHeader, Padding} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import {getDynamic, getHistory} from "../../Services/statsService";
import Chart from "./Chart";
import CircularProgress from "@material-ui/core/CircularProgress";


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
            history: [],
            chartData: []
        }
    }

    async componentDidMount() {
        const addresses = await getAddresses();
        const counters = await getCounters();
        const counterTypes = await getCounterTypes();
        const history = await getHistory();
        const chartData = await getDynamic();

        this.setState({
            loading: false,
            addresses: addresses,
            counters: counters,
            counterTypes: counterTypes,
            history: history,
            chartData: chartData
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

        const history = await getHistory(options);
        const chartData = await getDynamic(options);
        this.setState({
            loading: false,
            history: history,
            chartData: chartData
        });
    }

    render() {
        if (this.state.loading) {
            return <Layout>
                <Container>
                    <CircularProgress className={'circleLoading'}/>
                </Container>
            </Layout>
        } else {
            return (
                <Layout label={'Дашборд'}>
                    <Container maxWidth="lg">
                        <Grid container spacing={3}>
                            <Grid container spacing={2} item xs={8} md={8} lg={8}>
                                <Grid item xs={12} md={12} lg={12}>
                                    <Card style={{Height: 240}}>
                                        <CardContent>
                                            <Chart
                                                chartData={this.state.chartData}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12}>
                                    <Card>
                                        <CardContent>
                                            <HistoryTable
                                                history={this.state.history}
                                                chartData={this.state.chartData}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} md={4} lg={3}>
                                <Card>
                                    <CardHeader title={"Фильтры"}/>
                                    <CardContent>
                                        <FilterGroup
                                            label={"Адреса"}
                                            items={this.state.addresses.map(address => {
                                                return {
                                                    label: address.address
                                                }
                                            })}
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
                                            items={this.state.counterTypes.map(counterTypes => {
                                                return {
                                                    label: counterTypes.name
                                                }
                                            })}
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
                                            items={this.state.counters.map(counters => {
                                                return {
                                                    label: counters.name
                                                }
                                            })}
                                            selectedIndexes={this.state.selectedCounterIndexes}
                                            onSelected={async (index) => {
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
                                            onUnSelected={async (index) => {
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
                                    </CardContent>
                                </Card>
                            </Grid>
                            {/* Recent Orders */}
                        </Grid>
                    </Container>
                </Layout>
            );
        }
    }
}


export default authGuard(Dashboard);

