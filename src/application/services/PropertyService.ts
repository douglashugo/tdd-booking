import { Property } from "../../domain/entities/Property";
import { PropertyRepository } from "../../domain/repositories/PropertyRepository";
import { CreatePropertyDTO } from "../dtos/CreatePropertyDTO";
import { v4 as uuidv4 } from "uuid";

export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async findPropertyById(id: string): Promise<Property | null> {
    return this.propertyRepository.findById(id);
  }

  async createProperty(dto: CreatePropertyDTO): Promise<Property> {
    const property = new Property(
      uuidv4(),
      dto.name,
      dto.description,
      dto.maxGuests,
      dto.basePricePerNight
    );

    await this.propertyRepository.save(property);
    return property;
  }
}
