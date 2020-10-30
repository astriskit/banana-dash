import React, { useContext, useLayoutEffect, useState } from "react";
import { Error as ShowError } from "../components/Error";
import { loadRooms, loadDues } from "../model/actions";
import { guestsMap, bookingsMap, roomsDict } from "../model/selectors";
import { AppModel, allRooms } from "../model";

const GuestsCol = ({ room, guests, onSelectGuest, bookings }) => (
  <td>
    {room?.map((booking) => {
      const guest = guests.get(bookings.get(booking.booking_id).guest_id);
      const checkIn = new Date(booking.checkin_at);
      const checkOut = new Date(booking.checkout_at);
      return (
        <span
          className="tag"
          key={booking.id}
          onClick={() => {
            onSelectGuest(guest.id);
          }}
          title={`${checkIn.toLocaleDateString()}, ${checkIn.toLocaleTimeString()} -> ${checkOut.toLocaleDateString()}, ${checkOut.toLocaleTimeString()}`}
        >
          {guest.name}
        </span>
      );
    }) ?? null}
  </td>
);

const RoomStatusTable = ({
  rooms = {},
  guests = {},
  bookings = {},
  onSelectGuest,
  selectedGuestId,
}) => (
  <div className="table-container">
    <table className="room-table">
      <thead>
        <tr>
          <th width="20%">Room-id</th>
          {selectedGuestId ? <th>Dues</th> : <th>Guests</th>}
        </tr>
      </thead>
      <tbody>
        {allRooms.map((room) => (
          <tr key={room}>
            <td className="center">
              <span className="tag">{room}</span>
            </td>
            {selectedGuestId ? (
              <td>
                {rooms[room]
                  ?.filter(({ booking_id }) => {
                    return (
                      bookings.get(booking_id).guest_id === selectedGuestId
                    );
                  })
                  .map(({ id }) => (
                    <span key={id} className="tag">
                      B-id/{id}/due/
                      {bookings.get(id).amountDue.toFixed(2)}
                    </span>
                  ))}
              </td>
            ) : (
              <GuestsCol
                guests={guests}
                room={rooms[room]}
                onSelectGuest={onSelectGuest}
                bookings={bookings}
              />
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const Rooms = () => {
  const [state, dispatch] = useContext(AppModel);
  const [guestQuery, setGuestQuery] = useState("");
  const [dateQuery, setDateQuery] = useState({
    to: "",
    from: "",
  });

  useLayoutEffect(() => {
    loadRooms(dispatch);
    loadDues(dispatch);
  }, []);

  const error =
    state.bookings.error ||
    state.guests.error ||
    state.invoices.error ||
    state.payments.error;
  const loading =
    state.bookings.loading ||
    state.guests.loading ||
    state.invoices.loading ||
    state.payments.loading;

  if (loading) return null;
  if (error) return <ShowError error={error} />;
  if (state.bookings.data.length && state.guests.data.length) {
    let rooms = roomsDict(state);
    if (dateQuery.to || dateQuery.from) {
      for (const room in rooms) {
        let bkngs = rooms[room].filter(({ checkout_at }) => {
          const from = dateQuery.from ? Date.parse(dateQuery.from) : null;
          const to = dateQuery.to ? Date.parse(dateQuery.to) : null;
          const checkOut = Date.parse(checkout_at);
          if (from && to) {
            return checkOut >= to || checkOut >= from;
          } else if (to) {
            return checkOut >= to;
          } else {
            return checkOut >= from;
          }
        });
        rooms[room] = bkngs;
      }
    }
    const bookings = bookingsMap(state);
    const guests = guestsMap(state);

    const clearGuestQuery = () => {
      setGuestQuery("");
      const from = sessionStorage.getItem("_d_from") || "";
      const to = sessionStorage.getItem("_d_to") || "";
      if (from || to) {
        setDateQuery({ from, to });
        sessionStorage.clear();
      }
    };

    const clearDateQuery = () => {
      setDateQuery({ from: "", to: "" });
    };

    const selectGuest = (id) => {
      setGuestQuery(id);
      if (dateQuery.to || dateQuery.from) {
        sessionStorage.setItem("_d_from", dateQuery.from || "");
        sessionStorage.setItem("_d_to", dateQuery.to || "");
        clearDateQuery();
      }
    };

    return (
      <>
        {guestQuery && (
          <div className="filter-guest">
            <span className="tag">{guests.get(guestQuery).name}</span>
            <span className="tag" onClick={clearGuestQuery}>
              ✖
            </span>
          </div>
        )}
        {!guestQuery && (
          <div className="filter-date">
            <label>
              <span>Bookings from: &nbsp;</span>
              <input
                type="datetime-local"
                value={dateQuery.from}
                onChange={({ target: { value: from } }) => {
                  setDateQuery({ ...dateQuery, from });
                }}
              />
            </label>

            <label>
              <span>Booking to: &nbsp;</span>
              <input
                type="datetime-local"
                value={dateQuery.to}
                onChange={({ target: { value: to } }) =>
                  setDateQuery({ ...dateQuery, to })
                }
              />
            </label>

            {(dateQuery.to || dateQuery.from) && (
              <div className="tag" onClick={clearDateQuery}>
                all bookings
              </div>
            )}
          </div>
        )}
        <RoomStatusTable
          rooms={rooms}
          guests={guests}
          bookings={bookings}
          onSelectGuest={selectGuest}
          selectedGuestId={guestQuery}
        />
      </>
    );
  } else return null;
};
