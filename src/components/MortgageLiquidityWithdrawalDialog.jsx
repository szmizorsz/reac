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

function MortgageLiquidityWithdrawalDialog({ open, handleClose, mortgageLiquidityPoolContract, loadLiquidityProviers, loadLiquidityPoolData }) {
    const web3 = new Web3(Web3.givenProvider);
    const [withdrawalAmount, setWithdrawalAmount] = React.useState('');

    const handleLiquidityWithdrawal = async () => {
        const accounts = await web3.eth.getAccounts();
        const weiValue = Web3.utils.toWei(withdrawalAmount.toString(), 'ether');
        let config = {
            gas: GAS_LIMIT,
            from: accounts[0]
        }
        await mortgageLiquidityPoolContract.methods.withdrawLiquidity(weiValue).send(config);
        handleClose();
        loadLiquidityProviers();
        loadLiquidityPoolData();
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" disableBackdropClick>
                <DialogTitle id="form-dialog-title">Liquidity withdrawal</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please, specify the amount (ETH) that you would like to withdraw!
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="withdrawalAmount"
                        label="Withdrawal amount (ETH)"
                        value={withdrawalAmount}
                        onInput={e => setWithdrawalAmount(e.target.value)}
                        type="number"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => { handleLiquidityWithdrawal() }} color="primary">
                        Withdraw
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default MortgageLiquidityWithdrawalDialog;
