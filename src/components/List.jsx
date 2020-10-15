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

export default function List({ realEstates }) {
    const classes = useStyles();

    return (
        <Box mt={2}>
            <TableContainer className={classes.table} component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                            <TableRow>
                                <TableCell>Address</TableCell>
                                <TableCell>City</TableCell>
                                <TableCell>Country</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Proprietor</TableCell>
                                <TableCell>External Id</TableCell>
                            </TableRow>
                    </TableHead>
                    <TableBody>
                        {realEstates.map((row) => (
                            <TableRow key={row.externalId}>
                                <TableCell>{row.addressLine}</TableCell>
                                <TableCell>{row.city}</TableCell>
                                <TableCell>{row.country}</TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>{row.proprietor}</TableCell>
                                <TableCell>{row.externalId}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

