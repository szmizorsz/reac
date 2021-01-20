import React from 'react'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    table: {
        backgroundd: '#f3eded',
    },
}));

const MortgageLiquidityProviders = ({ liquidityProvders }) => {
    const classes = useStyles();

    return (
        <>
            <TableContainer className={classes.table} component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell><Box fontWeight="fontWeightBold">Liquidity Providers</Box></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableHead>
                        <TableRow>
                            <TableCell>Provider</TableCell>
                            <TableCell>Capital (ETH)</TableCell>
                            <TableCell>Collected Interest(ETH)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {liquidityProvders.map((row) => (
                            <TableRow key={row._provider}>
                                <TableCell>{row._provider}</TableCell>
                                <TableCell>{row._capital}</TableCell>
                                <TableCell>{row._collectedInterest}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>

    );
}

export default MortgageLiquidityProviders;