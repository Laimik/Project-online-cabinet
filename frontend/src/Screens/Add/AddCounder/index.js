import React, {Component} from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Layout from "../../Layout";
import {getAddresses, postAddress} from "../../../Services/addressService";
import {getCounters, sendCounterValues} from "../../../Services/counterService";
import {getCounterTypes} from "../../../Services/counterTypeService";
import {getCounterValues} from "../../../Services/counterValueService";
import authGuard from "../../../Components/AuthGuard";
import MenuItem from "@material-ui/core/MenuItem";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import {getCurrentRates} from "../../../Services/rateService";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import NativeSelect from "@material-ui/core/NativeSelect";

class AddACounter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            counterTypes: [],
            addresses: [],
            name: ""
        }
    }

    submit = async () => {
        try {
            await postAddress( this.state.address, this.state.apartment, this.state.fiasCode);
            // window.location.reload(false);
        } catch (e) {
            this.setState({submitError: true});
            setTimeout(() => {
                this.setState({submitError: false});
            }, 3000);
        }
    };

    render() {
        if (this.state.loading) {
            return <Container>
                <CircularProgress/>
            </Container>;
        } else {
            return (
                <Layout label={'Добавить адрес'}>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        await this.submit();
                    }}
                    >
                        <FormControl variant="outlined">
                            <TextField
                                id="outlined-password-input"
                                label="Адрес"
                                variant="outlined"
                                onChange={(e) => {
                                    this.setState({address: e.target.value})
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                id="outlined-password-input"
                                label="Квартира"
                                variant="outlined"
                                onChange={(e) => {
                                    this.setState({apartment: e.target.value})
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <TextField
                                id="outlined-password-input"
                                label="Фиас код"
                                variant="outlined"
                                onChange={(e) => {
                                    this.setState({fiasCode: e.target.value})
                                }}
                            />
                        </FormControl>
                        <Button variant="contained" color="primary" type={"submit"}>
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

export default authGuard(AddACounter);