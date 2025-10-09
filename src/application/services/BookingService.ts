import { Booking } from "../../domain/entities/Booking";
import { BookingRepository } from "../../domain/repositories/BookingRepository";
import { DateRange } from "../../domain/values-objects/DateRange";
import { CreateBookingDTO } from "../dtos/CreateBookingDTO";
import { PropertyService } from "./PropertyService";
import { UserService } from "./UserService";
import { v4 as uuidv4 } from "uuid";

export class BookingService {
  constructor(
    private bookingRepository: BookingRepository,
    private propertyService: PropertyService,
    private userService: UserService
  ) {}

  async createBooking(dto: CreateBookingDTO): Promise<Booking> {
     const property = await this.propertyService.findPropertyById(
      dto.propertyId
    );

    if (!property) {
      throw new Error("Property not found");
    }

    const guest = await this.userService.findUserById(dto.guestId);

    if (!guest) {
      throw new Error("Guest not found");
    }

    const dateRange = new DateRange(dto.startDate, dto.endDate); // altamente acoplado, precisa refatorar

    const booking = new Booking(
      uuidv4(),
      property,
      guest,
      dateRange,
      dto.guestCount
    );

    await this.bookingRepository.save(booking);
    return booking;
  }

  async cancelBooking(bookingId: string): Promise<void> {
    const booking = await this.bookingRepository.findById(bookingId);

    if (!booking) {
      throw new Error("Reserva não encontrada.");
    }

    booking?.cancel(new Date());
    await this.bookingRepository.save(booking!);
  }
}