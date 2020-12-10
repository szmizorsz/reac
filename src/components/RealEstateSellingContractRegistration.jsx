import React from 'react';
import { TextField, Button, Box } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./RealEstateSellingContractRegistration.css";

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

const RealEstateSellingContractRegistration = ({ handleSubmit, buyer, setBuyer, price, setPrice, dueDate, setDueDate }) => {
    const classes = useStyles();

    return (
        <Box m={2}>
            <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>
                    Selling contract registration
            </Typography>
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
                    id="Price"
                    value={price}
                    onInput={e => setPrice(e.target.value)}
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
                    type="submit">
                    Register
            </Button>
            </form>
        </Box>
    );
};

export default RealEstateSellingContractRegistration;