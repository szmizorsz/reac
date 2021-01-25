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

function PaymentSimulationDialog({ open, handleClose, contract, handleOpenTokenTransferDialog, loadRealEstateSellingContracts }) {
    const web3 = new Web3(Web3.givenProvider);
    const defaultDialogContentText = 'Seller can simulate that she/he received payment from the buyer and register it here. This simulation could be automated in the future with an oracle monitoring the payments from the buyer to the seller.';
    const [dialogContentText, setDialogContentText] = React.useState(defaultDialogContentText);

    const [paid, setPaid] = React.useState('');

    const handlePaymentSimulation = async (contract) => {
        const accounts = await web3.eth.getAccounts();
        const sellingContractData = await contract.methods.getSellingContract().call();
        if (accounts[0] !== sellingContractData._seller) {
            setDialogContentText(<Alert severity="info">Only the seller can register the payment receivement!</Alert>);
            return;
        }
        let config = {
            gas: GAS_LIMIT,
            from: accounts[0]
        }
        const weiPaid = Web3.utils.toWei(paid.toString(), 'ether');
        await contract.methods.registerRecievedPayment(weiPaid).send(config)
            .on('error', error => {
                setDialogContentText(<Alert severity="error">Transaction has reverted: Please, note that only the seller can register the payment receivement!</Alert>)
            });
        handleCloseWithDialogContentTextResetAndOpenTokenTransferDialog();
        loadRealEstateSellingContracts();
    }

    const handleCloseWithDialogContentTextResetAndOpenTokenTransferDialog = async () => {
        setDialogContentText(defaultDialogContentText);
        handleClose();
        const sellingContractData = await contract.methods.getSellingContract().call();
        if (parseInt(sellingContractData._paid) >= parseInt(sellingContractData._price)) {
            handleOpenTokenTransferDialog(contract);
        }
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" disableBackdropClick>
                <DialogTitle id="form-dialog-title">Payment simulation</DialogTitle>
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
                    <Button onClick={handleCloseWithDialogContentTextResetAndOpenTokenTransferDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => { handlePaymentSimulation(contract) }} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default PaymentSimulationDialog;
