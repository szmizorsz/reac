import React, { useEffect } from 'react'
import { MORTGAGE_LIQUIDITY_POOL, MORTGAGE } from '../config/contracts';
import Web3 from 'web3';
import MortgageLiquidityProviders from './MortgageLiquidityProviders'
import MortgageLiquidityInjectionDialog from './MortgageLiquidityInjectionDialog'
import MortgageLiquidityWithdrawalDialog from './MortgageLiquidityWithdrawalDialog'
import MortgageApplicationDialog from './MortgageApplicationDialog'
import MortgageLiquidityPoolData from './MortgageLiquidityPoolData'
import Mortgages from './Mortgages'
import { Button } from '@material-ui/core/'
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { mortgageIntegerStateToString } from '../util/dataConversions';

const Mortgage = () => {
    const [liquidityProvders, setLiquidityProviders] = React.useState([]);
    const [mortgages, setMortgages] = React.useState([]);
    const [mortgageLiquidityInjectionDialogOpen, setMortgageLiquidityInjectionDialogOpen] = React.useState(false);
    const [mortgageLiquidityWithdrawalDialogOpen, setMortgageLiquidityWithdrawalDialogOpen] = React.useState(false);
    const [mortgageApplicationDialogOpen, setMortgageApplicationDialogOpen] = React.useState(false);
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
        let interestRateFromChain = await mortgageLiquidityPoolContract.methods.interestRate().call();
        interestRateFromChain = interestRateFromChain / 10;
        setInterestRate(interestRateFromChain.toString() + '%');
        const lentCapitalFromChain = await mortgageLiquidityPoolContract.methods.lentCapital().call();
        setLentCapital(Web3.utils.fromWei(lentCapitalFromChain, 'ether'));
        const availableCapitalFromChain = await mortgageLiquidityPoolContract.methods.availableCapital().call();
        setAvailableCapital(Web3.utils.fromWei(availableCapitalFromChain, 'ether'));
    };

    const loadMortgages = async () => {
        const mortgagesFromBlockchain = [];
        const nrOfMortgages = await mortgageLiquidityPoolContract.methods.getNrOfMortgages().call();
        for (let i = 0; i < nrOfMortgages; i++) {
            const mortgageAddress = await mortgageLiquidityPoolContract.methods.getMortgageByIndex(i).call();
            const mortgageContract = new web3.eth.Contract(MORTGAGE.ABI, mortgageAddress);
            const mortgage = await mortgageContract.methods.getMortgage().call();
            mortgage._requestedAmount = Web3.utils.fromWei(mortgage._requestedAmount, 'ether');
            mortgage._borrowedAmount = Web3.utils.fromWei(mortgage._borrowedAmount, 'ether');
            mortgage._interest = Web3.utils.fromWei(mortgage._interest, 'ether');
            mortgage._total = parseFloat(mortgage._borrowedAmount) + parseFloat(mortgage._interest);
            mortgage._interestRate = mortgage._interestRate / 10;
            mortgage._interestRate = mortgage._interestRate.toString() + '%';
            mortgage._repaidAmount = Web3.utils.fromWei(mortgage._repaidAmount, 'ether');
            mortgage._state = mortgageIntegerStateToString(parseInt(mortgage._state));
            if (parseInt(mortgage._dueDate) !== 0) {
                mortgage._dueDate = new Date(parseInt(mortgage._dueDate)).toDateString();
            } else {
                mortgage._dueDate = 'Not set';
            }
            mortgage.contract = mortgageContract;
            mortgagesFromBlockchain.push(mortgage);
        }
        setMortgages(mortgagesFromBlockchain);
    };

    useEffect(() => {
        loadLiquidityPoolData();
        loadLiquidityProviers();
        loadMortgages();
    }, []);

    const handleCloseMortgageLiquidityInjectionDialog = () => {
        setMortgageLiquidityInjectionDialogOpen(false);
    };

    const handleCloseMortgageLiquidityWithdrawalDialog = () => {
        setMortgageLiquidityWithdrawalDialogOpen(false);
    };

    const handleCloseMortgageApplicationDialog = () => {
        setMortgageApplicationDialogOpen(false);
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
                        <Mortgages
                            mortgages={mortgages}
                            loadMortgages={loadMortgages}
                            loadLiquidityPoolData={loadLiquidityPoolData}
                            loadLiquidityProviers={loadLiquidityProviers}
                            availableCapital={availableCapital} />
                        <Button
                            onClick={() => { setMortgageApplicationDialogOpen(true) }}
                            variant="outlined"
                            color="primary"
                            type="submit">
                            Apply for mortgage
                        </Button>
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
            <MortgageApplicationDialog
                open={mortgageApplicationDialogOpen}
                handleClose={handleCloseMortgageApplicationDialog}
                mortgageLiquidityPoolContract={mortgageLiquidityPoolContract}
                loadMortgages={loadMortgages}
                loadLiquidityPoolData={loadLiquidityPoolData}
                mortgages={mortgages} />
        </>
    );
}

export default Mortgage;