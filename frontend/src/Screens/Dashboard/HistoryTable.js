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
import FormGroup from "@material-ui/core/FormGroup";
import moment from "moment";
import TablePagination from "@material-ui/core/TablePagination";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import TableFooter from "@material-ui/core/TableFooter";

class HistoryTable extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Номер счетчика</TableCell>
                            <TableCell align="right">Тип счетчика</TableCell>
                            <TableCell align="right">Дата подачи</TableCell>
                            <TableCell align="right">Показания</TableCell>
                            <TableCell align="right">Тариф</TableCell>
                            <TableCell align="right">Сумма</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.history.map((entry, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell component="th"
                                               scope="row">{entry.counter_name}
                                    </TableCell>
                                    <TableCell align="right">{entry.counter_type}</TableCell>
                                    <TableCell align="right">{moment(entry.registry_time).format('L')}</TableCell>
                                    <TableCell align="right">{Math.round(entry.value)}</TableCell>
                                    <TableCell align="right">{entry.rate || 0}</TableCell>
                                    <TableCell align="right">{Math.round(entry.value) * (entry.rate || 0)}</TableCell>
                                </TableRow>)
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
}
export default authGuard(HistoryTable);
