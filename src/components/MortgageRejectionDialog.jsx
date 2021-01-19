import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { GAS_LIMIT } from '../config/settings'
import Web3 from 'web3';

function MortgageRejectionDialog({ open, handleClose, mortgageContract, loadMortgages }) {
    const web3 = new Web3(Web3.givenProvider);

    const handleMortgageRejection = async () => {
        const accounts = await web3.eth.getAccounts();
        let config = {
            gas: GAS_LIMIT,
            from: accounts[0]
        }
        await mortgageContract.methods.reject().send(config);
        handleClose();
        loadMortgages();
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" disableBackdropClick>
                <DialogTitle id="form-dialog-title">Mortgage rejection</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You can reject the mortgage application!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => { handleMortgageRejection() }} color="primary">
                        Reject
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default MortgageRejectionDialog;
