import React, { useContext, useLayoutEffect, useState } from "react";
import { Error as ShowError } from "../components/Error";
import { loadRooms } from "../model/actions";
import { guestsMap, bookingsMap, roomsDict } from "../model/selectors";
import { AppModel, allRooms } from "../model";

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
              <td>--</td>
            ) : (
              <td>
                {rooms[room]?.map((booking) => {
                  const guest = guests.get(
                    bookings.get(booking.booking_id).guest_id
                  );
                  return (
                    <span
                      className="tag"
                      key={booking.id}
                      onClick={() => {
                        onSelectGuest(guest.id);
                      }}
                    >
                      {guest.name}
                    </span>
                  );
                }) ?? null}
              </td>
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
  }, []);

  const error = state.bookings.error || state.guests.error;
  const loading = state.bookings.loading || state.guests.loading;

  if (loading) return null;
  if (error) return <ShowError error={error} />;
  if (state.bookings.data.length && state.guests.data.length) {
    const rooms = roomsDict(state);
    const bookings = bookingsMap(state);
    const guests = guestsMap(state);

    const clearGuestQuery = () => {
      setGuestQuery("");
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
          </div>
        )}
        <RoomStatusTable
          rooms={rooms}
          guests={guests}
          bookings={bookings}
          onSelectGuest={setGuestQuery}
          selectedGuestId={guestQuery}
        />
      </>
    );
  } else return null;
};
