import { DataSource, Repository } from "typeorm"
import { PropertyEntity } from "../persistence/entities/PropertyEntity"
import { TypeORMPropertyRepository } from "./TypeORMPropertyRepository"
import { Property } from "../../domain/entities/Property";

describe("TyperORMPropertyRepository", () => {

    let dataSource: DataSource
    let propertyRepository: TypeORMPropertyRepository
    let repository: Repository<PropertyEntity>

    beforeAll(async () => {
        dataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            dropSchema: true,
            entities: [PropertyEntity],
            synchronize: true,
            logging: false
        })
        await dataSource.initialize()
        repository = dataSource.getRepository(PropertyEntity)
        propertyRepository = new TypeORMPropertyRepository(repository)
    })

    afterAll(async () => {
        await dataSource.destroy();
    });

    it("deve salvar uma propriedade com sucesso", async() => {
        const property = new Property(
            "1",
            "Casa na Praia",
            "Vista para o mar",
            6,
            200
        );
        
        await propertyRepository.save(property);

        const savedProperty = await repository.findOne({ where: { id: "1" }});
        expect(savedProperty).not.toBeNull();
        expect(savedProperty?.id).toBe("1");
    });

    it("deve retornar uma propriedade com ID válido", async() => {
        const property = new Property(
            "1",
            "Casa na Praia",
            "Vista para o mar",
            6,
            200
        );
        
        await propertyRepository.save(property);

        const savedProperty = await propertyRepository.findById("1");
        expect(savedProperty).not.toBeNull();
        expect(savedProperty?.getId()).toBe("1");
        expect(savedProperty?.getName()).toBe("Casa na Praia");
    });

    it("deve retornar null ao buscar uma propriedade inexistente", async() => {
        const property = await propertyRepository.findById("999");
        expect(property).toBeNull();
    });

});
