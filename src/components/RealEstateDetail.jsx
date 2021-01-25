import React, { useEffect } from 'react';
import { withRouter } from "react-router";
import RealEstateBaseData from './RealEstateBaseData';
import RealEstatePhotoUpload from './RealEstatePhotoUpload';
import RealEstatePhotos from './RealEstatePhotos';
import {
    REAL_ESTATE_REPOSITORY,
    REAL_ESTATE_PHOTOS,
    REAL_ESTATE_SELLING_FACTORY,
    REAL_ESTATE_SELLING,
    MORTGAGE_LIQUIDITY_POOL,
    MORTGAGE
} from '../config/contracts';
import Web3 from 'web3';
import { GAS_LIMIT } from '../config/settings'
import { BufferList } from "bl";
import RealEstateMap from './RealEstateMap'
import RealEstateSellingContracts from './RealEstateSellingContracts'
import RealEstateSellingContractRegistration from './RealEstateSellingContractRegistration'
import { sellingContractIntegerStateToString } from '../util/dataConversions'
import MuiAccordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import withStyles from "@material-ui/core/styles/withStyles";
import { Box } from '@material-ui/core';
import MortgagesOnRealEstateDetail from './MortgagesOnRealEstateDetail';
import { mortgageIntegerStateToString } from '../util/dataConversions';

const IconLeftAccordionSummary = withStyles({
    expandIcon: {
        order: -1
    }
})(AccordionSummary);

const Accordion = withStyles({
    root: {
        border: 'none',
        boxShadow: 'none',

    },
    expanded: {},
})(MuiAccordion);

