import { DataSource } from "typeorm";
import { PropertyEntity } from "../persistence/entities/PropertyEntity";
import { UserEntity } from "../persistence/entities/UserEntity";
import { Property } from "../../domain/entities/Property";
import { User } from "../../domain/entities/User";
import { DateRange } from "../../domain/values-objects/DateRange";
import { Booking } from "../../domain/entities/Booking";
import { BookingEntity } from "../persistence/entities/BookingEntity";
import { TypeORMBookingRepository } from "./TypeORMBookingRepository";

describe("TyperORMBookingRepository", () => {
  let dataSource: DataSource;
  let bookingRepository: TypeORMBookingRepository;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      entities: [BookingEntity, PropertyEntity, UserEntity],
      synchronize: true,
      logging: false,
    });
    await dataSource.initialize();
    bookingRepository = new TypeORMBookingRepository(
      dataSource.getRepository(BookingEntity)
    );
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it("deve salvar uma reserva com sucesso", async () => {
    const propertyRepository = dataSource.getRepository(PropertyEntity);
    const userProperty = dataSource.getRepository(UserEntity);

    const propertyEntity = propertyRepository.create({
      id: "1",
      name: "Casa na Praia",
      description: "Vista para o mar",
      maxGuests: 6,
      basePricePerNight: 200,
    });
    await propertyRepository.save(propertyEntity);

    const property = new Property(
      "1",
      "Casa na Praia",
      "Vista para o mar",
      6,
      200
    );

    const userEntity = userProperty.create({
      id: "1",
      name: "Douglas",
    });
    await userProperty.save(userEntity);

    const user = new User("1", "Douglas");
    const dateRange = new DateRange(
      new Date("2024-07-01"),
      new Date("2024-07-10")
    );

    const booking = new Booking("1", property, user, dateRange, 4);
    await bookingRepository.save(booking);

    const savedBooking = await bookingRepository.findById("1");
    expect(savedBooking).not.toBeNull();
    expect(savedBooking?.getId()).toBe("1");
    expect(savedBooking?.getProperty().getId()).toBe("1");
    expect(savedBooking?.getGuest().getId()).toBe("1");
  });

  it("deve retornar null ao buscar uma reserva inexistente", async () => {
    const savedBooking = await bookingRepository.findById("999");
    expect(savedBooking).toBeNull();
  });

  it("deve salvar uma reserva com sucesso fazendo um cancelamento posterior", async () => {
    const propertyRepository = dataSource.getRepository(PropertyEntity);
    const userProperty = dataSource.getRepository(UserEntity);

    const propertyEntity = propertyRepository.create({
      id: "1",
      name: "Casa na Praia",
      description: "Vista para o mar",
      maxGuests: 6,
      basePricePerNight: 200,
    });
    await propertyRepository.save(propertyEntity);

    const property = new Property(
      "1",
      "Casa na Praia",
      "Vista para o mar",
      6,
      200
    );

    const userEntity = userProperty.create({
      id: "1",
      name: "Douglas",
    });
    await userProperty.save(userEntity);

    const user = new User("1", "Douglas");2
    const dateRange = new DateRange(
      new Date("2024-07-01"),
      new Date("2024-07-10")
    );

    const booking = new Booking("1", property, user, dateRange, 4);
    await bookingRepository.save(booking);

    booking.cancel(new Date("2024-06-28"));
    await bookingRepository.save(booking);

    const updateBooking = await bookingRepository.findById("1");

    expect(updateBooking).not.toBeNull();
    expect(updateBooking?.getStatus()).toBe("CANCELED");
  });
});
