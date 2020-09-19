import React, {Component} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import authGuard from "../../Components/AuthGuard";
import {getAddresses} from "../../Services/addressService";
import {getCounters} from "../../Services/counterService";
import {getCounterTypes} from "../../Services/counterTypeService";
import {getCurrentRates} from "../../Services/rateService";
import {getCounterValues} from "../../Services/counterValueService";

class SimpleTable extends Component{
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Номер счетчика</TableCell>
                            <TableCell align="right">Дата показания</TableCell>
                            <TableCell align="right">Показание</TableCell>
                            <TableCell align="right">Тариф</TableCell>
                            <TableCell align="right">Оплата</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                            <TableRow >
                                <TableCell component="th" scope="row">{}
                                </TableCell>
                                <TableCell align="right">{}</TableCell>
                                <TableCell align="right">{}</TableCell>
                                <TableCell align="right">{}</TableCell>
                                <TableCell align="right">{}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}
export default authGuard(SimpleTable);
