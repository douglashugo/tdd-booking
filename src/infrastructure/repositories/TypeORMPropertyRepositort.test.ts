import { DataSource, Repository } from "typeorm"
import { PropertyEntity } from "../persistence/entities/PropertyEntity"
import { TypeORMPropertyRepository } from "./TypeORMPropertyRepository"
import { Property } from "../../domain/entities/Property";
import { BookingEntity } from "../persistence/entities/BookingEntity";
import { UserEntity } from "../persistence/entities/UserEntity";

describe("TyperORMPropertyRepository", () => {

    let dataSource: DataSource
    let propertyRepository: TypeORMPropertyRepository
    let repository: Repository<PropertyEntity>

    beforeAll(async () => {
        dataSource = new DataSource({
            type: "sqlite",
            database: ":memory:",
            dropSchema: true,
            entities: [PropertyEntity, BookingEntity, UserEntity],
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

    it("should save a property successfully", async() => {
        const property = new Property(
            "1",
            "House by the Beach",
            "Sea view",
            6,
            200
        );
        
        await propertyRepository.save(property);

        const savedProperty = await repository.findOne({ where: { id: "1" }});
        expect(savedProperty).not.toBeNull();
        expect(savedProperty?.id).toBe("1");
    });

    it("should return a property with a valid ID", async() => {
        const property = new Property(
            "1",
            "House by the Beach",
            "Sea view",
            6,
            200
        );
        
        await propertyRepository.save(property);

        const savedProperty = await propertyRepository.findById("1");
        expect(savedProperty).not.toBeNull();
        expect(savedProperty?.getId()).toBe("1");
        expect(savedProperty?.getName()).toBe("House by the Beach");
    });

    it("should return null when searching for a non-existent property", async() => {
        const property = await propertyRepository.findById("999");
        expect(property).toBeNull();
    });

});
