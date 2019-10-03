import * as actions from "../actions";

const initialState = [];

const historyDataRecevied = (state, action) => {
  const { getMultipleMeasurements } = action;

  return getMultipleMeasurements;
};

const handlers = {
  [actions.HISTORY_DATA_RECEIVED]: historyDataRecevied
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};
