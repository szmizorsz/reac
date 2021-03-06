import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
}));

function MortgagesOnRealEstateDetail({ mortgages }) {
    const classes = useStyles();

    const tableDisplay = (mortgages) => {
        let table;
        if (mortgages.length > 0) {
            table =
                <TableContainer className={classes.table} component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>State</TableCell>
                                <TableCell>Borrower</TableCell>
                                <TableCell>Borrowed (ETH)</TableCell>
                                <TableCell>Interest Rate</TableCell>
                                <TableCell>Interest (ETH)</TableCell>
                                <TableCell>Total (ETH)</TableCell>
                                <TableCell>Requested (ETH)</TableCell>
                                <TableCell>Repaid (ETH)</TableCell>
                                <TableCell>Due Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mortgages.map((row) => (
                                <TableRow key={row._mortgageId}>
                                    <TableCell>{row._state}</TableCell>
                                    <TableCell>{row._realEstateOwner}</TableCell>
                                    <TableCell>{row._borrowedAmount}</TableCell>
                                    <TableCell>{row._interestRate}</TableCell>
                                    <TableCell>{row._interest}</TableCell>
                                    <TableCell>{row._total}</TableCell>
                                    <TableCell>{row._requestedAmount}</TableCell>
                                    <TableCell>{row._repaidAmount}</TableCell>
                                    <TableCell>{row._dueDate}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>;
        } else {
            table =
                <Box ml={10}>
                    <Typography variant="body2" color="textSecondary" component="p">
                        There is no mortgage for this real estate
                </Typography>
                </Box>;
        }
        return table;
    }

    return (
        <Box mt={2}>
            {tableDisplay(mortgages)}
        </Box>
    );
}

export default MortgagesOnRealEstateDetail;
