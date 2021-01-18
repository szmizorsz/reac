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

function MortgageLiquidityInjectionDialog({ open, handleClose, mortgageLiquidityPoolContract, loadLiquidityProviers, loadLiquidityPoolData }) {
    const web3 = new Web3(Web3.givenProvider);
    const [liquidity, setLiquidity] = React.useState('');

    const handleLiquidityInjection = async () => {
        const accounts = await web3.eth.getAccounts();
        const weiValue = Web3.utils.toWei(liquidity.toString(), 'ether');
        let config = {
            gas: GAS_LIMIT,
            from: accounts[0],
            value: weiValue
        }
        await mortgageLiquidityPoolContract.methods.injectLiquidity().send(config);
        handleClose();
        loadLiquidityProviers();
        loadLiquidityPoolData();
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" disableBackdropClick>
                <DialogTitle id="form-dialog-title">Liquidity injection</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please, specify the amount (ETH) the you would like to provide!
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="liquidity"
                        label="Liquidity (ETH)"
                        value={liquidity}
                        onInput={e => setLiquidity(e.target.value)}
                        type="number"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => { handleLiquidityInjection() }} color="primary">
                        Inject
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default MortgageLiquidityInjectionDialog;
