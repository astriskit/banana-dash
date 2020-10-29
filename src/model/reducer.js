export const SET_LOAD = "set_load";
export const SET_ERROR = "set_error";
export const SET_DATA = "set_data";
export const SET_LOGGER = "set_logger";

export const KEY_BOOKING = "bookings";
export const KEY_GUEST = "guests";
export const KEY_INVOICE = "invoices";
export const KEY_INVOICEABLE = "invoiceables";
export const KEY_PAYMENT = "payments";

export const reducer = (state, action) => {
  switch (action.type) {
    case SET_LOAD: {
      const nextState = { ...state };
      nextState[action.payload.key].loading = true;
      return nextState;
    }
    case SET_ERROR: {
      const nextState = { ...state };
      nextState[action.payload.key].error = action.payload.error;
      nextState[action.payload.key].loading = false;
      nextState[action.payload.key].data = [];
      return nextState;
    }
    case SET_DATA: {
      const nextState = { ...state };
      nextState[action.payload.key].data = action.payload.data;
      nextState[action.payload.key].error = null;
      nextState[action.payload.key].loading = false;
      return nextState;
    }
    case SET_LOGGER: {
      const nextState = { ...state };
      nextState.logger = action.payload;
      return nextState;
    }

    default:
      return state;
  }
};
