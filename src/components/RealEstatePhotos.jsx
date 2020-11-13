import React, { useEffect } from 'react';
import { REAL_ESTATE_PHOTOS } from '../config/contracts';
import Web3 from 'web3';
import Typography from '@material-ui/core/Typography'

const RealEstatePhotos = ({ tokenId, ipfs }) => {
    const [realEstatePhotos, setRealEstatePhotos] = React.useState([]);

    const web3 = new Web3(Web3.givenProvider);
    const realEstatePhotosContract = new web3.eth.Contract(REAL_ESTATE_PHOTOS.ABI, REAL_ESTATE_PHOTOS.ADDRESS);

    const loadRealEstatePhotos = async () => {
        const realEstatePhotosFromIPFS = [];
        const nrOfRealEstatePhotos = await realEstatePhotosContract.methods.getNrOfRealEstatePhotos(tokenId).call();
        for (let i = 0; i < nrOfRealEstatePhotos; i++) {
            const photoCid = await realEstatePhotosContract.methods.getfRealEstatePhotoCidOfIndex(tokenId, i).call();
            realEstatePhotosFromIPFS.push(photoCid);
            console.log(photoCid);
        }
        setRealEstatePhotos(realEstatePhotosFromIPFS);
    };

    useEffect(() => {
        loadRealEstatePhotos();
    }, []);

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Photos
            </Typography>
            <div>
                {realEstatePhotos.map((row) => (
                    <p key={row}>Photo IPFS content identifier: {row}</p>
                ))}
            </div>
        </>
    );
};

export default RealEstatePhotos;