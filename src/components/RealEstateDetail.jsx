import React, { useEffect } from 'react';
import { withRouter } from "react-router";
import RealEstateBaseData from './RealEstateBaseData';
import RealEstatePhotoUpload from './RealEstatePhotoUpload';
import RealEstatePhotos from './RealEstatePhotos';
import { REAL_ESTATE_PHOTOS } from '../config/contracts';
import Web3 from 'web3';
import { GAS_LIMIT } from '../config/settings'

const RealEstateDetail = ({ match, ipfs }) => {
    const { params: { tokenId } } = match;

    const [realEstatePhotos, setRealEstatePhotos] = React.useState([]);
    const [description, setDescription] = React.useState('');
    const [file, setFile] = React.useState('');

    const web3 = new Web3(Web3.givenProvider);
    const realEstatePhotosContract = new web3.eth.Contract(REAL_ESTATE_PHOTOS.ABI, REAL_ESTATE_PHOTOS.ADDRESS);

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
            <RealEstateBaseData tokenId={tokenId} ipfs={ipfs} />
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