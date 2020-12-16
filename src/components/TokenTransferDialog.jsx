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
import { REAL_ESTATE_REPOSITORY } from '../config/contracts';

function TokenTransferDialog({ open, handleClose, contract, loadRealEstateSellingContracts }) {
    const web3 = new Web3(Web3.givenProvider);
    const realEstateRepositoryContract = new web3.eth.Contract(REAL_ESTATE_REPOSITORY.ABI, REAL_ESTATE_REPOSITORY.ADDRESS);

    const defaultDialogContentText = 'Buyer has paid the price, so you can approve the real estate token transfer!';
    const [dialogContentText, setDialogContentText] = React.useState(defaultDialogContentText);

    const handleApproval = async (contract) => {
        const sellingContractData = await contract.methods.getSellingContract().call();

        const accounts = await web3.eth.getAccounts();
        let config = {
            gas: GAS_LIMIT,
            from: accounts[0]
        }
        await realEstateRepositoryContract.methods.transferFrom(sellingContractData._seller, sellingContractData._buyer, sellingContractData._realEstateId).send(config)
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
                    <Button onClick={() => { handleApproval(contract) }} color="primary">
                        Approve
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TokenTransferDialog;
