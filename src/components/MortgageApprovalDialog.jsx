import React from 'react';
import Button from '@material-ui/core/Button';
import { Box, TextField } from '@material-ui/core/';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { GAS_LIMIT } from '../config/settings'
import Web3 from 'web3';
import DatePicker from "react-datepicker";
import Alert from '@material-ui/lab/Alert';
import { REAC_ACCESS_CONTROL } from '../config/contracts';

function MortgageApprovalDialog({
    open,
    handleClose,
    mortgageContract,
    loadMortgages,
    loadLiquidityPoolData,
    availableCapital
}) {
    const web3 = new Web3(Web3.givenProvider);
    const [amount, setAmount] = React.useState('');
    const [dueDate, setDueDate] = React.useState('');
    const defaultDialogContentText = 'Please, specify the due date and the approved amount (ETH) that is not more than the available capital!';
    const [dialogContentText, setDialogContentText] = React.useState(defaultDialogContentText);
    const reacAccessControlContract = new web3.eth.Contract(REAC_ACCESS_CONTROL.ABI, REAC_ACCESS_CONTROL.ADDRESS);

    const handleMortgageApproval = async () => {
        setDialogContentText(defaultDialogContentText);
        if (parseFloat(amount) > parseFloat(availableCapital)) {
            setDialogContentText(<Alert severity="info">The approved amount is greater than the available capital!</Alert>);
            return;
        }

        const accounts = await web3.eth.getAccounts();
        debugger
        const mortgageApproverRole = await reacAccessControlContract.methods.getMortgageApproverRole().call();
        const isSenderMortgageAprover = await reacAccessControlContract.methods.hasRole(mortgageApproverRole, accounts[0]).call();
        if (!isSenderMortgageAprover) {
            setDialogContentText(<Alert severity="info">Only an account with mortgage approver role can approve or reject a mortgage!</Alert>);
            return;
        }

        const weiAmount = Web3.utils.toWei(amount.toString(), 'ether');
        let config = {
            gas: GAS_LIMIT,
            from: accounts[0]
        }
        await mortgageContract.methods.approve(weiAmount, dueDate).send(config);
        handleCloseWithDialogContentTextReset();
        loadMortgages();
        loadLiquidityPoolData();
    }

    const handleCloseWithDialogContentTextReset = async () => {
        setDialogContentText(defaultDialogContentText);
        handleClose();
    }

    return (
        <div>
            <Dialog open={open} onClose={handleCloseWithDialogContentTextReset} aria-labelledby="form-dialog-title" disableBackdropClick>
                <DialogTitle id="form-dialog-title">Mortgage approval</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogContentText}
                    </DialogContentText>
                    <Box mb={10} mt={2}>
                        <DatePicker
                            selected={dueDate}
                            onChange={date => setDueDate(date.getTime())}
                            placeholderText=" Due Date" />
                    </Box>
                    <Box mb={10}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="amount"
                            label="Approved amount"
                            value={amount}
                            onInput={e => setAmount(e.target.value)}
                            type="number"
                            fullWidth />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseWithDialogContentTextReset} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => { handleMortgageApproval() }} color="primary">
                        Approve
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default MortgageApprovalDialog;
