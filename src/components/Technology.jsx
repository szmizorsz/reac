import React from 'react'
import Typography from '@material-ui/core/Typography'
import ethereum from "../images/ethereum-logo.png";
import ipfs from "../images/ipfs-logo.png";
import fleek from "../images/fleek-logo.png";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({

    root: {
        maxWidth: 300,
    },
    media: {
        height: "10vh",
        width: "25vh",
    },
    ethereumMedia: {
        height: "10vh",
        width: "26vh",
    },
}));

const Technology = () => {
    const classes = useStyles();

    return (
        <Grid container>
            <Grid item xs={12} md={4}>
                <Box ml={6} mt={6}>
                    <Card className={classes.root}>
                        <CardActionArea>
                            <Box ml={3}>
                                <CardMedia
                                    className={classes.ethereumMedia}
                                    image={ethereum}
                                    title="Contemplative Reptile"
                                />
                            </Box>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Smart Contracts
                                     </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Non fungible tokens, ERC721, Openzeppelin, Access control, Factory contracts, Liquidity Pools
                                    </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Box>
            </Grid>
            <Grid item xs={12} md={4}>
                <Box ml={6} mt={6}>
                    <Card className={classes.root}>
                        <CardActionArea>
                            <Box ml={3}>
                                <CardMedia
                                    className={classes.media}
                                    image={ipfs}
                                    title="Contemplative Reptile"
                                />
                            </Box>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    File storage
                                    </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Token metadata and photo files are stored on IPFS and their hashes on the blockchain.
                                    </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Box>
            </Grid>
            <Grid item xs={12} md={4}>
                <Box ml={6} mt={6}>
                    <Card className={classes.root}>
                        <CardActionArea>
                            <Box ml={3}>
                                <CardMedia
                                    className={classes.media}
                                    image={fleek}
                                    title="Contemplative Reptile"
                                />
                            </Box>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Hosting
                                    </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    Truly decentralized application hosted from IPFS. Decentralized naming served by ENS. Deployment powered by Fleek.
                                    </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Box>
            </Grid>
        </Grid>
    );

}
export default Technology;