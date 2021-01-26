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
import { REAL_ESTATE_REPOSITORY, REAL_ESTATE_SELLING } from '../config/contracts';

function TokenTransferApprovalDialog({ open, handleClose, sellingContractAddress, loadRealEstateSellingContracts }) {
    const web3 = new Web3(Web3.givenProvider);
    const realEstateRepositoryContract = new web3.eth.Contract(REAL_ESTATE_REPOSITORY.ABI, REAL_ESTATE_REPOSITORY.ADDRESS);

    const defaultDialogContentText = 'You have to approve the real estate token transfer, so once the buyer pays the price the token will be automatically transferred!';
    const [dialogContentText, setDialogContentText] = React.useState(defaultDialogContentText);

    const handleApproval = async (sellingContractAddress) => {
        const sellingContract = new web3.eth.Contract(REAL_ESTATE_SELLING.ABI, sellingContractAddress);
        const sellingContractData = await sellingContract.methods.getSellingContract().call();
        const accounts = await web3.eth.getAccounts();

        if (accounts[0] !== sellingContractData._seller) {
            setDialogContentText(<Alert severity="info">Only the seller/owner can approve the real estate token transfer!</Alert>);
            return;
        }

        let config = {
            gas: GAS_LIMIT,
            from: accounts[0]
        }
        await realEstateRepositoryContract.methods.approve(sellingContractAddress, sellingContractData._realEstateId).send(config)
            .on('error', error => {
                setDialogContentText(<Alert severity="error">Transaction has reverted: Please, note that only the seller can approve the token trasnfer!</Alert>)
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
                <DialogTitle id="form-dialog-title">Real estate token transfer approval</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogContentText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { handleApproval(sellingContractAddress) }} color="primary">
                        Approve
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TokenTransferApprovalDialog;
