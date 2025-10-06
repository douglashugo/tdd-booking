import { Property } from "../entities/Property";

export interface PropertyRepository {
    findPropertyById(id: string): Promise<Property | null>;
    save(property: Property): Promise<void>;
}