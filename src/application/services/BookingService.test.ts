import { CreateBookingDTO } from "../dtos/CreateBookingDTO";
import { Booking } from "../../domain/entities/Booking";
import { BookingService } from "./BookingService";
import { FakeBookingRepository } from "../../infrastructure/repositories/FakeBookingRepository";
import { PropertyService } from "./PropertyService";
import { UserService } from "./UserService";

jest.mock("./PropertyService");
jest.mock("./UserService")

describe("BookingService", () => {
  let bookingService: BookingService;
  let fakeBookingRepository: FakeBookingRepository;
  let mockPropertyService: jest.Mocked<PropertyService>;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    const mockPropertyRepository = {} as any;
    const mockUserRepository = {} as any;
    mockPropertyService = new PropertyService(
      mockPropertyRepository
    ) as jest.Mocked<PropertyService>;

    mockUserService = new UserService(
      mockUserRepository
    ) as jest.Mocked<UserService>;

    fakeBookingRepository = new FakeBookingRepository();
    bookingService = new BookingService(
      fakeBookingRepository,
      mockPropertyService,
      mockUserService
    );
  });

  it("should create a booking successfully using a fake repository", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestsCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);

    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2023-10-01"),
      endDate: new Date("2023-10-05"),
      guestCount: 2,
    };

    const result = await bookingService.createBooking(bookingDTO);

    expect(result).toBeInstanceOf(Booking);
    expect(result.getStatus()).toBe("CONFIRMED");
    expect(result.getTotalPrice()).toBe(500);

    const savedBooking = await fakeBookingRepository.findById(result.getId());
    expect(savedBooking).not.toBeNull();
    expect(savedBooking?.getId()).toBe(result.getId());
  });

  it("should throw error if property is not found", async () => {
    mockPropertyService.findPropertyById.mockResolvedValue(null);

    const bookingDTO: CreateBookingDTO = {
      propertyId: "999",
      guestId: "1",
      startDate: new Date("2023-10-01"),
      endDate: new Date("2023-10-05"),
      guestCount: 2,
    };

    await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
      "Property not found"
    );
  });

  
  it("should throw error if user is not found", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(null);

    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "999",
      startDate: new Date("2023-10-01"),
      endDate: new Date("2023-10-05"),
      guestCount: 2,
    };

    await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
      "Guest not found"
    );
  });

  it("should throw error if property is not available in the select period", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestsCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);

    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2023-10-01"),
      endDate: new Date("2023-10-05"),
      guestCount: 2,
    };

    const result = await bookingService.createBooking(bookingDTO);

    mockProperty.isAvailable.mockReturnValue(false);
    mockProperty.addBooking.mockImplementationOnce(() => {
      throw new Error("Property is not available in the selected period");
    });

    await expect(bookingService.createBooking(bookingDTO)).rejects.toThrow(
      "Property is not available in the selected period"
    );
  });

  it("should cancel an existing booking using a fake repository", async () => {
    const mockProperty = {
      getId: jest.fn().mockReturnValue("1"),
      isAvailable: jest.fn().mockReturnValue(true),
      validateGuestsCount: jest.fn(),
      calculateTotalPrice: jest.fn().mockReturnValue(500),
      addBooking: jest.fn(),
    } as any;

    const mockUser = {
      getId: jest.fn().mockReturnValue("1"),
    } as any;

    mockPropertyService.findPropertyById.mockResolvedValue(mockProperty);
    mockUserService.findUserById.mockResolvedValue(mockUser);

    const bookingDTO: CreateBookingDTO = {
      propertyId: "1",
      guestId: "1",
      startDate: new Date("2023-10-01"),
      endDate: new Date("2023-10-05"),
      guestCount: 2,
    };

    const booking = await bookingService.createBooking(bookingDTO);
    const spyFindById = jest.spyOn(fakeBookingRepository, "findById");
    await bookingService.cancelBooking(booking.getId());

    const canceledBooking = await fakeBookingRepository.findById(
        booking.getId()
    )

    expect(canceledBooking?.getStatus()).toBe("CANCELED");
    expect(spyFindById).toHaveBeenCalledTimes(2);
    expect(spyFindById).toHaveBeenCalledWith(booking.getId());
    spyFindById.mockRestore();
    
  });

});
