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

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
}));

function RealEstateSellingContracts({ realEstateSellingContracts }) {
    const classes = useStyles();

    let table;
    if (realEstateSellingContracts.length > 0) {
        table = <TableContainer className={classes.table} component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>State</TableCell>
                        <TableCell>Seller</TableCell>
                        <TableCell>Buyer</TableCell>
                        <TableCell>Price (ETH)</TableCell>
                        <TableCell>Paid (ETH)</TableCell>
                        <TableCell>Due date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {realEstateSellingContracts.map((row) => (
                        <TableRow key={row._dueDate}>
                            <TableCell>{row._state}</TableCell>
                            <TableCell>{row._seller}</TableCell>
                            <TableCell>{row._buyer}</TableCell>
                            <TableCell>{row._price}</TableCell>
                            <TableCell>{row._paid}</TableCell>
                            <TableCell>{row._dueDate}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>;
    }

    return (
        <Box mt={2}>
            {table}
        </Box>
    );
}

export default RealEstateSellingContracts;
