import { CreateBookingDTO } from "../dtos/CreateBookingDTO";
import { Booking } from "../../domain/entities/Booking";
import { BookingService } from "./BookingService";
import { FakeBookingRepository } from "../../infrastructure/repositories/FakeBookingRepository";
import { PropertyService } from "./PropertyService";
import { UserService } from "./UserService";

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

    it("deve criar uma reserva com sucesso usando repositório fake", async () => {

        const mockProperty = {
            getId: jest.fn().mockReturnValue("1"),
            isAvailable: jest.fn().mockReturnValue(true),
            validateGuestCount: jest.fn(),
            calculatePrice: jest.fn().mockReturnValue(500),
            addBooking: jest.fn()
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
            guestCount: 2
        };

        const result = await bookingService.createBooking(bookingDTO);

        expect(result).toBeInstanceOf(Booking);
        expect(result.getStatus()).toBe("CONFIRMED");
        expect(result.getTotalPrice()).toBe(500);

        const savedBooking = await fakeBookingRepository.findById(result.getId());
        expect(savedBooking).not.toBeNull();
        expect(savedBooking?.getId()).toBe(result.getId());
        
    });
});