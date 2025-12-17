import express from "express";
import { DataSource } from "typeorm";
import { TypeORMBookingRepository } from "../repositories/TypeORMBookingRepository";
import { TypeORMPropertyRepository } from "../repositories/TypeORMPropertyRepository";
import { TypeORMUserRepository } from "../repositories/TypeORMUserRepository";
import { BookingService } from "../../application/services/BookingService";
import { UserService } from "../../application/services/UserService";
import { BookingController } from "./BookingController";
import { BookingEntity } from "../persistence/entities/BookingEntity";
import { PropertyEntity } from "../persistence/entities/PropertyEntity";
import { UserEntity } from "../persistence/entities/UserEntity";
import { PropertyService } from "../../application/services/PropertyService";

const app = express();
app.use(express.json());

let dataSource = DataSource;
let bookingRepository: TypeORMBookingRepository;
let propertyRepository: TypeORMPropertyRepository;
let userRepository: TypeORMUserRepository;
let bookingService: BookingService;
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
  )

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
            id: "prop1",
            name: "Test Property",
            description: "A property for testing",
            maxGuests: 5,
            basePricePerNight: 100,
        });

        await userRepo.save({
            id: "user1",
            name: "Test User",
        });
    });
});