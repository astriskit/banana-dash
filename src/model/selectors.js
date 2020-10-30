export const roomsDict = (state) => {
  return state.bookings.data
    .map(({ room_assignments }) => room_assignments)
    .flat(1)
    .reduce((a, b) => {
      if (!Array.isArray(a[b.room])) {
        a[b.room] = [];
      }
      a[b.room].push(b);
      return a;
    }, {});
};

export const bookingsMap = (state) => {
  return new Map(
    state.bookings.data.map(({ room_assignments: _, ...booking }) => [
      booking.id,
      booking,
    ])
  );
};

export const guestsMap = (state) => {
  return new Map(state.guests.data.map((guest) => [guest.id, guest]));
};
