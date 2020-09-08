import React, {Component} from "react";
import {Redirect} from "react-router";
import SignIn from "../SignIn";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import withStyles from "@material-ui/core/styles/withStyles";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Layout from "../Layout";

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

class Gas extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            addresses: [],
            counter: [],
            counterType: [],
            expandedAddresses: []
        }
    }

    render() {
        if (this.state.signedIn) {
            return <Redirect to={'/'}/>
        } else {
            return (
                <Layout label={'Газ'}>
                <form>
                <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-age-native-simple">Age</InputLabel>
                    <Select
                        native
                        label="Age"
                        inputProps={{
                            name: 'age',
                            id: 'outlined-age-native-simple',
                        }}
                    >
                        <option aria-label="None" value="" />
                        <option value={10}>Ten</option>
                        <option value={20}>Twenty</option>
                        <option value={30}>Thirty</option>
                    </Select>
                </FormControl>
            <div>
                <TextField
                    label="Size"
                    id="outlined-size-small"
                    defaultValue="Small"
                    variant="outlined"
                    size="small"
                />
            </div>
                    <Button variant="contained" color="primary">
                        Primary
                    </Button>
                    <TableContainer component={Paper}>
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Dessert (100g serving)</StyledTableCell>
                                    <StyledTableCell align="right">Calories</StyledTableCell>
                                    <StyledTableCell align="right">Fat&nbsp;(g)</StyledTableCell>
                                    <StyledTableCell align="right">Carbs&nbsp;(g)</StyledTableCell>
                                    <StyledTableCell align="right">Protein&nbsp;(g)</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <StyledTableRow key={row.name}>
                                        <StyledTableCell component="th" scope="row">
                                            {row.name}
                                        </StyledTableCell>
                                        <StyledTableCell align="right">{row.calories}</StyledTableCell>
                                        <StyledTableCell align="right">{row.fat}</StyledTableCell>
                                        <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                                        <StyledTableCell align="right">{row.protein}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </form>
                </Layout>
            )
        }
    }
}

export default Gas;