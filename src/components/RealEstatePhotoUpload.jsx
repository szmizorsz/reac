import React from 'react';
import { TextField, Button } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1)
        },
    },
}));


const RealEstatePhotoUpload = ({ handleSubmit, description, setDescription, file, setFile, realEstateNonProprietorAlert }) => {
    const classes = useStyles();

    const displayRealEstateNonProprietorAlert = () => {
        let alert;
        if (realEstateNonProprietorAlert) {
            alert = <Alert severity="info">Only the real estate owner can upload photos!</Alert>
        }
        return alert;
    }

    return (
        <>
            <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
                <TextField
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
                    variant="outlined"
                    type="submit">
                    Upload
            </Button>
            </form>
            {displayRealEstateNonProprietorAlert()}
        </>
    );
};

export default RealEstatePhotoUpload;
