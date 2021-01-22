import React from 'react';
import { Box, TextField } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1)
        },
    },
}));

const RealEstateBaseData = ({ realEstate }) => {
    const classes = useStyles();

    return (
        <Box mt={2}>
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
        </Box>
    );
};

export default RealEstateBaseData;