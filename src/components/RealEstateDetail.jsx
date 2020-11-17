import React, { useEffect } from 'react';
import { withRouter } from "react-router";
import RealEstateBaseData from './RealEstateBaseData';
import RealEstatePhotoUpload from './RealEstatePhotoUpload';
import RealEstatePhotos from './RealEstatePhotos';
import { REAL_ESTATE_REPOSITORY, REAL_ESTATE_PHOTOS } from '../config/contracts';
import Web3 from 'web3';
import { GAS_LIMIT } from '../config/settings'
import { BufferList } from "bl";
import RealEstateMap from './RealEstateMap'

const RealEstateDetail = ({ match, ipfs }) => {
    const { params: { tokenId } } = match;
    const [realEstate, setRealEstate] = React.useState('');
    const [realEstatePhotos, setRealEstatePhotos] = React.useState([]);
    const [description, setDescription] = React.useState('');
    const [file, setFile] = React.useState('');

    const web3 = new Web3(Web3.givenProvider);
    const realEstateRepositoryContract = new web3.eth.Contract(REAL_ESTATE_REPOSITORY.ABI, REAL_ESTATE_REPOSITORY.ADDRESS);
    const realEstatePhotosContract = new web3.eth.Contract(REAL_ESTATE_PHOTOS.ABI, REAL_ESTATE_PHOTOS.ADDRESS);

    const loadRealEstate = async () => {
        const tokenURI = await realEstateRepositoryContract.methods.tokenURI(tokenId).call();
        let realEstateFromIPFS;
        for await (const file of ipfs.get(tokenURI)) {
            const content = new BufferList()
            for await (const chunk of file.content) {
                content.append(chunk)
            }
            realEstateFromIPFS = JSON.parse(content.toString());
            realEstateFromIPFS.tokenURI = tokenURI;
            realEstateFromIPFS.tokenId = tokenId;
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
        const newRealEstatePhotos = [...realEstatePhotos];
        newRealEstatePhotos.push({ cid, description });
        setRealEstatePhotos(newRealEstatePhotos);
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
        </>
    );
};

export default withRouter(RealEstateDetail);