const RealEstateDetail = ({ match, ipfs }) => {
    const { params: { tokenId } } = match;
    const [realEstate, setRealEstate] = React.useState('');
    const [realEstatePhotos, setRealEstatePhotos] = React.useState([]);
    const [realEstateSellingContracts, setRealEstateSellingContracts] = React.useState([]);
    const [mortgages, setMortgages] = React.useState([]);
    const [description, setDescription] = React.useState('');
    const [file, setFile] = React.useState('');
    const [buyer, setBuyer] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [dueDate, setDueDate] = React.useState();
    const [sellingContractRegistrationDisabled, setSellingContractRegistrationDisabled] = React.useState(false);
    const [sellingContractRegistrationNotSellerAlert, setSellingContractRegistrationNotSellerAlert] = React.useState(false);
    const [sellingContractRegistrationRequiredFieldsAlert, setSellingContractRegistrationRequiredFieldsAlert] = React.useState(false);

    const web3 = new Web3(Web3.givenProvider);
    const realEstateRepositoryContract = new web3.eth.Contract(REAL_ESTATE_REPOSITORY.ABI, REAL_ESTATE_REPOSITORY.ADDRESS);
    const realEstatePhotosContract = new web3.eth.Contract(REAL_ESTATE_PHOTOS.ABI, REAL_ESTATE_PHOTOS.ADDRESS);
    const realEstateSellingFactoryContract = new web3.eth.Contract(REAL_ESTATE_SELLING_FACTORY.ABI, REAL_ESTATE_SELLING_FACTORY.ADDRESS);
    const mortgageLiquidityPoolContract = new web3.eth.Contract(MORTGAGE_LIQUIDITY_POOL.ABI, MORTGAGE_LIQUIDITY_POOL.ADDRESS);

    const loadRealEstate = async () => {
        const tokenURI = await realEstateRepositoryContract.methods.tokenURI(tokenId).call();
        const proprietor = await realEstateRepositoryContract.methods.ownerOf(tokenId).call();
        let realEstateFromIPFS;
        for await (const file of ipfs.get(tokenURI)) {
            const content = new BufferList()
            for await (const chunk of file.content) {
                content.append(chunk)
            }
            realEstateFromIPFS = JSON.parse(content.toString());
            realEstateFromIPFS.tokenURI = tokenURI;
            realEstateFromIPFS.tokenId = tokenId;
            realEstateFromIPFS.proprietor = proprietor;
            setRealEstate(realEstateFromIPFS);
        }
    };

    useEffect(() => {
        loadRealEstate();
    }, []);

    const handlePhotoUploadSubmit = async (event) => {
        event.preventDefault();

        const source = await ipfs.add([...event.target[1].files])
        const cid = source.path;

        const accounts = await web3.eth.getAccounts();
        let config = {
            gas: GAS_LIMIT,
            from: accounts[0]
        }
        await realEstatePhotosContract.methods.registerRealEstatePhoto(tokenId, cid, description).send(config)
            .once('receipt', (receipt) => {
                console.log(receipt);
            })

        setDescription('');
        setFile('');
        loadRealEstatePhotos();
    }

    const loadRealEstatePhotos = async () => {
        const realEstatePhotosFromIPFS = [];
        const nrOfRealEstatePhotos = await realEstatePhotosContract.methods.getNrOfRealEstatePhotos(tokenId).call();
        for (let i = 0; i < nrOfRealEstatePhotos; i++) {
            const photo = await realEstatePhotosContract.methods.getRealEstatePhotoOfIndex(tokenId, i).call();
            realEstatePhotosFromIPFS.push(photo);
        }
        setRealEstatePhotos(realEstatePhotosFromIPFS);
    };

    useEffect(() => {
        loadRealEstatePhotos();
    }, []);

    const loadRealEstateSellingContracts = async () => {
        const realEstateSellingContractsFromChain = [];
        const nrOfRealEstateSellingContracts = await realEstateSellingFactoryContract.methods.getNrOfSellingContractsByTokenId(tokenId).call();
        for (let i = 0; i < nrOfRealEstateSellingContracts; i++) {
            const sellingContractAddress = await realEstateSellingFactoryContract.methods.getSellingContractByRealEstateIdAndIndex(tokenId, i).call();
            const sellingContract = new web3.eth.Contract(REAL_ESTATE_SELLING.ABI, sellingContractAddress);
            const sellingContractData = await sellingContract.methods.getSellingContract().call();
            sellingContractData._state = sellingContractIntegerStateToString(parseInt(sellingContractData._state));
            if (sellingContractData._state === 'Registered' || sellingContractData._state === 'Confirmed') {
                setSellingContractRegistrationDisabled(true);
            }
            sellingContractData._price = Web3.utils.fromWei(sellingContractData._price, 'ether');
            sellingContractData._paid = Web3.utils.fromWei(sellingContractData._paid, 'ether');
            sellingContractData._dueDate = new Date(parseInt(sellingContractData._dueDate)).toDateString();
            sellingContractData.contract = sellingContract;
            realEstateSellingContractsFromChain.push(sellingContractData);
        }
        setRealEstateSellingContracts(realEstateSellingContractsFromChain);
        setSellingContractRegistrationRequiredFieldsAlert(false);
    };

    useEffect(() => {
        loadRealEstateSellingContracts();
        loadMortgages();
    }, []);

    const handleSellingContractRegistration = async (event) => {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();
        if (accounts[0] !== realEstate.proprietor) {
            setSellingContractRegistrationNotSellerAlert(true);
            return;
        }
        if (!buyer || !price || !dueDate) {
            setSellingContractRegistrationRequiredFieldsAlert(true);
            return;
        }

        let config = {
            gas: GAS_LIMIT,
            from: accounts[0]
        }
        const weiPrice = Web3.utils.toWei(price.toString(), 'ether');
        await realEstateSellingFactoryContract.methods.registerSellingContract(tokenId, buyer, weiPrice, dueDate).send(config)
            .once('receipt', (receipt) => {
                console.log(receipt);
            })

        setBuyer('');
        setPrice('');
        setDueDate('');

        loadRealEstateSellingContracts();
    }

    const loadMortgages = async () => {
        const mortgagesFromBlockchain = [];
        const nrOfMortgages = await mortgageLiquidityPoolContract.methods.getNrOfMortgagesByRealEstateId(tokenId).call();
        for (let i = 0; i < nrOfMortgages; i++) {
            const mortgageAddress = await mortgageLiquidityPoolContract.methods.getMortgageByRealEstateIdAndIndex(tokenId, i).call();
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

    return (
        <>
            <RealEstateBaseData realEstate={realEstate} />
            <Grid container>
                <Grid item md={2}></Grid>
                <Grid item xs={12} md={8}>
                    <RealEstateMap
                        center={[Number(realEstate.latitude), Number(realEstate.longitude)]} />
                </Grid>
                <Grid item md={2}></Grid>
            </Grid>
            <Accordion>
                <IconLeftAccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                    style={{ border: 'none' }}
                >
                    <Box ml={3}><Typography>Photos</Typography></Box>
                </IconLeftAccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <Grid item md={12}>
                            <RealEstatePhotos realEstatePhotos={realEstatePhotos} />
                        </Grid>
                        <Grid item md={2}></Grid>
                        <Grid item md={8}>
                            <RealEstatePhotoUpload
                                handleSubmit={handlePhotoUploadSubmit}
                                description={description}
                                setDescription={setDescription}
                                file={file}
                                setFile={setFile} />
                        </Grid>
                        <Grid item md={2}></Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <IconLeftAccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Box ml={3}><Typography>Selling contracts</Typography></Box>
                </IconLeftAccordionSummary>
                <AccordionDetails>
                    <Grid container>
                        <RealEstateSellingContracts
                            realEstateSellingContracts={realEstateSellingContracts}
                            loadRealEstateSellingContracts={loadRealEstateSellingContracts}
                            setSellingContractRegistrationDisabled={setSellingContractRegistrationDisabled} />
                        <Grid item md={2}></Grid>
                        <Grid item md={8}>
                            <RealEstateSellingContractRegistration
                                handleSubmit={handleSellingContractRegistration}
                                buyer={buyer}
                                setBuyer={setBuyer}
                                price={price}
                                setPrice={setPrice}
                                dueDate={dueDate}
                                setDueDate={setDueDate}
                                disabled={sellingContractRegistrationDisabled}
                                nonSellerAlert={sellingContractRegistrationNotSellerAlert}
                                requiredFieldsAlert={sellingContractRegistrationRequiredFieldsAlert} />
                        </Grid>
                        <Grid item md={2}></Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <IconLeftAccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Box ml={3}><Typography>Mortgages</Typography></Box>
                </IconLeftAccordionSummary>
                <AccordionDetails>
                    <MortgagesOnRealEstateDetail
                        mortgages={mortgages} />
                </AccordionDetails>
            </Accordion>
        </>
    );
};

export default withRouter(RealEstateDetail);