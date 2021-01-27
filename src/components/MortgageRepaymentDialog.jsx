import React from 'react';
import Button from '@material-ui/core/Button';
import { TextField } from '@material-ui/core/';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { GAS_LIMIT } from '../config/settings'
import Web3 from 'web3';
import Alert from '@material-ui/lab/Alert';

function MortgageRepaymentDialog({ open, handleClose, mortgageContract, loadMortgages, loadLiquidityPoolData, loadLiquidityProviers }) {
    const web3 = new Web3(Web3.givenProvider);
    const [amount, setAmount] = React.useState('');
    const defaultDialogContentText = 'Please, specify the amount (ETH) to be repaid!';
    const [dialogContentText, setDialogContentText] = React.useState(defaultDialogContentText);

    const handleMortgageRepayment = async () => {
        const mortgage = await mortgageContract.methods.getMortgage().call();
        const borrowedAmount = parseFloat(Web3.utils.fromWei(mortgage._borrowedAmount, 'ether'));
        const interest = parseFloat(Web3.utils.fromWei(mortgage._interest, 'ether'));
        const repaidAmount = parseFloat(Web3.utils.fromWei(mortgage._repaidAmount, 'ether'));
        if (borrowedAmount + interest < repaidAmount + parseFloat(amount)) {
            setDialogContentText(<Alert severity="info">You can not overpay the borrowed amount + interest!</Alert>);
            return;
        }

        const accounts = await web3.eth.getAccounts();
        const weiAmount = Web3.utils.toWei(amount.toString(), 'ether');
        let config = {
            gas: GAS_LIMIT,
            from: accounts[0],
            value: weiAmount
        }
        await mortgageContract.methods.repay().send(config);
        handleCloseWithDialogContentTextReset();
        loadMortgages();
        loadLiquidityPoolData();
        loadLiquidityProviers();
    }

    const handleCloseWithDialogContentTextReset = async () => {
        setDialogContentText(defaultDialogContentText);
        handleClose();
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" disableBackdropClick>
                <DialogTitle id="form-dialog-title">Mortgage repayment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogContentText}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="amount"
                        label="Amount"
                        value={amount}
                        onInput={e => setAmount(e.target.value)}
                        type="number"
                        fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseWithDialogContentTextReset} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => { handleMortgageRepayment() }} color="primary">
                        Repay
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default MortgageRepaymentDialog;
