import React from 'react';
import { TextField, Button, Box } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./RealEstateSellingContractRegistration.css";
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1)
        },
    },
    datepicker: {
        height: '3vh'
    },
}));

const RealEstateSellingContractRegistration = ({ handleSubmit, buyer, setBuyer, price, setPrice, dueDate, setDueDate, disabled, nonSellerAlert }) => {
    const classes = useStyles();

    const disabledRegistrationAlert = () => {
        let alert;
        if (disabled) {
            alert = <Alert severity="info">Selling contract registration disabled: There is already a selling contract in registered or confirmed state!</Alert>
        }
        return alert;
    }

    const displayNonSellerAlert = () => {
        let alert;
        if (nonSellerAlert) {
            alert = <Alert severity="info">Only the proprietor can register a selling contract!</Alert>
        }
        return alert;
    }

    return (
        <Box m={2}>
            <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>
                    Selling contract registration
                </Typography>
                {disabledRegistrationAlert()}
                {displayNonSellerAlert()}
                <TextField
                    variant="outlined"
                    fullWidth
                    required
                    id="Buyer"
                    value={buyer}
                    onInput={e => setBuyer(e.target.value)}
                    label="Buyer"
                    margin="dense" />
                <TextField
                    variant="outlined"
                    fullWidth
                    required
                    id="Price (ETH)"
                    value={price}
                    onInput={e => setPrice(parseInt(e.target.value))}
                    type="number"
                    label="Price"
                    margin="dense" />
                <DatePicker
                    className={classes.datepicker}
                    selected={dueDate}
                    onChange={date => setDueDate(date.getTime())}
                    placeholderText="   Due Date *" />
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={disabled}>
                    Register
                </Button>
            </form>
        </Box>
    );
};

export default RealEstateSellingContractRegistration;