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

const MortgageLiquidityPoolData = ({ capital, collectibleInterest, collectedInterest, interestRate, lentCapital, availableCapital }) => {
    const classes = useStyles();

    return (
        <Box m={2}>
            <Grid container className={classes.root}>
                <Grid item xs={12} md={2}>
                    <TextField label="capital" value={capital || ''} fullWidth margin="dense" />
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField label="collectibleInterest" value={collectibleInterest || ''} fullWidth margin="dense" />
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField label="collectedInterest" value={collectedInterest || ''} fullWidth margin="dense" />
                </Grid>
                <Grid item xs={12} md={5}>
                    <TextField label="interestRate" value={interestRate || ''} fullWidth margin="dense" />
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField label="lentCapital" value={lentCapital || ''} fullWidth margin="dense" />
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField label="availableCapital" value={availableCapital || ''} fullWidth margin="dense" />
                </Grid>
            </Grid>
        </Box>
    );
};

export default MortgageLiquidityPoolData;