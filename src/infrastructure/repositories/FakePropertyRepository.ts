import { Property } from "../../domain/entities/Property";
import { PropertyRepository } from "../../domain/repositories/PropertyRepository";

export class FakePropertyRepository implements PropertyRepository {
  private properties: Property[] = [
    new Property("1", "Apartamento", "Apartamento moderno", 4, 100),
    new Property("2", "Casa de praia", "Casa com vista para o mar", 6, 300),
  ];

  async findPropertyById(id: string): Promise<Property | null> {
    return this.properties.find((property) => property.getId() === id) || null;
  }
  async save(property: Property): Promise<void> {
    this.properties.push(property);
  }
}
