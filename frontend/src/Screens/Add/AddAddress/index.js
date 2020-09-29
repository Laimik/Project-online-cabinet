import React, {Component} from "react";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Layout from "../../Layout";
import {postAddress, searchAddresses} from "../../../Services/addressService";
import authGuard from "../../../Components/AuthGuard";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import Autocomplete from "@material-ui/lab/Autocomplete";
import style from "./style.css"

class AddAddress extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            address: "",
            apartment: "",
            region: undefined,
            regionSuggestions: [],
            area: undefined,
            areaSuggestions: [],
            city: undefined,
            citySuggestions: [],
            settlement: undefined,
            settlementSuggestions: [],
            street: undefined,
            streetSuggestions: [],
            house: undefined,
            houseSuggestions: []
        }
    }

    submit = async () => {
        try {
            await postAddress(this.state.house.unrestricted_value,
                this.state.apartment,
                this.state.house.data.house_fias_id || this.state.street.data.street_fias_id);
            window.location.href = '/profile';
           } catch (e) {
            this.setState({submitError: true});
            setTimeout(() => {
                this.setState({submitError: false});
            }, 3000);
        }
    };

    searchAddress = async (options) =>{
        const suggestions = await searchAddresses(options);
        switch (options.detalization){
            case 'region': {
                this.setState({regionSuggestions: suggestions})
                break;
            }
            case 'area': {
                this.setState({areaSuggestions: suggestions})
                break;
            }
            case 'city': {
                this.setState({citySuggestions: suggestions})
                break;
            }
            case 'settlement': {
                this.setState({settlementSuggestions: suggestions})
                break;
            }
            case 'street': {
                this.setState({streetSuggestions: suggestions})
                break;
            }
            case 'house': {
                this.setState({houseSuggestions: suggestions})
                break;
            }
        }
    }

    render() {
        if (this.state.loading) {
            return <Container>
                <CircularProgress className={'circleLoading'}/>
            </Container>;
        } else {
            return (
                <Layout label={'Добавить адрес'}>
                    <form className={'addressForm'}
                        onSubmit={async (e) => {
                        e.preventDefault();
                        await this.submit();
                    }}
                        >
                        <FormControl variant="outlined">
                            <Autocomplete
                                id="combo-box-demo"
                                options={this.state.regionSuggestions}
                                getOptionLabel={(option) => option.value}
                                style={{ width: 300 }}
                                onChange={(object, value, reason) => {
                                    this.setState({
                                        region: value
                                    })
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required={true}
                                        label="Регион"
                                        margin="normal"
                                        variant="outlined"
                                        InputProps={{ ...params.InputProps }}
                                        onChange={ async (e) => {
                                            await this.searchAddress({
                                                criteria: e.target.value,
                                                detalization: 'region'
                                            })
                                        }}
                                    />
                                )}
                            />
                        </FormControl>
                        <FormControl>
                            <Autocomplete
                                id="combo-box-demo"
                                options={this.state.areaSuggestions}
                                getOptionLabel={(option) => option.value}
                                style={{ width: 300 }}
                                disabled={!this.state.region}
                                onChange={(object, value, reason) => {
                                    this.setState({
                                        area: value
                                    })
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Район"
                                        margin="normal"
                                        variant="outlined"
                                        InputProps={{ ...params.InputProps }}
                                        onChange={ async (e) => {
                                            const region_fias_id = this.state.region.data.region_fias_id;
                                            await this.searchAddress({
                                                criteria: e.target.value,
                                                detalization: 'area',
                                                region_fias_id: region_fias_id
                                            })
                                        }}
                                    />
                                )}
                            />
                        </FormControl>
                        <FormControl>
                            <Autocomplete
                                id="combo-box-demo"
                                disabled={!this.state.region}
                                options={this.state.citySuggestions}
                                getOptionLabel={(option) => option.value}
                                style={{ width: 300 }}
                                onChange={(object, value, reason) => {
                                    this.setState({
                                        city: value
                                    })
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Город"
                                        margin="normal"
                                        variant="outlined"
                                        InputProps={{ ...params.InputProps }}
                                        onChange={ async (e) => {
                                            const region_fias_id = this.state.region?.data.region_fias_id;
                                            const area_fias_id = this.state.area?.data.area_fias_id;
                                            await this.searchAddress({
                                                criteria: e.target.value,
                                                detalization: 'city',
                                                region_fias_id: region_fias_id,
                                                area_fias_id: area_fias_id
                                            })
                                        }}
                                    />
                                )}
                            />
                        </FormControl>
                        <FormControl>
                            <Autocomplete
                                id="combo-box-demo"
                                disabled={!this.state.region}
                                options={this.state.settlementSuggestions}
                                getOptionLabel={(option) => option.value}
                                style={{ width: 300 }}
                                onChange={(object, value, reason) => {
                                    this.setState({
                                        settlement: value
                                    })
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Населенный пункт"
                                        margin="normal"
                                        variant="outlined"
                                        InputProps={{ ...params.InputProps }}
                                        onChange={ async (e) => {
                                            const region_fias_id = this.state.region?.data.region_fias_id;
                                            const area_fias_id = this.state.area?.data.area_fias_id;
                                            const city_fias_id = this.state.city?.data.city_fias_id;
                                            await this.searchAddress({
                                                criteria: e.target.value,
                                                detalization: 'settlement',
                                                region_fias_id: region_fias_id,
                                                area_fias_id: area_fias_id,
                                                city_fias_id: city_fias_id
                                            })
                                        }}
                                    />
                                )}
                            />
                    </FormControl>
                        <FormControl>
                            <Autocomplete
                                id="combo-box-demo"
                                disabled={!this.state.area && !this.state.city && !this.state.settlement}
                                options={this.state.streetSuggestions}
                                getOptionLabel={(option) => option.value}
                                style={{ width: 300 }}
                                onChange={(object, value, reason) => {
                                    this.setState({
                                        street: value
                                    })
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required={true}
                                        label="Улица"
                                        margin="normal"
                                        variant="outlined"
                                        InputProps={{ ...params.InputProps }}
                                        onChange={ async (e) => {
                                            const settlement_fias_id = this.state.settlement?.data.settlement_fias_id;
                                            const city_fias_id = this.state.city?.data.city_fias_id;
                                            await this.searchAddress({
                                                criteria: e.target.value,
                                                detalization: 'street',
                                                settlement_fias_id: settlement_fias_id,
                                                city_fias_id: city_fias_id
                                            })
                                        }}
                                    />
                                )}
                            />
                        </FormControl>
                        <FormControl>
                            <Autocomplete
                                id="combo-box-demo"
                                disabled={!this.state.street}
                                options={this.state.houseSuggestions}
                                getOptionLabel={(option) => option.value}
                                style={{ width: 300 }}
                                onChange={(object, value, reason) => {
                                    this.setState({
                                        house: value
                                    })
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        required={true}
                                        label="Дом"
                                        margin="normal"
                                        variant="outlined"
                                        InputProps={{ ...params.InputProps }}
                                        onChange={ async (e) => {
                                            const settlement_fias_id = this.state.settlement?.data.settlement_fias_id;
                                            const street_fias_id = this.state.street?.data.street_fias_id;
                                            await this.searchAddress({
                                                criteria: e.target.value,
                                                detalization: 'house',
                                                street_fias_id: street_fias_id,
                                                settlement_fias_id: settlement_fias_id
                                            })
                                        }}
                                    />
                                )}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                className={'apartmentField'}
                                disabled={!this.state.house}
                                label="Квартира"
                                margin="normal"
                                variant="outlined"
                                onChange={(e) => {
                                    this.setState({apartment: e.target.value})
                                }}
                            />
                        </FormControl>
                        <Button className={'addressButtom'} variant="contained" color="primary" type={"submit"}>
                            Сохранить
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

export default authGuard(AddAddress);