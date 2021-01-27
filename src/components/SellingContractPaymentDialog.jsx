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

function SellingContractPaymentDialog({ open, handleClose, contract, loadRealEstate, loadRealEstateSellingContracts }) {
    const web3 = new Web3(Web3.givenProvider);
    const defaultDialogContentText = 'Buyer can pay the price that is transferred to the seller. Once the full price is paid the real estate ownership is transferred to the buyer.';
    const [dialogContentText, setDialogContentText] = React.useState(defaultDialogContentText);

    const [paid, setPaid] = React.useState('');

    const handlePayment = async (contract) => {
        const accounts = await web3.eth.getAccounts();
        const sellingContractData = await contract.methods.getSellingContract().call();
        if (accounts[0] !== sellingContractData._buyer) {
            setDialogContentText(<Alert severity="info">Only the buyer can pay the contract!</Alert>);
            return;
        }
        if (parseFloat(Web3.utils.fromWei(sellingContractData._paid, 'ether')) + parseFloat(paid) > parseFloat(Web3.utils.fromWei(sellingContractData._price, 'ether'))) {
            setDialogContentText(<Alert severity="info">You can not overpay the contract!</Alert>);
            return;
        }
        const weiPaid = Web3.utils.toWei(paid.toString(), 'ether');
        let config = {
            gas: GAS_LIMIT,
            from: accounts[0],
            value: weiPaid
        }
        await contract.methods.pay().send(config)
            .on('error', error => {
                setDialogContentText(<Alert severity="error">Transaction has reverted: Please, note that only the buyer can pay the contract!</Alert>)
            });
        handleCloseWithDialogContentTextReset();
        loadRealEstateSellingContracts();
        loadRealEstate();
    }

    const handleCloseWithDialogContentTextReset = async () => {
        setDialogContentText(defaultDialogContentText);
        handleClose();
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" disableBackdropClick>
                <DialogTitle id="form-dialog-title">Payment</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogContentText}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="paid"
                        label="Paid (ETH)"
                        value={paid}
                        onInput={e => setPaid(e.target.value)}
                        type="number"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseWithDialogContentTextReset} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => { handlePayment(contract) }} color="primary">
                        Pay
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default SellingContractPaymentDialog;
