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

class ValuesTable extends Component {
    constructor(props) {
        super(props)
    }

    getCounter(counterId) {
        return this.props.counters.find(counter => counter.id === counterId);
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
                            <TableCell align="right">Сумма</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.props.counterValues.map((counterValue, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell component="th"
                                               scope="row">{this.getCounter(counterValue.counter_id).name || ''}
                                    </TableCell>
                                    <TableCell align="right">{moment(counterValue.registry_time).format('L')}</TableCell>
                                    <TableCell align="right">{counterValue.value}</TableCell>
                                    <TableCell align="right">{}</TableCell>
                                    <TableCell align="right">{}</TableCell>
                                </TableRow>)
                        })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                count={this.props.counterValues.length}
                                page={0}
                                onChangePage={() => {}}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        );
    }
}
export default authGuard(ValuesTable);
