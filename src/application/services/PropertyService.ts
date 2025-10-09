import { Property } from "../../domain/entities/Property";
import { PropertyRepository } from "../../domain/repositories/PropertyRepository";

export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async findPropertyById(id: string): Promise<Property | null> {
    return this.propertyRepository.findById(id);
  }
}