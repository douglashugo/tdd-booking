
import { Property } from "../../../domain/entities/Property";
import { PropertyEntity } from "../entities/PropertyEntity";
import { PropertyMapper } from "./PropertyMapper";

describe("PropertyMapper", () => {
  const buildEntity = (): PropertyEntity => {
    const entity = new PropertyEntity();
    entity.id = "property-1";
    entity.name = "Beach House";
    entity.description = "Ocean view";
    entity.maxGuests = 6;
    entity.basePricePerNight = 250;
    return entity;
  };

  it("should convert PropertyEntity to Property correctly", () => {
    const entity = buildEntity();

    const domain = PropertyMapper.toDomain(entity);

    expect(domain).toBeInstanceOf(Property);
    expect(domain.getId()).toBe(entity.id);
    expect(domain.getName()).toBe(entity.name);
    expect(domain.getDescription()).toBe(entity.description);
    expect(domain.getMaxGuests()).toBe(entity.maxGuests);
    expect(domain.getBasePricePerNight()).toBe(Number(entity.basePricePerNight));
  });

  it("should convert Property to PropertyEntity correctly", () => {
    const domain = new Property("property-1", "Beach House", "Ocean view", 6, 250);

    const entity = PropertyMapper.toPersistence(domain);

    expect(entity).toBeInstanceOf(PropertyEntity);
    expect(entity.id).toBe(domain.getId());
    expect(entity.name).toBe(domain.getName());
    expect(entity.description).toBe(domain.getDescription());
    expect(entity.maxGuests).toBe(domain.getMaxGuests());
    expect(entity.basePricePerNight).toBe(domain.getBasePricePerNight());
  });

  it("should throw error when the required id is missing", () => {
    const entity = buildEntity();
    entity.id = "" as unknown as string;

    expect(() => PropertyMapper.toDomain(entity)).toThrow("ID is required");
  });

  it("should throw error when the required name is missing", () => {
    const entity = buildEntity();
    entity.name = "" as unknown as string;

    expect(() => PropertyMapper.toDomain(entity)).toThrow("Name is required");
  });
});
