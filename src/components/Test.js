import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Provider, createClient, useSubscription, dedupExchange, fetchExchange, subscriptionExchange,
} from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import gql from 'graphql-tag';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import * as actions from '../store/actions';
import Card from './Card';
import History from './History';
import Select from './Select';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    // color: theme.palette.text.secondary,
  },
}));

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    dedupExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: (operation) => subscriptionClient.request(operation),
    }),
  ],
});

const subscriptionClient = new SubscriptionClient(
  'ws://react.eogresources.com/graphql',
);

const NEW_MEASUREMENT = gql`
subscription {
  newMeasurement{
    metric
    at
    value
    unit
  }
}
`;

const getMeasurements = (state) => {
  const { measurements } = state;
  return {
    measurements,
  };
};

export default () => {
  const [selectMetrics, setSelectMetrics] = useState([]);
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3" component="h2" className={classes.paper}>
              Realtime Metrics Dashboard
          </Typography>
          <Provider value={client}>
            <Test setSelectMetrics={setSelectMetrics} selectMetrics={selectMetrics} />
          </Provider>
        </Grid>
        <Grid item xs={12}>
          {selectMetrics.length > 0 && <History selectMetrics={selectMetrics} /> }
        </Grid>
      </Grid>
    </div>

  );
};

const Test = (props) => {
  const handleChange = (metrics) => {
    console.log('set');
    props.setSelectMetrics(metrics);
  };

  const dispatch = useDispatch();
  const { measurements } = useSelector(
    getMeasurements,
  );

  const [result] = useSubscription({
    query: NEW_MEASUREMENT,
  });

  const { data, error } = result;
  useEffect(
    () => {
      if (error) {
        dispatch({ type: actions.API_ERROR, error: error.message });
        return;
      }
      if (!data) return;
      const { newMeasurement } = data;

      dispatch({ type: actions.NEW_MEASUREMENT_DATA_RECEIVED, newMeasurement });
    },
    [dispatch, data, error],
  );
  const keys = props.selectMetrics.length > 0 ? props.selectMetrics : Object.keys(measurements);

  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item><Select names={Object.keys(measurements)} metricsChange={handleChange} /></Grid>
      <Grid container direction="row" justify="center" alignItems="center">
        {keys.map((keyName, keyIndex) => <Card key={keyIndex} name={keyName} value={measurements[keyName].value} />)}
      </Grid>

    </Grid>
  );
};
