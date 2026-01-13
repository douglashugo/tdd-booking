import { Booking } from "../../../domain/entities/Booking";
import { Property } from "../../../domain/entities/Property";
import { User } from "../../../domain/entities/User";
import { DateRange } from "../../../domain/values-objects/DateRange";
import { BookingEntity } from "../entities/BookingEntity";
import { PropertyEntity } from "../entities/PropertyEntity";
import { UserEntity } from "../entities/UserEntity";
import { BookingMapper } from "./BookingMapper";
import { PropertyMapper } from "./PropertyMapper";
import { UserMapper } from "./UserMapper";

const property = new Property("1", "House by the Beach", "Sea view", 6, 200);
const user = new User("user-1", "Jane Doe");

describe("BookingMapper", () => {
  const buildPropertyEntity = (): PropertyEntity =>
    PropertyMapper.toPersistence(property);

  const buildUserEntity = (): UserEntity => UserMapper.toPersistence(user);

  const buildEntity = (): BookingEntity => {
    const entity = new BookingEntity();
    entity.id = "booking-1";
    entity.property = buildPropertyEntity();
    entity.guest = buildUserEntity();
    entity.startDate = new Date("2024-08-10T00:00:00.000Z");
    entity.endDate = new Date("2024-08-12T00:00:00.000Z");
    entity.guestCount = 2;
    entity.totalPrice = 400;
    entity.status = "CONFIRMED";
    return entity;
  };

  it("deve converter BookingEntity em Booking corretamente", () => {
    const entity = buildEntity();

    const domain = BookingMapper.toDomain(entity);

    expect(domain).toBeInstanceOf(Booking);
    expect(domain.getId()).toBe(entity.id);
    expect(domain.getProperty().getId()).toBe(entity.property.id);
    expect(domain.getProperty().getName()).toBe(entity.property.name);
    expect(domain.getGuest().getId()).toBe(entity.guest.id);
    expect(domain.getGuest().getName()).toBe(entity.guest.name);
    expect(domain.getDateRange().getStartDate().getTime()).toBe(
      entity.startDate.getTime()
    );
    expect(domain.getDateRange().getEndDate().getTime()).toBe(
      entity.endDate.getTime()
    );
    expect(domain.getGuestCount()).toBe(entity.guestCount);
    expect(domain.getTotalPrice()).toBe(entity.totalPrice);
    expect(domain.getStatus()).toBe(entity.status);
  });

  it("should throw validation error when required fields are missing in BookingEntity", () => {
    const entity = buildEntity();
    entity.guest.id = "";

    expect(() => BookingMapper.toDomain(entity)).toThrow("Id is required");
  });

  it("should convert Booking to BookingEntity correctly", () => {
    const dateRange = new DateRange(
      new Date("2024-08-10T00:00:00.000Z"),
      new Date("2024-08-12T00:00:00.000Z")
    );
    const booking = new Booking("booking-1", property, user, dateRange, 2);

    const entity = BookingMapper.toPersistence(booking);

    expect(entity).toBeInstanceOf(BookingEntity);
    expect(entity.id).toBe(booking.getId());
    expect(entity.property.id).toBe(booking.getProperty().getId());
    expect(entity.guest.id).toBe(booking.getGuest().getId());
    expect(entity.startDate.getTime()).toBe(
      booking.getDateRange().getStartDate().getTime()
    );
    expect(entity.endDate.getTime()).toBe(
      booking.getDateRange().getEndDate().getTime()
    );
    expect(entity.guestCount).toBe(booking.getGuestCount());
    expect(entity.totalPrice).toBe(booking.getTotalPrice());
    expect(entity.status).toBe(booking.getStatus());
  });
});
