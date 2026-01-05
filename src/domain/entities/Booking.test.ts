import  { Property } from "./Property";
import { User } from "./User";
import { DateRange } from "../values-objects/DateRange";
import { Booking } from "./Booking";

describe("Booking Entinty", () => {
  it("should create instance the Booking with all atributes", () => {
    const property = new Property('1', 'House', 'A house in the middle in nature', 4, 200);
    const user = new User('1', 'João');
    const dataRange = new DateRange(new Date('2023-10-10'), new Date('2023-10-16'));
    const booking = new Booking('1', property, user, dataRange, 2);

    expect(booking.getId()).toBe('1');
    expect(booking.getProperty()).toBe(property);
    expect(booking.getUser()).toBe(user);
    expect(booking.getDateRange()).toBe(dataRange);
    expect(booking.getGuestCount()).toBe(2);
  });

  it("should throw an error when trying to book a number of guests above the maximum allowed", () => {
    const property = new Property('1', 'House', 'A house in the middle in nature', 4, 200);
    const user = new User('1', 'João');
    const dataRange = new DateRange(new Date('2023-10-10'), new Date('2023-10-15'));

    expect(() => {
      new Booking('1', property, user, dataRange, 5);
    }).toThrow("Number of guests exceeds max allowed");
  })

  it("should calculate the total price with discount", () => {
    const property = new Property('1', 'House', 'A house in the middle in nature', 4, 300);
    const user = new User('1', 'João');
    const dataRange = new DateRange(new Date('2023-10-01'), new Date('2023-10-10'));

    const booking = new Booking('1', property, user, dataRange, 4);

    expect(booking.getTotalPrice()).toBe(300 * 9 * 0.9);
  })

  it("should check if property is available in the selected period", () => {
    const property = new Property('1', 'House', 'A house in the middle in nature', 4, 300);
    const user = new User('1', 'João');
    const dataRange = new DateRange(new Date('2023-10-01'), new Date('2023-10-10'));

    const booking = new Booking('1', property, user, dataRange, 4);
    const dataRange2 = new DateRange( new Date('2023-10-02'), new Date('2023-10-08'));

    expect(() => {
      new Booking('2', property, user, dataRange2, 4);
    }).toThrow("Property is not available in the selected period");
  })

  it("should cancel a reservation without a refund when there is less than 1 day left until check-in", () => {
    const property = new Property('1', 'House', 'A house in the middle in nature', 4, 300);
    const user = new User('1', 'João');
    const dataRange = new DateRange(new Date('2023-10-01'), new Date('2023-10-07'));

    const booking = new Booking('1', property, user, dataRange, 4);
    const currentDate = new Date('2023-10-01');
    booking.cancel(currentDate)

    expect(booking.getStatus()).toBe('CANCELED');
    expect(booking.getTotalPrice()).toBe(300 * 6)
  })

  it("should cancel a reservation for a full refund when the request is more than 7 days before check-in", () => {
    const property = new Property('1', 'House', 'A house in the middle in nature', 4, 300);
    const user = new User('1', 'João');
    const dataRange = new DateRange(new Date('2023-10-01'), new Date('2023-10-10'));

    const booking = new Booking('1', property, user, dataRange, 4);
    const currentDate = new Date('2023-09-21');
    booking.cancel(currentDate)

    expect(booking.getStatus()).toBe('CANCELED');
    expect(booking.getTotalPrice()).toBe(0)
  })

  it("should cancel a reservation with a partial refund when the request is between 1 and 7 days before check-in", () => {
    const property = new Property('1', 'House', 'A house in the middle in nature', 4, 300);
    const user = new User('1', 'João');
    const dataRange = new DateRange(new Date('2023-10-01'), new Date('2023-10-05'));

    const booking = new Booking('1', property, user, dataRange, 4);
    const currentDate = new Date('2023-09-28');
    booking.cancel(currentDate)

    expect(booking.getStatus()).toBe('CANCELED');
    expect(booking.getTotalPrice()).toBe(300 * 0.5 * 4)
  })

  it("should throw an error if you try to cancel a reservation and it is already canceled", () => {
    const property = new Property('1', 'House', 'A house in the middle in nature', 4, 300);
    const user = new User('1', 'João');
    const dataRange = new DateRange(new Date('2023-10-01'), new Date('2023-10-05'));

    const booking = new Booking('1', property, user, dataRange, 4);
    const currentDate = new Date('2023-09-28');
    booking.cancel(currentDate)
    expect(() => {
      booking.cancel(currentDate)
    }).toThrow("A reservation has already been canceled");
  })
})