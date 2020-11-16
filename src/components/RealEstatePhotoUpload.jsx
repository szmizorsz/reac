import React from 'react';
import { TextField, Button } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1)
        },
    },
}));

const RealEstatePhotoUpload = ({ handleSubmit, description, setDescription, file, setFile }) => {
    const classes = useStyles();

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