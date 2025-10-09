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

    it("deve salvar uma propriedade com sucesso usando o repositório fake e buscando novamente", async () => {
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