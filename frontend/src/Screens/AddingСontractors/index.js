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
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import NativeSelect from "@material-ui/core/NativeSelect";

class Adding extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            counterTypes: [],
            submitError: false
        }
    }

    async handleChange(event) {
        const selectedId = event.target.value;
        for (const counterType of this.counterTypes.id) {
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

    // submit = async () => {
    //     try {
    //         const counterValues = this.state.currentValues.filter(currentValue => currentValue.value);
    //         console.log(counterValues);
    //         await sendCounterValues(counterValues);
    //         window.location.reload(false);
    //     } catch (e) {
    //         this.setState({submitError: true});
    //         setTimeout(() => {
    //             this.setState({submitError: false});
    //         }, 3000);
    //     }
    // };

    render() {
        if (this.state.loading) {
            return <Container>
                <CircularProgress/>
            </Container>;
        } else {
            return (
                <Layout label={'Добавить'}>
                    <form>
                        <FormControl variant="outlined">
                            <TextField
                                id="outlined-password-input"
                                label="Добавить адрес"
                                type="password"
                                autoComplete="current-password"
                                variant="outlined"
                            />
                            <Button variant="contained" color="primary" type={"submit"}>
                                Сохранить показания
                            </Button>
                        </FormControl>
                        <Select
                            className={"addressSelect"}
                            label="Адрес"
                            // fullWidth={true}
                            value={this.state.counterTypes.id}
                            onChange={event => this.handleChange(event)}
                        >
                            {this.state.counterTypes.map(counterType => {
                                return <MenuItem key={counterType.id} value={counterType.id}>{counterType.name}</MenuItem>
                            })}
                        </Select>
                        <TextField
                            disabled
                            id="outlined-password-input"
                            label="Добавить счетчик"
                            type="password"
                            autoComplete="current-password"
                            variant="outlined"
                        />
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

export default authGuard(Adding);