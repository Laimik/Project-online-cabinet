import React, {Component} from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Layout from "../../Layout";
import {getAddresses, postAddress} from "../../../Services/addressService";
import {getCounters, postCounter, sendCounterValues} from "../../../Services/counterService";
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
import style from "./style.css"

class AddACounter extends Component {
    constructor(props) {
        super(props)
        const query = new URLSearchParams(this.props.location.search);

        this.state = {
            loading: true,
            counterTypes: [],
            addresses: [],
            name: "",
            counterType: undefined,
            address_id: Number(query.get('address_id'))
        }

        console.log(this.state)
    }

    async handleChange(event) {
        const selectedId = event.target.value;
        for (const counterType of this.state.counterTypes) {
            if (selectedId === counterType.id) {
                this.setState({
                    counterType: counterType,
                })
            }
        }
    }

    async componentDidMount() {
        const counterTypes = await getCounterTypes();

        this.setState({
            loading: false,
            counterTypes: counterTypes
        });
    }

    submit = async () => {
        try {
            await postCounter( this.state.name, this.state.counterType.id, this.state.address_id);
            window.location.href = '/profile';
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
                <Layout label={'Добавить Счетчик'}>
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        await this.submit();
                    }}
                          className={'counterForm'}
                    >
                        <FormControl variant="outlined">
                            <Select
                                className={'counterTypeSelect'}
                                label="Адрес"
                                // fullWidth={true}
                                value={this.state.counterTypes.id}
                                onChange={event => this.handleChange(event)}
                            >
                                <MenuItem value="">
                                </MenuItem>
                                {this.state.counterTypes.map(counterTypes => {
                                    return <MenuItem key={counterTypes.id} value={counterTypes.id}>{counterTypes.name}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <TextField
                                className={'counterName'}
                                id="outlined-password-input"
                                label="Название счетчика"
                                variant="outlined"
                                onChange={(e) => {
                                    this.setState({name: e.target.value})
                                }}
                            />
                        </FormControl>
                        <Button variant="contained" color="primary" type={"submit"} className={'counterButtom'}>
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