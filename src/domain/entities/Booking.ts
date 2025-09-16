import { DateRange } from "../values-objects/DateRange";
import { User } from "./User";
import { Property } from "./Property";

export class Booking {
  private readonly id: string;
  private readonly property: Property;
  private readonly user: User;
  private readonly dateRange: DateRange;
  private readonly guestCount: number;
  private readonly status: 'CONFIRMED' | 'CANCELLED' = 'CONFIRMED';
  private readonly totalPrice: number;

  constructor(
    id: string,
    property: Property,
    user: User,
    dateRange: DateRange,
    guestCount: number
  ) {
    if (guestCount <= 0) {
      throw new Error("Number of guests should be greater than zero");
    }

    property.validateGuestsCount(guestCount);

    if(!property.isAvailable(dateRange)) {
      throw new Error("Property is not available in the selected period");
    }

    this.id = id;
    this.property = property;
    this.user = user;
    this.dateRange = dateRange;
    this.guestCount = guestCount;
    this.totalPrice = property.calculateTotalPrice(dateRange);

    property.addBooking(this);
  }

  getId(): string {
    return this.id;
  }

  getProperty(): Property {
    return this.property;
  }

  getUser(): User {
    return this.user;
  }

  getDateRange(): DateRange {
    return this.dateRange;
  }

  getGuestCount(): number {
    return this.guestCount;
  }

  getStatus(): 'CONFIRMED' | 'CANCELLED' {
    return this.status;
  }

  getTotalPrice(): number {
    return this.property.calculateTotalPrice(this.dateRange);
  }
}