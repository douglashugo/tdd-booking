import { PropertyService } from "./PropertyService";
import { FakePropertyRepository } from "../../infrastructure/repositories/FakePropertyRepository";
import { Property } from "../../domain/entities/Property";
describe("PropertyService", () => {
    let propertyService: PropertyService;
    let fakePropertyRepository: FakePropertyRepository;

    beforeEach(() => {
        fakePropertyRepository = new FakePropertyRepository();
        propertyService = new PropertyService(fakePropertyRepository);
    });
    it("should return null when ID passed is invalid", async () => {
        const property = await propertyService.findPropertyById("999");
        expect(property).toBeNull();
    }); 

    it("should return a property when a valid ID is provided", async () => {
        const property = await propertyService.findPropertyById("1");
        expect(property?.getId()).toBe("1");
        expect(property?.getName()).toBe("Apartment");
        expect(property).not.toBeNull();
    });

    it("should save a property successfully using the fake repository and searching again", async () => {
        const newProperty = new Property (
            "3",
            "Test Property",
            "Test Description",
            2,
            150
        )
        await fakePropertyRepository.save(newProperty as any);

        const property = await fakePropertyRepository.findById("3");

        expect(property?.getId()).toBe("3");
        expect(property?.getName()).toBe("Test Property");
        expect(property).not.toBeNull();
    });
});