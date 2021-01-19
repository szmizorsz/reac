import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, TextField } from '@material-ui/core/';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Grid from '@material-ui/core/Grid';
import { Link } from "react-router-dom";
import { Button } from '@material-ui/core/'
import MortgageApprovalDialog from './MortgageApprovalDialog'
import MortgageRejectionDialog from './MortgageRejectionDialog'
import MortgageRepaymentDialog from './MortgageRepaymentDialog'

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

function Row({ row, loadMortgages, loadLiquidityPoolData }) {
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();
    const [mortgageApprovalDialogOpen, setMortgageApprovalDialogOpen] = React.useState(false);
    const [mortgageRejectionDialogOpen, setMortgageRejectionDialogOpen] = React.useState(false);
    const [mortgageRepaymentDialogOpen, setMortgageRepaymentDialogOpen] = React.useState(false);
    const [contractForDialog, setContractForDialog] = React.useState('');

    const handleOpenApprovalDialog = (contract) => {
        setMortgageApprovalDialogOpen(true);
        setContractForDialog(contract);
    };

    const handleOpenRejectionDialog = (contract) => {
        setMortgageRejectionDialogOpen(true);
        setContractForDialog(contract);
    };

    const handleOpenRepaymentDialog = (contract) => {
        setMortgageRepaymentDialogOpen(true);
        setContractForDialog(contract);
    };

    const handleCloseMortgageApprovalDialog = () => {
        setMortgageApprovalDialogOpen(false);
    };

    const handleCloseMortgageRejectionDialog = () => {
        setMortgageRejectionDialogOpen(false);
    };

    const handleCloseMortgageRepaymentDialog = () => {
        setMortgageRepaymentDialogOpen(false);
    };

    const approveButtonDisplay = () => {
        let approveButton;
        if (row._state === 'Requested') {
            approveButton =
                <Button
                    onClick={() => { handleOpenApprovalDialog(row.contract) }}
                    variant="outlined"
                    color="primary"
                    type="submit">
                    Approve
                </Button>;
        }
        return approveButton;
    }

    const rejectButtonDisplay = () => {
        let rejectButton;
        if (row._state === 'Requested') {
            rejectButton =
                <Button
                    onClick={() => { handleOpenRejectionDialog(row.contract) }}
                    variant="outlined"
                    color="primary"
                    type="submit">
                    Reject
                </Button>;
        }
        return rejectButton;
    }

    const repayButtonDisplay = () => {
        let repayButton;
        if (row._state === 'Approved') {
            repayButton =
                <Button
                    onClick={() => { handleOpenRepaymentDialog(row.contract) }}
                    variant="outlined"
                    color="primary"
                    type="submit">
                    Repay
                </Button>;
        }
        return repayButton;
    }

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Link to={`/realestate/${row._realEstateId}`}>{row._realEstateId}</Link>
                </TableCell>
                <TableCell align="right">{row._borrowedAmount}</TableCell>
                <TableCell align="right">{row._interest}</TableCell>
                <TableCell align="right">{row._repaidAmount}</TableCell>
                <TableCell align="right">{row._state}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Grid container className={classes.root}>
                                <Grid md={2}></Grid>
                                <Grid item xs={12} md={10}>
                                    <TextField InputProps={{ disableUnderline: true }} label="Mortgage id" value={row._mortgageId || ''} margin="dense" />
                                </Grid>
                                <Grid md={2}></Grid>
                                <Grid item xs={12} md={10}>
                                    <TextField InputProps={{ disableUnderline: true }} label="Owner" value={row._realEstateOwner || ''} fullWidth margin="dense" />
                                </Grid>
                                <Grid md={2}></Grid>
                                <Grid item xs={12} md={10}>
                                    <TextField InputProps={{ disableUnderline: true }} label="Requested amount (ETH)" value={row._requestedAmount || ''} fullWidth margin="dense" />
                                </Grid>
                                <Grid md={2}></Grid>
                                <Grid item xs={12} md={10}>
                                    <TextField InputProps={{ disableUnderline: true }} label="Interest rate" value={row._interestRate || ''} fullWidth margin="dense" />
                                </Grid>
                                <Grid md={2}></Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField InputProps={{ disableUnderline: true }} label="Due date" value={row._dueDate || ''} fullWidth margin="dense" />
                                </Grid>
                                <Grid md={2}>
                                    {rejectButtonDisplay()}
                                </Grid>
                                <Grid md={2}>
                                    {approveButtonDisplay()}
                                    {repayButtonDisplay()}
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            <MortgageApprovalDialog
                open={mortgageApprovalDialogOpen}
                handleClose={handleCloseMortgageApprovalDialog}
                mortgageContract={contractForDialog}
                loadMortgages={loadMortgages}
                loadLiquidityPoolData={loadLiquidityPoolData} />
            <MortgageRejectionDialog
                open={mortgageRejectionDialogOpen}
                handleClose={handleCloseMortgageRejectionDialog}
                mortgageContract={contractForDialog}
                loadMortgages={loadMortgages} />
            <MortgageRepaymentDialog
                open={mortgageRepaymentDialogOpen}
                handleClose={handleCloseMortgageRepaymentDialog}
                mortgageContract={contractForDialog}
                loadMortgages={loadMortgages}
                loadLiquidityPoolData={loadLiquidityPoolData} />
        </React.Fragment>
    );
}

export default function Mortgages({ mortgages, loadMortgages, loadLiquidityPoolData }) {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell><Box fontWeight="fontWeightBold">Mortgages</Box></TableCell>
                    </TableRow>
                </TableHead>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Real estate</TableCell>
                        <TableCell align="right">Borrowed (ETH)</TableCell>
                        <TableCell align="right">Interest (ETH)</TableCell>
                        <TableCell align="right">Repaid (ETH)</TableCell>
                        <TableCell align="right">State</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {mortgages.map((row) => (
                        <Row
                            key={row._mortgageId}
                            row={row}
                            loadMortgages={loadMortgages}
                            loadLiquidityPoolData={loadLiquidityPoolData} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
