import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import MenuBar from './components/MenuBar';
import HomePage from './components/HomePage';
import RealEstateList from './components/RealEstateList';
import RegisterRealEstate from './components/RegisterRealEstate';
import RealEstateDetail from './components/RealEstateDetail';
import Mortgage from './components/Mortgage';
import { REAL_ESTATE_REPOSITORY } from './config/contracts';
import { IPFS } from './config/settings'
import ipfsClient from "ipfs-http-client";
import getWeb3 from "./util/getWeb3";
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

function App() {
  const classes = useStyles();
  const [realEstateRepositoryContract, setRealEstateRepositoryContract] = React.useState('');
  const [ipfs] = React.useState(ipfsClient({ host: IPFS.HOST, port: IPFS.PORT, protocol: IPFS.PROTOCOL }));

  const loadBlockChainConfig = async () => {
    const web3 = await getWeb3();
    const realEstateRepository = new web3.eth.Contract(REAL_ESTATE_REPOSITORY.ABI, REAL_ESTATE_REPOSITORY.ADDRESS);
    setRealEstateRepositoryContract(realEstateRepository);
  };

  useEffect(() => {
    loadBlockChainConfig();
  }, []);

  return (
    <div className={classes.root}>
      <Router>
        <MenuBar />
        <Grid container>
          <Grid item md={2}></Grid>
          <Grid item xs={12} md={8}>
            <Box mt={10}>
              <div className="content">
                <Switch>
                  <Route path="/">
                    <HomePage />
                  </Route>
                  <Route path="/register">
                    <RegisterRealEstate
                      realEstateRepositoryContract={realEstateRepositoryContract}
                      ipfs={ipfs}
                    />
                  </Route>
                  <Route path="/list">
                    <RealEstateList
                      ipfs={ipfs}
                    />
                  </Route>
                  <Route path="/realestate/:tokenId">
                    <RealEstateDetail
                      ipfs={ipfs}
                    />
                  </Route>
                  <Route path="/mortgage">
                    <Mortgage />
                  </Route>
                </Switch>
              </div>
            </Box>
          </Grid>
          <Grid item md={2}></Grid>
        </Grid>
      </Router>
    </div>
  );
}

export default App;
