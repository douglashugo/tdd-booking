import express from "express";
import request from "supertest";
import { DataSource } from "typeorm";
import { TypeORMPropertyRepository } from "../repositories/TypeORMPropertyRepository";
import { PropertyService } from "../../application/services/PropertyService";
import { PropertyEntity } from "../persistence/entities/PropertyEntity";
import { BookingEntity } from "../persistence/entities/BookingEntity";
import { UserEntity } from "../persistence/entities/UserEntity";
import { PropertyController } from "./PropertyController";

const app = express();
app.use(express.json());

let dataSource: DataSource;
let propertyRepository: TypeORMPropertyRepository;
let propertyService: PropertyService;
let propertyController: PropertyController;

beforeAll(async () => {
  dataSource = new DataSource({
    type: "sqlite",
    database: ":memory:",
    dropSchema: true,
    entities: [PropertyEntity, BookingEntity, UserEntity],
    synchronize: true,
    logging: false,
  });

  await dataSource.initialize();

  propertyRepository = new TypeORMPropertyRepository(
    dataSource.getRepository(PropertyEntity)
  );
  propertyService = new PropertyService(propertyRepository);
  propertyController = new PropertyController(propertyService);

  app.post("/properties", (req, res, next) => {
    propertyController.createProperty(req, res).catch((err) => next(err));
  });
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("PropertyController E2E", () => {
  beforeEach(async () => {
    const propertyRepo = dataSource.getRepository(PropertyEntity);
    await propertyRepo.clear();
  });

  it("should create a property successfully", async () => {
    const response = await request(app).post("/properties").send({
      name: "Test Property",
      description: "A property for testing",
      maxGuests: 4,
      basePricePerNight: 120,
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Property created successfully");
    expect(response.body.property).toHaveProperty("id");
    expect(response.body.property.name).toBe("Test Property");
  });

  it("should return error with status 400 and message 'The property name is required.' when sending an empty name", async () => {
    const response = await request(app).post("/properties").send({
      name: "",
      description: "A property for testing",
      maxGuests: 4,
      basePricePerNight: 120,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The property name is required.");
  });

  it("should return error with status 400 and message 'The maximum capacity must be greater than zero.' when sending maxGuests equal to zero or negative", async () => {
    const response = await request(app).post("/properties").send({
      name: "Test Property",
      description: "A property for testing",
      maxGuests: 0,
      basePricePerNight: 120,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "The maximum capacity must be greater than zero."
    );
  });

  it("should return error with status 400 and message 'The base price per night is required.' when sending basePricePerNight missing", async () => {
    const response = await request(app).post("/properties").send({
      name: "Test Property",
      description: "A property for testing",
      maxGuests: 4,
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("The base price per night is required.");
  });
});
