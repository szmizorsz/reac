import React, { useEffect } from 'react'
import { MORTGAGE_LIQUIDITY_POOL } from '../config/contracts';
import Web3 from 'web3';
import MortgageLiquidityProviders from './MortgageLiquidityProviders'
import MortgageLiquidityInjectionDialog from './MortgageLiquidityInjectionDialog'
import MortgageLiquidityWithdrawalDialog from './MortgageLiquidityWithdrawalDialog'
import MortgageLiquidityPoolData from './MortgageLiquidityPoolData'
import { Button } from '@material-ui/core/'
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

const Mortgage = () => {
    const [liquidityProvders, setLiquidityProviders] = React.useState([]);
    const [mortgageLiquidityInjectionDialogOpen, setMortgageLiquidityInjectionDialogOpen] = React.useState(false);
    const [mortgageLiquidityWithdrawalDialogOpen, setMortgageLiquidityWithdrawalDialogOpen] = React.useState(false);
    const [capital, setCapital] = React.useState('');
    const [collectibleInterest, setCollectibleInterest] = React.useState('');
    const [collectedInterest, setCollectedInterest] = React.useState('');
    const [interestRate, setInterestRate] = React.useState('');
    const [lentCapital, setLentCapital] = React.useState('');
    const [availableCapital, setAvailableCapital] = React.useState('');
    const web3 = new Web3(Web3.givenProvider);
    const mortgageLiquidityPoolContract = new web3.eth.Contract(MORTGAGE_LIQUIDITY_POOL.ABI, MORTGAGE_LIQUIDITY_POOL.ADDRESS);

    const loadLiquidityProviers = async () => {
        const liquidityProvdersFromBlockchain = [];
        const nrOfLiquidityProviders = await mortgageLiquidityPoolContract.methods.getNrOfLiquidityProviders().call();
        for (let i = 0; i < nrOfLiquidityProviders; i++) {
            const liquidityProvider = await mortgageLiquidityPoolContract.methods.getProviderByIndex(i).call();
            liquidityProvider._capital = Web3.utils.fromWei(liquidityProvider._capital, 'ether');
            liquidityProvider._collectedInterest = Web3.utils.fromWei(liquidityProvider._collectedInterest, 'ether');
            liquidityProvdersFromBlockchain.push(liquidityProvider);
        }
        setLiquidityProviders(liquidityProvdersFromBlockchain);
    };

    const loadLiquidityPoolData = async () => {
        const capitalFromChain = await mortgageLiquidityPoolContract.methods.capital().call();
        setCapital(Web3.utils.fromWei(capitalFromChain, 'ether'));
        const collectibleInterestFromChain = await mortgageLiquidityPoolContract.methods.collectibleInterest().call();
        setCollectibleInterest(Web3.utils.fromWei(collectibleInterestFromChain, 'ether'));
        const collectedInterestFromChain = await mortgageLiquidityPoolContract.methods.collectedInterest().call();
        setCollectedInterest(Web3.utils.fromWei(collectedInterestFromChain, 'ether'));
        const interestRateFromChain = await mortgageLiquidityPoolContract.methods.interestRate().call();
        setInterestRate(Web3.utils.fromWei(interestRateFromChain, 'ether'));
        const lentCapitalFromChain = await mortgageLiquidityPoolContract.methods.lentCapital().call();
        setLentCapital(Web3.utils.fromWei(lentCapitalFromChain, 'ether'));
        const availableCapitalFromChain = await mortgageLiquidityPoolContract.methods.availableCapital().call();
        setAvailableCapital(Web3.utils.fromWei(availableCapitalFromChain, 'ether'));
    };

    useEffect(() => {
        loadLiquidityPoolData();
        loadLiquidityProviers();
    }, []);

    const handleCloseMortgageLiquidityInjectionDialog = () => {
        setMortgageLiquidityInjectionDialogOpen(false);
    };

    const handleCloseMortgageLiquidityWithdrawalDialog = () => {
        setMortgageLiquidityWithdrawalDialogOpen(false);
    };

    return (
        <>
            <MortgageLiquidityPoolData
                capital={capital}
                collectibleInterest={collectibleInterest}
                collectedInterest={collectedInterest}
                interestRate={interestRate}
                lentCapital={lentCapital}
                availableCapital={availableCapital} />
            <Grid container>
                <Grid item xs={12} md={6}>
                    <Box m={1}>
                        <MortgageLiquidityProviders liquidityProvders={liquidityProvders} />
                        <Button
                            onClick={() => { setMortgageLiquidityInjectionDialogOpen(true) }}
                            variant="outlined"
                            color="primary"
                            type="submit">
                            Inject liquidity
                        </Button>
                        <Button
                            onClick={() => { setMortgageLiquidityWithdrawalDialogOpen(true) }}
                            variant="outlined"
                            color="primary"
                            type="submit">
                            Withdraw
                    </Button>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box m={1}>
                        <MortgageLiquidityProviders liquidityProvders={liquidityProvders} />
                    </Box>
                </Grid>
            </Grid>
            <MortgageLiquidityInjectionDialog
                open={mortgageLiquidityInjectionDialogOpen}
                handleClose={handleCloseMortgageLiquidityInjectionDialog}
                mortgageLiquidityPoolContract={mortgageLiquidityPoolContract}
                loadLiquidityProviers={loadLiquidityProviers}
                loadLiquidityPoolData={loadLiquidityPoolData} />
            <MortgageLiquidityWithdrawalDialog
                open={mortgageLiquidityWithdrawalDialogOpen}
                handleClose={handleCloseMortgageLiquidityWithdrawalDialog}
                mortgageLiquidityPoolContract={mortgageLiquidityPoolContract}
                loadLiquidityProviers={loadLiquidityProviers}
                loadLiquidityPoolData={loadLiquidityPoolData} />
        </>
    );
}

export default Mortgage;