import { Booking } from "../../domain/entities/Booking";
import { BookingRepository } from "../../domain/repositories/BookingRepository";

export class FakeBookingRepository implements BookingRepository {
  private bookings: Booking[] = [];

  async save(booking: Booking): Promise<void> {
    this.bookings.push(booking);
  }

  async findById(id: string): Promise<Booking | null> {
    return this.bookings.find((booking) => booking.getId() === id) || null;
  }
}
