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

function MortgageApprovalDialog({ open, handleClose, mortgageContract, loadMortgages, loadLiquidityPoolData }) {
    const web3 = new Web3(Web3.givenProvider);
    const [amount, setAmount] = React.useState('');
    const [dueDate, setDueDate] = React.useState('');

    const handleMortgageApproval = async () => {
        const accounts = await web3.eth.getAccounts();
        const weiAmount = Web3.utils.toWei(amount.toString(), 'ether');
        let config = {
            gas: GAS_LIMIT,
            from: accounts[0]
        }
        await mortgageContract.methods.approve(weiAmount, dueDate).send(config);
        handleClose();
        loadMortgages();
        loadLiquidityPoolData();
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" disableBackdropClick>
                <DialogTitle id="form-dialog-title">Mortgage approval</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please, specify the due date and the approved amount (ETH)!
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
                    <Button onClick={handleClose} color="primary">
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
