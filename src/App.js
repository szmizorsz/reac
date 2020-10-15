import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import MenuBar from './components/MenuBar'
import List from './components/List';
import Register from './components/Register';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

function App() {
  const classes = useStyles();
  const [realEstates] = React.useState([]);

  return (
    <div className={classes.root}>
      <Router>
        <MenuBar />
        <Grid container>
          <Grid item md={2}></Grid>
          <Grid item xs={12} md={8}>
            <div className="content">
              <Switch>
                <Route path="/register">
                  <Register realEstates={realEstates} />
                </Route>
                <Route path="/list">
                  <List  realEstates={realEstates} />
                </Route>
              </Switch>
            </div>
          </Grid>
          <Grid item md={2}></Grid>
        </Grid>
      </Router>
    </div>
  );
}

export default App;
