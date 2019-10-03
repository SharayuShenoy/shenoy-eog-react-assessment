import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Provider, createClient, useQuery } from 'urql';
import Grid from '@material-ui/core/Grid';
import * as actions from '../store/actions';
import Chart from './Chart';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const HISTORY = `
query($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input) {
    metric
    measurements{
      value
      at
      unit
    }
  }
}
`;

const getHistory = (state) => {
  const { history } = state;
  return {
    history,
  };
};

const useStyles = makeStyles((theme: Theme) => createStyles({
  card: {
    width: '100%',
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100%',
  },
}));

export default (props) => {
  const date = new Date();
  const minute = date.setMinutes(date.getMinutes() - 30);
  console.log(minute);
  return (
    <Provider value={client}>
      <History selectMetrics={props.selectMetrics} time={minute} />
    </Provider>
  );
};

const History = (props) => {
  const dispatch = useDispatch();
  const { history } = useSelector(
    getHistory,
  );
  const input = props.selectMetrics.map((person) => ({ metricName: person, after: props.time }));
  const [result] = useQuery({
    query: HISTORY,
    variables: {
      input,
    },
  });
  const { fetching, data, error } = result;
  useEffect(
    () => {
      if (error) {
        dispatch({ type: actions.API_ERROR, error: error.message });
        return;
      }
      if (!data) return;
      const { getMultipleMeasurements } = data;

      dispatch({ type: actions.HISTORY_DATA_RECEIVED, getMultipleMeasurements });
    },
    [dispatch, fetching, data, error],
  );

  const classes = useStyles();
  return (
    <Grid container direction="row" justify="center" alignItems="center" spacing={3}>
      {history.map((keyName, keyIndex) => (
        <React.Fragment key={keyIndex}>
          <Grid item xs={10}><Chart className={classes.card} name={history[keyIndex].metric} data={history[keyIndex].measurements} /></Grid>
        </React.Fragment>
      ))}
    </Grid>
  );
};
