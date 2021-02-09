import React from 'react'
import Typography from '@material-ui/core/Typography'
import house from "../images/house-icon.png";
import photo from "../images/photo-icon.jpg";
import money from "../images/money-icon.jpg";
import sale from "../images/sale-icon.jpg";
import loan from "../images/loan-icon.png";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function createData(role, privateKey) {
    return { role, privateKey };
}

const rows = [
    createData('No specific role', '8fa8fa8af32e12235bba6c819c08a1f40559471482637c5d7095e5016bef0506'),
    createData('No specific role', '3507211bfe690c53808b609a1bc1b5f7906ce9d9340f4a7f072e55d78ebe654f'),
    createData('Real estate register', '8ea97d5067dc234a17ae440add78814bb684da7533865560d9b3dd911f0a1d35'),
    createData('Mortgage approver', '4770c7c06f4ab3e7211b277af961113c72204e73ea229834a1096c16d7088e28'),
];

const useStyles = makeStyles((theme) => ({
    icon: {
        maxWidth: 50,
        maxHeight: 50
    },
    loanIcon: {
        maxWidth: 38,
        maxHeight: 38
    },
    accountsButton: {
        textTransform: 'none',
    },
}));

const Overview = () => {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Grid container>
                <Grid item md={2}></Grid>
                <Grid item xs={12} md={8}>
                    <List>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <img src={house} alt="Real Estate" className={classes.icon} />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Real Estate Repository" secondary="Dedicated role can register real estates on the blockchain as non fungible tokens." />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <img src={photo} alt="Real estate" className={classes.icon} />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Tamper proof photos" secondary="The owner can upload photos proving that certain events (e.g. reconstruction) happened to the real estate." />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <img src={sale} alt="sale" className={classes.icon} />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Selling contracts" secondary="The owner can sell the real estate along a simplistic workflow interpreted as a smart contract." />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <img src={money} alt="Money" className={classes.icon} />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Mortgage liquidity providing" secondary="Anyone can provide liquidity (ETH) to the mortgage liquidity pool and earn interest." />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <img src={loan} alt="Loan" className={classes.loanIcon} />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Mortgage borrowing" secondary="The owner can borrow (ETH) from the mortgage liquidity pool along a simplistic workflow." />
                        </ListItem>
                    </List>
                </Grid>
                <Grid item md={2}></Grid>
            </Grid>

            <Box mt={5} mr={5}>
                <Typography variant="body2" color="textSecondary" component="p" align="right">
                    You can try it on Ropsten:
                </Typography>
            </Box>
            <Box mr={3}>
                <Grid container justify="flex-end">
                    <Button className={classes.accountsButton} variant="primary" color="primary" align="right" onClick={handleClickOpen}>
                        Accounts
                    </Button>
                </Grid>
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth="false"
            >
                <div style={{ width: 800 }}>
                    <DialogTitle id="alert-dialog-title">Accounts to play with</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            The following accounts have been preloaded with some ether on the Ropsten testnet. Two of them have specific roles if you would like to try out those functionalities. Just import them into Metamask:
                    </DialogContentText>
                        <TableContainer component={Paper}>
                            <Table className={classes.table} size="small" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Private key</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.privateKey}>
                                            <TableCell component="th" scope="row">
                                                {row.role}
                                            </TableCell>
                                            <TableCell>{row.privateKey}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </DialogContent>
                </div>
            </Dialog>
        </>
    );

}
export default Overview;