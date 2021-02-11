import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { IPFS } from '../config/settings'
import { Box } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)'
    },
    title: {
        color: theme.palette.primary.white,
        fontSize: 10
    },
    titleBar: {
        background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
}));

const RealEstatePhotos = ({ realEstatePhotos }) => {
    const classes = useStyles();

    return (
        <Box m={3} className={classes.root}>
            <GridList className={classes.gridList} cols={2.5}>
                {realEstatePhotos.map((row) => (
                    <GridListTile key={row.cid + row.description}>
                        <a href={IPFS.PUBLIC_GATEWAY + row.cid} target="_blank" rel="noopener noreferrer">
                            <img src={IPFS.PUBLIC_GATEWAY + row.cid} alt={row.description} className="MuiGridListTile-imgFullHeight" />
                        </a>
                        <GridListTileBar
                            title={row.description}
                            classes={{
                                root: classes.titleBar,
                                title: classes.title,
                            }}
                        />
                    </GridListTile>
                ))}
            </GridList>
        </Box>
    );
};

export default RealEstatePhotos;