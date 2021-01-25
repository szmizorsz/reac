import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import PaymentIcon from '@material-ui/icons/Payment';
import Tooltip from '@material-ui/core/Tooltip';
import PaymentSimulationDialog from './PaymentSimulationDialog'
import SellingContractWithdrawalDialog from './SellingContractWithdrawalDialog'
import SellingContractConfirmationDialog from './SellingContractConfirmationDialog'
import TokenTransferDialog from './TokenTransferDialog'

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
}));

function RealEstateSellingContracts({
    realEstateSellingContracts,
    loadRealEstateSellingContracts,
    setSellingContractRegistrationDisabled
}) {
    const classes = useStyles();

    const [paymentSimulationDialogOpen, setPaymentSimulationDialogOpen] = React.useState(false);
    const [tokenTransferDialogOpen, setTokenTransferDialogOpen] = React.useState(false);
    const [withdrawalDialogOpen, setWithdrawalDialogOpen] = React.useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = React.useState(false);
    const [contractForDialog, setContractForDialog] = React.useState('');

    const handleOpenPaymentSimulationDialog = (contract) => {
        setPaymentSimulationDialogOpen(true);
        setContractForDialog(contract);
    };

    const handleClosePaymentSimulationDialog = () => {
        setPaymentSimulationDialogOpen(false);
    };

    const handleOpenTokenTransferDialog = (contract) => {
        setTokenTransferDialogOpen(true);
        setContractForDialog(contract);
    };

    const handleCloseTokenTransferDialog = () => {
        setTokenTransferDialogOpen(false);
    };
    const handleOpenWithdrawalDialog = (contract) => {
        setWithdrawalDialogOpen(true);
        setContractForDialog(contract);
    };

    const handleCloseWithdrawalDialog = () => {
        setWithdrawalDialogOpen(false);
    };

    const handleOpenConfirmationDialog = (contract) => {
        setConfirmationDialogOpen(true);
        setContractForDialog(contract);
    };

    const handleCloseConfirmationDialog = () => {
        setConfirmationDialogOpen(false);
    };

    const confirmationIconDisplay = (row) => {
        let confirmationIcon;
        if (row._state === 'Registered') {
            confirmationIcon = <Tooltip title="Confirm">
                <IconButton aria-label="confirm" onClick={() => { handleOpenConfirmationDialog(row.contract) }}>
                    <CheckCircleIcon />
                </IconButton>
            </Tooltip>;
        }
        return confirmationIcon;
    }

    const withdrawalIconDisplay = (row) => {
        let withdrawIcon;
        if (row._state === 'Registered' || (row._state === 'Confirmed' && parseInt(row._paid) === 0)) {
            withdrawIcon = <Tooltip title="Withdraw">
                <IconButton aria-label="delete" onClick={() => { handleOpenWithdrawalDialog(row.contract) }}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>;
        }
        return withdrawIcon;
    }

    const paymentSimulationIconDisplay = (row) => {
        let paymentSimulationIcon;
        if (row._state === 'Confirmed') {
            paymentSimulationIcon = <Tooltip title="Receive payment">
                <IconButton aria-label="payment" onClick={() => handleOpenPaymentSimulationDialog(row.contract)}>
                    <PaymentIcon />
                </IconButton>
            </Tooltip>;
        }
        return paymentSimulationIcon;
    }

    const tableDisplay = () => {
        let table;
        if (realEstateSellingContracts.length > 0) {
            table = <TableContainer className={classes.table} component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Actions</TableCell>
                            <TableCell>State</TableCell>
                            <TableCell>Actors</TableCell>
                            <TableCell>Price (ETH)</TableCell>
                            <TableCell>Paid (ETH)</TableCell>
                            <TableCell>Due date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {realEstateSellingContracts.map((row) => (
                            <TableRow key={row._dueDate}>
                                <TableCell>
                                    {confirmationIconDisplay(row)}
                                    {withdrawalIconDisplay(row)}
                                    {paymentSimulationIconDisplay(row)}
                                </TableCell>
                                <TableCell>{row._state}</TableCell>
                                <TableCell>{"Seller: " + row._seller}<br />{"Buyer: " + row._buyer}</TableCell>
                                <TableCell>{row._price}</TableCell>
                                <TableCell>{row._paid}</TableCell>
                                <TableCell>{row._dueDate}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>;
        }
        return table;
    }

    return (
        <>
            {tableDisplay()}
            <PaymentSimulationDialog
                open={paymentSimulationDialogOpen}
                handleClose={handleClosePaymentSimulationDialog}
                contract={contractForDialog}
                handleOpenTokenTransferDialog={handleOpenTokenTransferDialog}
                loadRealEstateSellingContracts={loadRealEstateSellingContracts} />
            <SellingContractWithdrawalDialog
                open={withdrawalDialogOpen}
                handleClose={handleCloseWithdrawalDialog}
                contract={contractForDialog}
                loadRealEstateSellingContracts={loadRealEstateSellingContracts}
                setSellingContractRegistrationDisabled={setSellingContractRegistrationDisabled} />
            <SellingContractConfirmationDialog
                open={confirmationDialogOpen}
                handleClose={handleCloseConfirmationDialog}
                contract={contractForDialog}
                loadRealEstateSellingContracts={loadRealEstateSellingContracts} />
            <TokenTransferDialog
                open={tokenTransferDialogOpen}
                handleClose={handleCloseTokenTransferDialog}
                contract={contractForDialog}
                loadRealEstateSellingContracts={loadRealEstateSellingContracts} />
        </>
    );
}

export default RealEstateSellingContracts;
