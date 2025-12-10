import { Repository } from "typeorm";
import { Property } from "../../domain/entities/Property";
import { PropertyRepository } from "../../domain/repositories/PropertyRepository";
import { PropertyEntity } from "../persistence/entities/PropertyEntity";
import { PropertyMapper } from "../persistence/mappers/PropertyMapper";

export class TypeORMPropertyRepository implements PropertyRepository {
    private readonly repository: Repository<PropertyEntity>;

    constructor(repository: Repository<PropertyEntity>) {
        this.repository = repository;
    }

    async save(property: Property): Promise<void> {
        const propertyEntity = PropertyMapper.toPersistence(property);
        await this.repository.save(propertyEntity);
    }

    findById(id: string): Promise<Property | null> {
        throw new Error("Method not implemented.")
    }
}