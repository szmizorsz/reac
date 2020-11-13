import React from 'react';
import { withRouter } from "react-router";
import RealEstateBaseData from './RealEstateBaseData';
import RealEstatePhotoUpload from './RealEstatePhotoUpload';
import RealEstatePhotos from './RealEstatePhotos';

const RealEstateDetail = ({ match, ipfs }) => {
    const { params: { tokenId } } = match;

    return (
        <>
            <RealEstateBaseData tokenId={tokenId} ipfs={ipfs} />
            <RealEstatePhotos tokenId={tokenId} ipfs={ipfs} />
            <RealEstatePhotoUpload tokenId={tokenId} ipfs={ipfs} />
        </>
    );
};

export default withRouter(RealEstateDetail);