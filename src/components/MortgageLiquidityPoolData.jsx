import React from 'react';
import { TextField } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Doughnut, HorizontalBar } from 'react-chartjs-2'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1)
        },
    },
}));

const doughnutData = {
    labels: ['Lent capital', 'Available capital'],
    datasets: [
        {
            label: '# of Votes',
            data: [12, 19],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1,
        },
    ],
}

const barData = {
    labels: ['Total capital', 'Collected interest', 'Collectible interest'],
    datasets: [
        {
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255, 159, 64, 0.4)',
            hoverBorderColor: 'rgba(255, 159, 64, 1)'
        }
    ]
};

const barOptions = {
    legend: {
        display: false
    },
    maintainAspectRatio: false
};

const totalCapitalLabelText = (capital) => {
    return 'Total capital (ETH): ' + capital;
}

const MortgageLiquidityPoolData = ({ capital, collectibleInterest, collectedInterest, interestRate, lentCapital, availableCapital }) => {
    const classes = useStyles();
    const capitalData = [lentCapital, availableCapital];
    doughnutData.datasets[0].data = capitalData;
    const interestData = [capital, collectedInterest, collectibleInterest];
    barData.datasets[0].data = interestData;

    return (
        <Grid container className={classes.root}>
            <Grid item xs={12} md={1}>
                <TextField
                    InputProps={{ disableUnderline: true }}
                    label="Interest rate" value={interestRate || ''}
                    fullWidth
                    margin="dense" />
            </Grid>
            <Grid item xs={12} md={1}>
            </Grid>
            <Grid item xs={12} md={2}>
                <Doughnut
                    data={doughnutData}
                    width={100}
                    height={200}
                    options={{ maintainAspectRatio: false }} />
                <Typography align="center">
                    {totalCapitalLabelText(capital)}
                </Typography>
            </Grid>
            <Grid item xs={12} md={1}>
            </Grid>
            <Grid item xs={12} md={6}>
                <HorizontalBar
                    data={barData}
                    width={100}
                    height={200}
                    options={barOptions}
                />
            </Grid>

        </Grid>
    );
};

export default MortgageLiquidityPoolData;
