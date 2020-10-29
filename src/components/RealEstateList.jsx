import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { REAL_ESTATE_REPOSITORY } from '../config/contracts';
import Web3 from 'web3';
import { BufferList } from "bl";

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
}));

function List({ ipfs }) {
    const classes = useStyles();
    const [realEstates, setRealEstates] = React.useState([]);

    const web3 = new Web3(Web3.givenProvider);
    const realEstateRepositoryContract = new web3.eth.Contract(REAL_ESTATE_REPOSITORY.ABI, REAL_ESTATE_REPOSITORY.ADDRESS);

    const loadRealEstates = async (setRealEstates) => {

        const nrOfRealEstates = await realEstateRepositoryContract.methods.totalSupply().call();
        const realEstatesFromBlockchain = [];

        for (let i = 1; i <= nrOfRealEstates; i++) {
            const tokenURI = await realEstateRepositoryContract.methods.tokenURI(i).call();
            for await (const file of ipfs.get(tokenURI)) {
                const content = new BufferList()
                for await (const chunk of file.content) {
                    content.append(chunk)
                }
                const realEstate = JSON.parse(content.toString());
                realEstatesFromBlockchain.push(realEstate);
            }
        }
        setRealEstates(realEstatesFromBlockchain);
    };
    useEffect(() => {
        loadRealEstates(setRealEstates);
    }, []);

    return (
        <Box mt={2}>
            <TableContainer className={classes.table} component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Address</TableCell>
                            <TableCell>City</TableCell>
                            <TableCell>Country</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Proprietor</TableCell>
                            <TableCell>External Id</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {realEstates.map((row) => (
                            <TableRow key={row.externalId}>
                                <TableCell>{row.addressLine}</TableCell>
                                <TableCell>{row.city}</TableCell>
                                <TableCell>{row.country}</TableCell>
                                <TableCell>{row.type}</TableCell>
                                <TableCell>{row.proprietor}</TableCell>
                                <TableCell>{row.externalId}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default List;
