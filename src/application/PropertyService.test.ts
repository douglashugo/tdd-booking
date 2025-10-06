import { PropertyService } from "./PropertyService";
import { FakePropertyRepository } from "../infrastructure/repositories/FakePropertyRepository";
describe("PropertyService", () => {
    let propertyService: PropertyService;
    let fakePropertyRepository: FakePropertyRepository;

    beforeEach(() => {
        fakePropertyRepository = new FakePropertyRepository();
        propertyService = new PropertyService(fakePropertyRepository);
    });
    it("deve retornar null quando ID passado for inválido", async () => {
        const property = await propertyService.findPropertyById("999");
        expect(property).toBeNull();
    });

    it("deve retornar uma propriedade quando um ID válido for fornecido", async () => {
        const property = await propertyService.findPropertyById("1");
        expect(property?.getId()).toBe("1");
        expect(property?.getName()).toBe("Apartamento");
        expect(property).not.toBeNull();
    });
});