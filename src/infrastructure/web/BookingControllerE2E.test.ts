import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { TypeORMBookingRepository } from "../repositories/TypeORMBookingRepository";
import { TypeORMPropertyRepository } from "../repositories/TypeORMPropertyRepository";
import { TypeORMUserRepository } from "../repositories/TypeORMUserRepository";
import { BookingService } from "../../application/services/BookingService";
import { UserService } from "../../application/services/UserService";
import { BookingEntity } from "../persistence/entities/BookingEntity";
import { PropertyEntity } from "../persistence/entities/PropertyEntity";
import { UserEntity } from "../persistence/entities/UserEntity";
import { PropertyService } from "../../application/services/PropertyService";
import { BookingController } from "./BookingController";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let bookingRepository: TypeORMBookingRepository;
let propertyRepository: TypeORMPropertyRepository;
let userRepository: TypeORMUserRepository;
let bookingService: BookingService;
let propertyService: PropertyService;
let userService: UserService;
let bookingController: BookingController;

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

  userRepository = new TypeORMUserRepository(
    dataSource.getRepository(UserEntity)
  );
  propertyRepository = new TypeORMPropertyRepository(
    dataSource.getRepository(PropertyEntity)
  );
  bookingRepository = new TypeORMBookingRepository(
    dataSource.getRepository(BookingEntity)
  );

  propertyService = new PropertyService(propertyRepository);
  userService = new UserService(userRepository);
  bookingService = new BookingService(
    bookingRepository,
    propertyService,
    userService
  );

  bookingController = new BookingController(bookingService);

  app.post("/bookings", (req, res, next) => {
    bookingController.createBooking(req, res).catch((err) => next(err));
  });

  app.post("/bookings/:id/cancel", (req, res, next) => {
    bookingController.cancelBooking(req, res).catch((err) => next(err));
  });
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("BookingController E2E", () => {
  beforeAll(async () => {
    const propertyRepo = dataSource.getRepository(PropertyEntity);
    const userRepo = dataSource.getRepository(UserEntity);
    const bookingRepo = dataSource.getRepository(BookingEntity);

    await propertyRepo.clear();
    await userRepo.clear();
    await bookingRepo.clear();

    await propertyRepo.save({
      id: "1",
      name: "Test Property",
      description: "A property for testing",
      maxGuests: 5,
      basePricePerNight: 100,
    });

    await userRepo.save({
      id: "1",
      name: "Test User",
    });
  });

  it("should create a booking successfully", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: "1",
      guestId: "1",
      startDate: "2024-07-01",
      endDate: "2024-07-05",
      guestCount: 2,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Booking created successfully");
    expect(response.body.booking).toHaveProperty("id");
    expect(response.body.booking).toHaveProperty("totalPrice");
  });

  it("should return 400 if the start date is invalid", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: "1",
      guestId: "1",
      startDate: "invalid-data",
      endDate: "2024-07-05",
      guestCount: 2,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid date format");
  });

  it("should return 400 if the end date is invalid", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: "1",
      guestId: "1",
      startDate: "2024-07-01",
      endDate: "invalid-data",
      guestCount: 2,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid date format");
  });

  it("should return 400 if the guest count is invalid", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: "1",
      guestId: "1",
      startDate: "2024-07-01",
      endDate: "2024-07-05",
      guestCount: 0,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "Number of guests should be greater than zero"
    );
  });

  it("should return 400 if the propertyId is invalid", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: " invalid",
      guestId: "user1",
      startDate: "2024-07-01",
      endDate: "2024-07-05",
      guestCount: 0,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Property not found");
  });

  it("should cancel a booking", async () => {
    const response = await request(app).post("/bookings").send({
      propertyId: "1",
      guestId: "1",
      startDate: "2024-07-01",
      endDate: "2024-07-05",
      guestCount: 2,
    });

    const bookingId = response.body.booking.id;

    const cancelResponse = await request(app).post(
      `/bookings/${bookingId}/cancel`
    );

    expect(cancelResponse.status).toBe(200);
    expect(cancelResponse.body.message).toBe("Booking canceled successfully");
  });

  it("should return error when trying to cancel a non-existent booking", async () => {
    const cancelResponse = await request(app).post(
      `/bookings/888/cancel`
    );

    expect(cancelResponse.status).toBe(400);
    expect(cancelResponse.body.message).toBe("Booking not found.");
  });
});
