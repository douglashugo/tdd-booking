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

        const savedUser = await repository.findOne({ where: { id: "1" }});
        expect(savedUser).not.toBeNull();
        expect(savedUser?.id).toBe("1");
    })

});
