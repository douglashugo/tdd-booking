import { Request, Response } from "express";
import { PropertyService } from "../../application/services/PropertyService";
import { CreatePropertyDTO } from "../../application/dtos/CreatePropertyDTO";

export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  async createProperty(req: Request, res: Response): Promise<Response> {
    try {
      const { name, description, maxGuests, basePricePerNight } = req.body;

      if (!name || name.trim() === "") {
        return res
          .status(400)
          .json({ message: "The property name is required." });
      }

      if (maxGuests <= 0) {
        return res.status(400).json({
          message: "The maximum capacity must be greater than zero.",
        });
      }

      if (basePricePerNight === undefined || basePricePerNight === null) {
        return res.status(400).json({
          message: "The base price per night is required.",
        });
      }

      if (basePricePerNight <= 0) {
        return res.status(400).json({
          message: "The base price per night must be greater than zero.",
        });
      }

      const dto: CreatePropertyDTO = {
        name,
        description,
        maxGuests,
        basePricePerNight,
      };

      const property = await this.propertyService.createProperty(dto);

      return res.status(201).json({
        message: "Property created successfully",
        property: {
          id: property.getId(),
          name: property.getName(),
          description: property.getDescription(),
          maxGuests: property.getMaxGuests(),
          basePricePerNight: property.getBasePricePerNight(),
        },
      });
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: error.message || "An unexpected error occured" });
    }
  }
}
