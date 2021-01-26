import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { GAS_LIMIT } from '../config/settings'
import Web3 from 'web3';
import Alert from '@material-ui/lab/Alert';

function SellingContractConfirmationDialog({ open, handleClose, contract, loadRealEstateSellingContracts }) {
    const web3 = new Web3(Web3.givenProvider);
    const defaultDialogContentText = 'Buyer has to confirm (accept) the selling contract before any further action (payment).';
    const [dialogContentText, setDialogContentText] = React.useState(defaultDialogContentText);

    const handleConfirmation = async (contract) => {
        const accounts = await web3.eth.getAccounts();
        const sellingContractData = await contract.methods.getSellingContract().call();
        if (accounts[0] !== sellingContractData._buyer) {
            setDialogContentText(<Alert severity="info">Only the buyer can confirm the selling contract!</Alert>);
            return;
        }
        let config = {
            gas: GAS_LIMIT,
            from: accounts[0]
        }
        await contract.methods.confirm().send(config)
            .on('error', error => {
                setDialogContentText(<Alert severity="error">Transaction has reverted: Please, note that only the buyer can confirm!</Alert>);
            });
        handleCloseWithDialogContentTextReset();
        loadRealEstateSellingContracts();
    }

    const handleCloseWithDialogContentTextReset = () => {
        setDialogContentText(defaultDialogContentText);
        handleClose();
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" disableBackdropClick>
                <DialogTitle id="form-dialog-title">Selling contract confirmation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogContentText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseWithDialogContentTextReset} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => { handleConfirmation(contract) }} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default SellingContractConfirmationDialog;
