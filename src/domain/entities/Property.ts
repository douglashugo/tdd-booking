import { DateRange } from "../values-objects/DateRange";
import { Booking } from "./Booking";

export class Property {
  private readonly bookings: Booking[] = []
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly description: string,
    private readonly maxGuests: number,
    private readonly basePricePerNight: number    
  ) {
    if (!name) {
      throw new Error('Name is required');
    }
    if (!id) {
      throw new Error('ID is required');
    }
    if (maxGuests <= 0) {
      throw new Error('Max guests must be greater than zero');
    }

    this.id = id;
    this.name = name;
    this.description = description;
    this.maxGuests = maxGuests;
    this.basePricePerNight = basePricePerNight;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getMaxGuests(): number {
    return this.maxGuests;
  }

  getBasePricePerNight(): number {
    return this.basePricePerNight;
  }

  validateGuestsCount(guestsCount: number): void {
    if (guestsCount > this.maxGuests) {
      throw new Error('Number of guests exceeds max allowed');
    }
  }

  calculateTotalPrice(dateRange: DateRange): number {
    const totalNights = dateRange.getTotalNights();
    let totalPrice = this.basePricePerNight * totalNights;  
    if (totalNights >= 7) {
      totalPrice *= 0.9;
    }
    return totalPrice;
  }

  isAvailable(dateRange: DateRange): boolean {
    return !this.bookings.some((booking) =>
      booking.getStatus() === 'CONFIRMED' &&
      booking.getDateRange().overlaps(dateRange)
    );
  }

  addBooking(booking: Booking): void {
    this.bookings.push(booking);
  }
}