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
import moment from "moment";
import TablePagination from "@material-ui/core/TablePagination";

class HistoryTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 5
        }
    }


    handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage
        });
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({
            page: 0,
            rowsPerPage: parseInt(event.target.value)
        });
    };

    render()
    {
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
                        {this.props.history.filter((entry, index) =>
                            index >= this.state.page * this.state.rowsPerPage &&
                            index < (this.state.page + 1) * this.state.rowsPerPage
                        ).map((entry, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell component="th"
                                               scope="row">{entry.counter_name}
                                    </TableCell>
                                    <TableCell align="right">{entry.counter_type}</TableCell>
                                    <TableCell align="right">{moment(entry.registry_time).format('L')}</TableCell>
                                    <TableCell align="right">{Math.round(entry.value)}</TableCell>
                                    <TableCell align="right">{Math.round(entry.rate * 100 || 0)/100}</TableCell>
                                    <TableCell align="right">{Math.round(entry.summ * 100 || 0)/100}</TableCell>
                                </TableRow>)
                        })}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={this.props.history.length}
                    rowsPerPage={this.state.rowsPerPage}
                    page={this.state.page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    labelRowsPerPage={'Строк на странице:'}
                />
            </TableContainer>
        );
    }
}
export default authGuard(HistoryTable);
