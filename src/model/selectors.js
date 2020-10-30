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
    state.bookings.data.map(({ room_assignments: _, ...booking }) => {
      let due = 0;
      if (state.invoices.data.length) {
        due = state.invoices.data
          .filter(({ booking_id }) => booking_id === booking.id)
          .map(({ line_items }) => line_items)
          .flat(1)
          .reduce((a, b) => {
            return a + (Number(b.price) + Number(b.tax)) * b.quantity;
          }, 0);
        let paid = 0;
        if (state.payments.data.length) {
          paid = state.payments.data
            .filter(({ booking_id }) => booking_id === booking.id)
            .map(({ amount }) => +amount)
            .reduce((a, b) => a + b, 0);
        }
        due = due - paid;
        booking.amountDue = due;
      }
      return [booking.id, booking];
    })
  );
};

export const guestsMap = (state) => {
  return new Map(state.guests.data.map((guest) => [guest.id, guest]));
};
