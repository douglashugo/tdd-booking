import { Property } from "../entities/Property";

export interface PropertyRepository {
    findById(id: string): Promise<Property | null>;
    save(property: Property): Promise<void>;
}