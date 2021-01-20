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

function MortgageRepaymentDialog({ open, handleClose, mortgageContract, loadMortgages, loadLiquidityPoolData, loadLiquidityProviers }) {
    const web3 = new Web3(Web3.givenProvider);
    const [amount, setAmount] = React.useState('');

    const handleMortgageRepayment = async () => {
        const accounts = await web3.eth.getAccounts();
        const weiAmount = Web3.utils.toWei(amount.toString(), 'ether');
        let config = {
            gas: GAS_LIMIT,
            from: accounts[0],
            value: weiAmount
        }
        await mortgageContract.methods.repay().send(config);
        handleClose();
        loadMortgages();
        loadLiquidityPoolData();
        loadLiquidityProviers();
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" disableBackdropClick>
                <DialogTitle id="form-dialog-title">Mortgage repayment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please, specify the amount (ETH) to be repaid!
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
                    <Button onClick={handleClose} color="primary">
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
