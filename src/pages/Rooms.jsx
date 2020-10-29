import React, { useContext, useLayoutEffect, useState } from "react";
import { Error as ShowError } from "../components/Error";
import { loadRooms } from "../model/actions";
import { AppModel } from "../model";

const allRooms = [
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

const RoomStatusTable = ({ rooms = {}, guests = {}, bookings = {} }) => (
  <div className="table-container">
    <table className="room-table">
      <thead>
        <tr>
          <th>Room-id</th>
          <th>Guests</th>
        </tr>
      </thead>
      <tbody>
        {allRooms.map((room) => (
          <tr key={room}>
            <td className="center">
              <span className="tag">{room}</span>
            </td>
            <td>
              {rooms[room]?.map((booking) => (
                <span className="tag" key={booking.id}>
                  {guests.get(bookings.get(booking.booking_id).guest_id).name}
                </span>
              )) ?? null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const Rooms = () => {
  const [state, dispatch] = useContext(AppModel);
  const [userQuery, setUserQuery] = useState("");
  const [dateQuery, setDateQuery] = useState({ to: "", from: "" });

  useLayoutEffect(() => {
    loadRooms(dispatch);
  }, []);

  const error = state.bookings.error || state.guests.error;
  const loading = state.bookings.loading || state.guests.loading;

  if (loading) return null;
  if (error) return <ShowError error={error} />;
  if (state.bookings.data.length && state.guests.data.length) {
    let rooms = state.bookings.data
      .map(({ room_assignments }) => room_assignments)
      .flat(1)
      .reduce((a, b) => {
        if (!Array.isArray(a[b.room])) {
          a[b.room] = [];
        }
        a[b.room].push(b);
        return a;
      }, {});

    const bookings = new Map(
      state.bookings.data.map(({ room_assignments: _, ...booking }) => [
        booking.id,
        booking,
      ])
    );

    const guests = new Map(state.guests.data.map((guest) => [guest.id, guest]));

    return (
      <RoomStatusTable rooms={rooms} guests={guests} bookings={bookings} />
    );
  } else return null;
};
