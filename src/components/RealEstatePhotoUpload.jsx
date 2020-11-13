import React from 'react';
import { REAL_ESTATE_PHOTOS } from '../config/contracts';
import Web3 from 'web3';
import { TextField, Button } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import { GAS_LIMIT } from '../config/settings'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1)
        },
    },
}));

const RealEstatePhotoUpload = ({ tokenId, ipfs }) => {
    const classes = useStyles();

    const [description, setDescription] = React.useState('');
    const [file, setFile] = React.useState('');

    const web3 = new Web3(Web3.givenProvider);
    const realEstatePhotosContract = new web3.eth.Contract(REAL_ESTATE_PHOTOS.ABI, REAL_ESTATE_PHOTOS.ADDRESS);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const source = await ipfs.add([...event.target[2].files])
        const cid = source.path;

        const accounts = await web3.eth.getAccounts();
        let config = {
            gas: GAS_LIMIT,
            from: accounts[0]
        }
        await realEstatePhotosContract.methods.registerRealEstatePhoto(tokenId, cid).send(config)
            .once('receipt', (receipt) => {
                console.log(receipt);
            })

        setDescription('');
        setFile('');
    }

    return (
        <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
                Photo upload
            </Typography>
            <TextField
                variant="outlined"
                fullWidth
                required
                id="Description"
                value={description}
                onInput={e => setDescription(e.target.value)}
                label="Description"
                margin="dense" />
            <TextField
                fullWidth
                value={file}
                onInput={e => setFile(e.target.value)}
                name="upload-photo"
                id="blabla"
                type="file" />
            <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit">
                Upload
            </Button>
        </form>
    );
};

export default RealEstatePhotoUpload;