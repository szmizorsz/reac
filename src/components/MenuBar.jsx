import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import logo from "../images/real-estate-icon.png";

const useStyles = makeStyles((theme) => ({
    header: {
        flexGrow: 1,
        backgroundColor: "black",
        color: "white",
        boxShadow: "0px 0px 0px 0px"
    },
    logo: {
        maxWidth: 70,
    }
}));

function MenuBar() {
    const classes = useStyles();

    return (
        <AppBar position="fixed" className={classes.header}>
            <Toolbar variant="dense">
                <Grid container>
                    <Grid item md={2}></Grid>
                    <Grid item xs={12} md={3}>
                        <Box mt={0.5}>
                            <Link to="/">
                                <img src={logo} alt="Real Estate Management Platform" className={classes.logo} />
                            </Link>
                        </Box>
                    </Grid>
                    <Grid item md={3}></Grid>
                    <Grid item md={1}>
                        <Box mt={0.5}>
                            <Button color="inherit" component={Link} to="/list">Real estates</Button>
                        </Box>
                    </Grid>
                    <Grid item md={1}>
                        <Box mt={0.5}>
                            <Button color="inherit" component={Link} to="/mortgage">Mortgage</Button>
                        </Box>
                    </Grid>
                    <Grid item md={2}></Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
}

export default MenuBar;
