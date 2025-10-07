import { PropertyRepository } from "../../domain/repositories/PropertyRepository";

export class PropertyService {
  constructor(private propertyRepository: PropertyRepository) {}

  async findPropertyById(id: string) {
    return this.propertyRepository.findById(id);
  }
}