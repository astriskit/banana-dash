import { createContext, useReducer } from "react";
import { reducer } from "./reducer";

export const allRooms = [
  "101",
  "102",
  "103",
  "104",
  "105",
  "106",
  "107",
  "108",
  "201",
  "202",
  "203",
  "204",
  "205",
  "206",
  "207",
  "208",
  "banquet",
];

const initRecord = {
  loading: false,
  data: [],
  error: null,
};

const init = {
  guests: { ...initRecord },
  bookings: { ...initRecord },
  invoices: { ...initRecord },
  invoiceables: { ...initRecord },
  payments: { ...initRecord },
  logger: true,
};

const nullFn = () => null;
const initContext = [init, nullFn];

export const AppModel = createContext(initContext);

export const ModelRoot = ({ children }) => {
  const [state, d] = useReducer(reducer, init);

  const dispatch = (action) => {
    if (state.logger) {
      console.log(
        `Logger: dispatching ${action.type}/${action?.payload?.key} with data -`
      );
      action?.payload?.data && console.table(action.payload.data);
    }
    return d(action);
  };

  return (
    <AppModel.Provider value={[state, dispatch]}>{children}</AppModel.Provider>
  );
};
