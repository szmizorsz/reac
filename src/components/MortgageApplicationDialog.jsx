import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { GAS_LIMIT } from '../config/settings'
import Web3 from 'web3';

function MortgageApplicationDialog({ open, handleClose, mortgageLiquidityPoolContract, loadMortgages, loadLiquidityPoolData }) {
    const web3 = new Web3(Web3.givenProvider);
    const [amount, setAmount] = React.useState('');
    const [realEstateId, setRealEstateId] = React.useState('');

    const handleMortgageApplication = async () => {
        const accounts = await web3.eth.getAccounts();
        const weiAmount = Web3.utils.toWei(amount.toString(), 'ether');
        let config = {
            gas: GAS_LIMIT,
            from: accounts[0]
        }
        await mortgageLiquidityPoolContract.methods.applyForMortgage(realEstateId, weiAmount).send(config);
        handleClose();
        loadMortgages();
        loadLiquidityPoolData();
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" disableBackdropClick>
                <DialogTitle id="form-dialog-title">Mortgage application</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please, specify the real esatet ID and amount (ETH)!
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="realEstateId"
                        label="Real estate ID"
                        value={realEstateId}
                        onInput={e => setRealEstateId(e.target.value)}
                        type="number"
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="amount"
                        label="Amount (ETH)"
                        value={amount}
                        onInput={e => setAmount(e.target.value)}
                        type="number"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => { handleMortgageApplication() }} color="primary">
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default MortgageApplicationDialog;
