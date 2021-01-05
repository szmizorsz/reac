import React, { useEffect } from 'react';
import { withRouter } from "react-router";
import RealEstateBaseData from './RealEstateBaseData';
import RealEstatePhotoUpload from './RealEstatePhotoUpload';
import RealEstatePhotos from './RealEstatePhotos';
import { REAL_ESTATE_REPOSITORY, REAL_ESTATE_PHOTOS, REAL_ESTATE_SELLING_FACTORY, REAL_ESTATE_SELLING } from '../config/contracts';
import Web3 from 'web3';
import { GAS_LIMIT } from '../config/settings'
import { BufferList } from "bl";
import RealEstateMap from './RealEstateMap'
import RealEstateSellingContracts from './RealEstateSellingContracts'
import RealEstateSellingContractRegistration from './RealEstateSellingContractRegistration'
import { sellingContractIntegerStateToString } from '../util/dataConversions'

const RealEstateDetail = ({ match, ipfs }) => {
    const { params: { tokenId } } = match;
    const [realEstate, setRealEstate] = React.useState('');
    const [realEstatePhotos, setRealEstatePhotos] = React.useState([]);
    const [realEstateSellingContracts, setRealEstateSellingContracts] = React.useState([]);
    const [description, setDescription] = React.useState('');
    const [file, setFile] = React.useState('');
    const [buyer, setBuyer] = React.useState('');
    const [price, setPrice] = React.useState('');
    const [dueDate, setDueDate] = React.useState();
    const [sellingContractRegistrationDisabled, setSellingContractRegistrationDisabled] = React.useState(false);
    const [sellingContractRegistrationNotSellerAlert, setSellingContractRegistrationNotSellerAlert] = React.useState(false);

    const web3 = new Web3(Web3.givenProvider);
    const realEstateRepositoryContract = new web3.eth.Contract(REAL_ESTATE_REPOSITORY.ABI, REAL_ESTATE_REPOSITORY.ADDRESS);
    const realEstatePhotosContract = new web3.eth.Contract(REAL_ESTATE_PHOTOS.ABI, REAL_ESTATE_PHOTOS.ADDRESS);
    const realEstateSellingFactoryContract = new web3.eth.Contract(REAL_ESTATE_SELLING_FACTORY.ABI, REAL_ESTATE_SELLING_FACTORY.ADDRESS);

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

        const source = await ipfs.add([...event.target[2].files])
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
            sellingContractData._dueDate = new Date(parseInt(sellingContractData._dueDate)).toDateString();
            sellingContractData.contract = sellingContract;
            realEstateSellingContractsFromChain.push(sellingContractData);
        }
        setRealEstateSellingContracts(realEstateSellingContractsFromChain);
    };

    useEffect(() => {
        loadRealEstateSellingContracts();
    }, []);

    const handleSellingContractRegistration = async (event) => {
        event.preventDefault();

        const accounts = await web3.eth.getAccounts();
        if (accounts[0] !== realEstate.proprietor) {
            setSellingContractRegistrationNotSellerAlert(true);
            return;
        }
        let config = {
            gas: GAS_LIMIT,
            from: accounts[0]
        }
        await realEstateSellingFactoryContract.methods.registerSellingContract(tokenId, buyer, price, dueDate).send(config)
            .once('receipt', (receipt) => {
                console.log(receipt);
            })

        setBuyer('');
        setPrice('');
        setDueDate('');

        loadRealEstateSellingContracts();
    }

    return (
        <>
            <RealEstateBaseData realEstate={realEstate} />
            <RealEstateMap
                center={[Number(realEstate.latitude), Number(realEstate.longitude)]} />
            <RealEstatePhotos realEstatePhotos={realEstatePhotos} />
            <RealEstatePhotoUpload
                handleSubmit={handlePhotoUploadSubmit}
                description={description}
                setDescription={setDescription}
                file={file}
                setFile={setFile} />
            <RealEstateSellingContracts
                realEstateSellingContracts={realEstateSellingContracts}
                loadRealEstateSellingContracts={loadRealEstateSellingContracts} />
            <RealEstateSellingContractRegistration
                handleSubmit={handleSellingContractRegistration}
                buyer={buyer}
                setBuyer={setBuyer}
                price={price}
                setPrice={setPrice}
                dueDate={dueDate}
                setDueDate={setDueDate}
                disabled={sellingContractRegistrationDisabled}
                nonSellerAlert={sellingContractRegistrationNotSellerAlert} />
        </>
    );
};

export default withRouter(RealEstateDetail);