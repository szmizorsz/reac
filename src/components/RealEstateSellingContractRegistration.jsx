import React from 'react';
import { TextField, Button, Box } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./RealEstateSellingContractRegistration.css";
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles(() => ({
    datepicker: {
        height: '3vh'
    },
}));

const RealEstateSellingContractRegistration = ({
    handleSubmit,
    buyer,
    setBuyer,
    price,
    setPrice,
    dueDate,
    setDueDate,
    disabled,
    nonSellerAlert,
    requiredFieldsAlert,
}) => {
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

    const displayMandatoryFieldsAlert = () => {
        let alert;
        if (requiredFieldsAlert) {
            alert = <Alert severity="info">Please, fill in the required fields: buyer, price, due date!</Alert>
        }
        return alert;
    }

    return (
        <>
            <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    required
                    id="Buyer"
                    value={buyer}
                    onInput={e => setBuyer(e.target.value)}
                    label="Buyer"
                    margin="dense" />
                <TextField
                    fullWidth
                    required
                    id="Price (ETH)"
                    value={price}
                    onInput={e => setPrice(e.target.value)}
                    type="number"
                    label="Price"
                    margin="dense" />
                <Box mt={2}>
                    <DatePicker
                        className={classes.datepicker}
                        variant="inline"
                        inputVariant="outlined"
                        selected={dueDate}
                        onChange={date => setDueDate(date.getTime())}
                        placeholderText="   Due Date *" />
                </Box>
                <Box mt={2}>
                    <Button
                        fullWidth
                        variant="outlined"
                        type="submit"
                        disabled={disabled}>
                        Register
                    </Button>
                </Box>
                {disabledRegistrationAlert()}
                {displayNonSellerAlert()}
                {displayMandatoryFieldsAlert()}
            </form>
        </>
    );
};

export default RealEstateSellingContractRegistration;