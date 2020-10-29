import {
  SET_LOAD,
  SET_ERROR,
  SET_DATA,
  SET_LOGGER,
  KEY_BOOKING,
  KEY_GUEST,
  KEY_INVOICE,
  KEY_INVOICEABLE,
  KEY_PAYMENT,
} from "./reducer";
import { listBookings, listGuests, showBooking } from "./api";

const genAction = (type, payload = null) => ({ type, payload });

const setLoading = (key) => () => genAction(SET_LOAD, { key });
const setData = (key) => (data) => genAction(SET_DATA, { key, data });
const setError = (key) => (error) => genAction(SET_ERROR, { key, error });

const setBookingToLoad = setLoading(KEY_BOOKING);
const setBookingData = setData(KEY_BOOKING);
const setBookingToLoadError = setError(KEY_BOOKING);

const setInvoiceToLoad = setLoading(KEY_INVOICE);
const setInvoiceData = setData(KEY_INVOICE);
const setInvoiceToLoadError = setError(KEY_INVOICE);

const setGuestToLoad = setLoading(KEY_GUEST);
const setGuestData = setData(KEY_GUEST);
const setGuestToLoadError = setError(KEY_GUEST);

const setInvoiceableToLoad = setLoading(KEY_INVOICEABLE);
const setInvoiceableData = setData(KEY_INVOICEABLE);
const setInvoiceableToLoadError = setError(KEY_INVOICEABLE);

const setPaymentToLoad = setLoading(KEY_PAYMENT);
const setPaymentData = setData(KEY_PAYMENT);
const setPaymentToLoadError = setError(KEY_PAYMENT);

const setLogger = (log = false) => genAction(SET_LOGGER, { payload: log });

export const loadRooms = async (dispatch) => {
  try {
    dispatch(setBookingToLoad());
    const { data } = await listBookings();
    let bookings = [...data];
    let iter = 0;
    for (let booking of data) {
      const { data } = await showBooking(booking.id);
      bookings[iter] = { ...bookings[iter], ...data };
      iter += 1;
    }
    dispatch(setBookingData(bookings));
    dispatch(setGuestToLoad());
    const { data: guests } = await listGuests();
    dispatch(setGuestData(guests));
  } catch (error) {
    error.config.url.includes("bookings")
      ? dispatch(setBookingToLoadError(error))
      : dispatch(setBookingData([]));
    error.config.url.includes("guests")
      ? dispatch(setGuestToLoadError(error))
      : dispatch(setGuestData([]));
  }
};
