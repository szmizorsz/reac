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
import Alert from '@material-ui/lab/Alert';

function MortgageApplicationDialog({
    open,
    handleClose,
    mortgageLiquidityPoolContract,
    loadMortgages,
    loadLiquidityPoolData,
    mortgages
}) {
    const web3 = new Web3(Web3.givenProvider);
    const [amount, setAmount] = React.useState('');
    const [realEstateId, setRealEstateId] = React.useState('');
    const defaultDialogContentText = 'Please, specify the real esate ID and the amount (ETH)!';
    const [dialogContentText, setDialogContentText] = React.useState(defaultDialogContentText);

    const handleMortgageApplication = async () => {
        for (let mortgage of mortgages) {
            if (mortgage._realEstateId === realEstateId && (mortgage._state === 'Requested' || mortgage._state === 'Approved')) {
                setDialogContentText(<Alert severity="info">There is already an open mortgage of the given real estate!</Alert>);
                return;
            }
        }
        const accounts = await web3.eth.getAccounts();
        const weiAmount = Web3.utils.toWei(amount.toString(), 'ether');
        let config = {
            gas: GAS_LIMIT,
            from: accounts[0]
        }
        await mortgageLiquidityPoolContract.methods.applyForMortgage(realEstateId, weiAmount).send(config);
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
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" disableBackdropClick>
                <DialogTitle id="form-dialog-title">Mortgage application</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogContentText}
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
                    <Button onClick={handleCloseWithDialogContentTextReset} color="primary">
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
