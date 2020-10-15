import React from 'react'
import { TextField, Button } from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
        },
        '& .MuiButton-root': {
            margin: theme.spacing(1),
        },
        '& .MuiTypography-root': {
            margin: theme.spacing(1),
        },
    },
}));

function Register({ realEstates }) {
    const classes = useStyles();

    const [proprietor, setProprietor] = React.useState('');
    const [externalId, setExternalId] = React.useState('');
    const [type, setType] = React.useState('');
    const [country, setCountry] = React.useState('');
    const [city, setCity] = React.useState('');
    const [addressLine, setAddressLine] = React.useState('');
    const [latitude, setLatitude] = React.useState('');
    const [longitude, setLongitude] = React.useState('');
    const [height, setHeight] = React.useState('');

    const handleSubmit = (event) => {
        const realEstate = {
            proprietor: proprietor,
            externalId: externalId,
            type: type,
            country: country,
            city: city,
            addressLine: addressLine,
            latitude: latitude,
            longitude: longitude,
            height: height
        }
        realEstates.push(realEstate);
        setProprietor('');
        setExternalId('');
        setType('');
        setCountry('');
        setCity('');
        setAddressLine('');
        setLatitude();
        setLongitude();
        setHeight();
        event.preventDefault();
    }

    return (
        <Box mt={2}>
            <form className={classes.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
                <TextField
                    variant="outlined"
                    fullWidth
                    required
                    id="Proprietor"
                    value={proprietor}
                    onInput={e => setProprietor(e.target.value)}
                    label="Proprietor"
                    margin="dense" />
                <TextField
                    variant="outlined"
                    fullWidth
                    required
                    id="External-id"
                    value={externalId}
                    onInput={e => setExternalId(e.target.value)}
                    label="External id"
                    margin="dense" />
                <TextField
                    variant="outlined"
                    fullWidth
                    id="Type"
                    value={type}
                    onInput={e => setType(e.target.value)}
                    label="Type"
                    margin="dense" />
                <Typography variant="h6" gutterBottom>
                    Address
                </Typography>
                <TextField
                    variant="outlined"
                    fullWidth
                    required
                    id="Country"
                    value={country}
                    onInput={e => setCountry(e.target.value)}
                    label="Country"
                    margin="dense" />
                <TextField
                    variant="outlined"
                    fullWidth
                    required
                    id="City"
                    value={city}
                    onInput={e => setCity(e.target.value)}
                    label="City"
                    margin="dense" />
                <TextField
                    variant="outlined"
                    fullWidth
                    required
                    id="Address line"
                    value={addressLine}
                    onInput={e => setAddressLine(e.target.value)}
                    label="Address line"
                    margin="dense" />
                <Typography variant="h6" gutterBottom>
                    Coordinates
                </Typography>
                <TextField
                    variant="outlined"
                    fullWidth
                    id="Latitude"
                    value={latitude|| ''}
                    onInput={e => setLatitude(e.target.value)}
                    label="Latitude"
                    type="number"
                    margin="dense" />
                <TextField
                    variant="outlined"
                    fullWidth
                    id="Longitude"
                    value={longitude|| ''}
                    onInput={e => setLongitude(e.target.value)}
                    label="Longitude"
                    type="number"
                    margin="dense" />
                <TextField
                    variant="outlined"
                    fullWidth
                    id="Height"
                    value={height|| ''}
                    onInput={e => setHeight(e.target.value)}
                    label="Height"
                    type="number"
                    margin="dense" />
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit">
                    Register
                </Button>
            </form>
        </Box>
    )
}

export default Register;
