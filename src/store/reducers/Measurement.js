import * as actions from "../actions";

const initialState = {
};

const metricDataRecevied = (state, action) => {

  const { newMeasurement } = action;

  const {
    value,
    metric,
    at,
    unit
  } = newMeasurement;

  state[metric] = {
    value,
    at,
    unit
  }

  return state;
};

const handlers = {
  [actions.NEW_MEASUREMENT_DATA_RECEIVED]: metricDataRecevied
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};
