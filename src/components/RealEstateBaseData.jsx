import React, { useEffect } from 'react';
import { BufferList } from "bl";
import { REAL_ESTATE_REPOSITORY } from '../config/contracts';
import Web3 from 'web3';
import { TextField } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1)
        },
    },
}));

const RealEstateBaseData = ({ tokenId, ipfs }) => {
    const classes = useStyles();
    const [realEstate, setRealEstate] = React.useState('');

    const web3 = new Web3(Web3.givenProvider);
    const realEstateRepositoryContract = new web3.eth.Contract(REAL_ESTATE_REPOSITORY.ABI, REAL_ESTATE_REPOSITORY.ADDRESS);

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

    return (
        <Grid container className={classes.root}>
            <Grid item xs={12} md={2}>
                <TextField label="Token Id" value={realEstate.tokenId || ''} fullWidth margin="dense" />
            </Grid>
            <Grid item xs={12} md={2}>
                <TextField label="External Id" value={realEstate.externalId || ''} fullWidth margin="dense" />
            </Grid>
            <Grid item xs={12} md={2}>
                <TextField label="Type" value={realEstate.type || ''} fullWidth margin="dense" />
            </Grid>
            <Grid item xs={12} md={5}>
                <TextField label="Proprietor" value={realEstate.proprietor || ''} fullWidth margin="dense" />
            </Grid>
            <Grid item xs={12} md={2}>
                <TextField label="Country" value={realEstate.country || ''} fullWidth margin="dense" />
            </Grid>
            <Grid item xs={12} md={2}>
                <TextField label="City" value={realEstate.city || ''} fullWidth margin="dense" />
            </Grid>
            <Grid item xs={12} md={7}>
                <TextField label="Address" value={realEstate.addressLine || ''} fullWidth margin="dense" />
            </Grid>
            <Grid item xs={12} md={3}>
                <TextField label="Latitude" value={realEstate.latitude || ''} fullWidth margin="dense" />
            </Grid>
            <Grid item xs={12} md={3}>
                <TextField label="Longitude" value={realEstate.longitude || ''} fullWidth margin="dense" />
            </Grid>
            <Grid item xs={12} md={3}>
                <TextField label="Height" value={realEstate.height || ''} fullWidth margin="dense" />
            </Grid>
        </Grid>
    );
};

export default RealEstateBaseData;