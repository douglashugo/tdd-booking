import { DateRange } from "../values-objects/DateRange";
import { User } from "./User";
import { Property } from "./Property";

export class Booking {
  private readonly id: string;
  private readonly property: Property;
  private readonly user: User;
  private readonly dateRange: DateRange;
  private readonly guestCount: number;
  private status: 'CONFIRMED' | 'CANCELED' = 'CONFIRMED';
  private totalPrice: number;

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

  getStatus(): 'CONFIRMED' | 'CANCELED' {
    return this.status;
  }

  getTotalPrice(): number {
    return this.totalPrice;
  }

  cancel(currentDate: Date): void {
    if (this.status === 'CANCELED') {
      throw new Error("A reservation has already been canceled");
    }
    this.status = 'CANCELED';

    const checkInDate = this.dateRange.getStartDate();
    const differenceInDays = checkInDate.getTime() - currentDate.getTime()
    const daysUntilCheckIn = Math.ceil(differenceInDays / (1000 * 3600 * 24));

    if (daysUntilCheckIn > 7) {
      this.totalPrice = 0
    } else if (daysUntilCheckIn >= 1) {
      this.totalPrice *= 0.5;
    }
  }
}